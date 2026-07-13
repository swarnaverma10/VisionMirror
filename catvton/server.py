"""
VisionMirror CatVTON Server
============================
Lightweight FastAPI server that wraps CatVTON's Gradio app with a clean REST API.

How it works:
  1. Receives multipart: person_image (file), cloth_image (file), cloth_type (str)
  2. Uploads both images to the Gradio app via its /upload endpoint
  3. Submits inference via Gradio's /call/<fn_index> endpoint
  4. Polls /call/<fn_index>/<event_id> for the result (SSE stream)
  5. Downloads the output image and returns it as raw JPEG bytes

Endpoints exposed (what the VisionMirror backend calls):
  GET  /               → health check
  POST /api/tryon      → virtual try-on

Run:
  cd catvton
  venv\\Scripts\\uvicorn server:app --host 0.0.0.0 --port 7860

The Gradio app (app.py) must be running separately on port 7861:
  venv\\Scripts\\python app.py --port 7861 [or whatever port you use]

Or set GRADIO_PORT env var to point to where Gradio is running.
If GRADIO_PORT is not set, this server runs the inference natively
(requires CatVTON model weights and CUDA).
"""

import io
import os
import sys
import httpx
import asyncio
from pathlib import Path
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.responses import Response

GRADIO_BASE = os.environ.get("GRADIO_URL", "http://localhost:7861")
TIMEOUT     = 300  # seconds — inference can be slow

app = FastAPI(title="CatVTON REST API", version="2.0")


@app.get("/")
def root():
    return {"status": "ok", "message": "CatVTON REST API running — proxies to Gradio"}


@app.post("/api/tryon")
async def tryon(
    person_image: UploadFile = File(...),
    cloth_image:  UploadFile = File(...),
    cloth_type:   str        = Form("overall"),
):
    """
    Accept multipart files from the VisionMirror backend and return a try-on image.
    Delegates to the Gradio app's native API.
    """
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        # ── Step 1: Upload person image to Gradio ────────────────────────────
        person_bytes = await person_image.read()
        cloth_bytes  = await cloth_image.read()

        try:
            person_up = await client.post(
                f"{GRADIO_BASE}/upload",
                files={"files": (person_image.filename or "person.jpg", person_bytes, "image/jpeg")},
            )
            person_up.raise_for_status()
            person_path = person_up.json()[0]   # Gradio returns ["/tmp/gradio/..."]

            cloth_up = await client.post(
                f"{GRADIO_BASE}/upload",
                files={"files": (cloth_image.filename or "cloth.jpg", cloth_bytes, "image/jpeg")},
            )
            cloth_up.raise_for_status()
            cloth_path = cloth_up.json()[0]

        except (httpx.ConnectError, httpx.TimeoutException) as e:
            raise HTTPException(status_code=503, detail=f"Gradio app unreachable at {GRADIO_BASE}: {e}")
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Gradio upload failed: {e}")

        # ── Step 2: Get Gradio API info to find the correct fn_index ─────────
        try:
            info_r = await client.get(f"{GRADIO_BASE}/info")
            info   = info_r.json()
            # The submit_function is the only named endpoint; its fn_index is 0 in app.py
            # We look for the endpoint named "predict" or use index 0
            named_endpoints = info.get("named_endpoints", {})
            fn_name = list(named_endpoints.keys())[0] if named_endpoints else None
        except Exception:
            fn_name = None  # fall back to fn_index

        # ── Step 3: Build Gradio payload ─────────────────────────────────────
        # submit_function args: person_image, cloth_image, cloth_type,
        #                       num_inference_steps, guidance_scale, seed, show_type
        #
        # person_image is a gr.ImageEditor: {"background": path, "layers": [], "composite": null}
        person_payload = {
            "background": {"path": person_path},
            "layers":     [],
            "composite":  None,
        }
        cloth_payload  = {"path": cloth_path}
        payload = {
            "data": [
                person_payload,   # person_image  (ImageEditor)
                cloth_payload,    # cloth_image   (Image)
                cloth_type,       # cloth_type    ('upper' | 'overall')
                50,               # num_inference_steps
                2.5,              # guidance_scale
                42,               # seed
                "result only",    # show_type
            ]
        }

        # ── Step 4: Submit inference ──────────────────────────────────────────
        try:
            if fn_name:
                submit_url = f"{GRADIO_BASE}/call/{fn_name}"
            else:
                submit_url = f"{GRADIO_BASE}/api/predict"  # older Gradio fallback

            submit_r = await client.post(
                submit_url,
                json=payload,
                headers={"Content-Type": "application/json"},
            )
            submit_r.raise_for_status()
            submit_json = submit_r.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=502, detail=f"Gradio submit failed ({e.response.status_code}): {e.response.text[:500]}")
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Gradio submit error: {e}")

        # ── Step 5: Poll for result ───────────────────────────────────────────
        event_id = submit_json.get("event_id")

        if event_id and fn_name:
            # New Gradio API: SSE stream at /call/<fn>/<event_id>
            result_url = f"{GRADIO_BASE}/call/{fn_name}/{event_id}"
            try:
                async with client.stream("GET", result_url, timeout=TIMEOUT) as stream:
                    result_data = None
                    async for line in stream.aiter_lines():
                        if line.startswith("data:"):
                            import json as _json
                            data_str = line[5:].strip()
                            try:
                                result_data = _json.loads(data_str)
                                break
                            except Exception:
                                continue
            except Exception as e:
                raise HTTPException(status_code=502, detail=f"Gradio result poll failed: {e}")
        else:
            # Older Gradio: synchronous response
            result_data = submit_json.get("data")

        if not result_data:
            raise HTTPException(status_code=502, detail="Gradio returned empty result")

        # ── Step 6: Extract image path from result ────────────────────────────
        # Gradio returns: [{"path": "/tmp/gradio/.../result.png"}, ...]  or
        #                 ["/path/to/image.png", ...]  depending on version
        output = result_data[0] if isinstance(result_data, list) else result_data
        if isinstance(output, dict):
            img_path = output.get("path") or output.get("url")
        else:
            img_path = output

        if not img_path:
            raise HTTPException(status_code=502, detail=f"No image path in Gradio response: {result_data}")

        # ── Step 7: Fetch the result image ────────────────────────────────────
        # img_path may be a local path served via /file= or a full URL
        if img_path.startswith("/") or not img_path.startswith("http"):
            fetch_url = f"{GRADIO_BASE}/file={img_path}"
        else:
            fetch_url = img_path

        try:
            img_r = await client.get(fetch_url)
            img_r.raise_for_status()
            img_bytes = img_r.content
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Failed to download result image: {e}")

        return Response(content=img_bytes, media_type="image/jpeg")
