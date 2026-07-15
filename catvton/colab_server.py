import os
import io
import torch
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.responses import Response
from PIL import Image
import numpy as np
from diffusers.image_processor import VaeImageProcessor
from huggingface_hub import snapshot_download
import pillow_avif

from model.cloth_masker import AutoMasker
from model.pipeline import CatVTONPipeline
from utils import init_weight_dtype, resize_and_crop, resize_and_padding

# Initialize FastAPI
app = FastAPI(title="CatVTON Colab GPU REST API", version="2.0")

# Global variables for models
pipeline = None
automasker = None
mask_processor = VaeImageProcessor(vae_scale_factor=8, do_normalize=False, do_binarize=True, do_convert_grayscale=True)

# Fixed resolution matching model requirements
WIDTH = 768
HEIGHT = 1024

@app.on_event("startup")
def startup_event():
    global pipeline, automasker
    print("[colab_server] Loading CatVTON models to GPU (CUDA)...")
    
    # 1. Download weights from HuggingFace Hub
    repo_path = snapshot_download(repo_id="zhengchong/CatVTON")
    
    # 2. Load CatVTON Pipeline
    pipeline = CatVTONPipeline(
        base_ckpt="booksforcharlie/stable-diffusion-inpainting",
        attn_ckpt=repo_path,
        attn_ckpt_version="mix",
        weight_dtype=torch.bfloat16,
        use_tf32=True,
        skip_safety_check=True,
        device='cuda'
    )
    
    # 3. Load AutoMasker
    automasker = AutoMasker(
        densepose_ckpt=os.path.join(repo_path, "DensePose"),
        schp_ckpt=os.path.join(repo_path, "SCHP"),
        device='cuda',
    )
    print("[colab_server] Models loaded successfully!")

@app.get("/")
def health():
    return {
        "status": "ready",
        "device": "cuda" if torch.cuda.is_available() else "cpu",
        "message": "CatVTON REST API running on Google Colab"
    }

@app.post("/api/tryon")
async def tryon(
    person_image: UploadFile = File(...),
    cloth_image:  UploadFile = File(...),
    cloth_type:   str        = Form("overall"),
):
    """
    Direct REST try-on endpoint.
    Receives person_image, cloth_image, and cloth_type, performs inference on GPU,
    and returns raw generated JPEG bytes.
    """
    if not torch.cuda.is_available():
        raise HTTPException(status_code=500, detail="CUDA GPU is not available on this runtime!")

    try:
        # Load images from request stream
        person_bytes = await person_image.read()
        cloth_bytes = await cloth_image.read()
        
        person_pil = Image.open(io.BytesIO(person_bytes)).convert("RGB")
        cloth_pil = Image.open(io.BytesIO(cloth_bytes)).convert("RGB")
        
        # Preprocess person and cloth
        person_resized = resize_and_crop(person_pil, (WIDTH, HEIGHT))
        cloth_resized = resize_and_padding(cloth_pil, (WIDTH, HEIGHT))
        
        # Run automasker to detect and segment the garment area
        mask_data = automasker(person_resized, cloth_type)
        mask = mask_data['mask']
        mask = mask_processor.blur(mask, blur_factor=9)
        
        # Run inference pipeline
        generator = torch.Generator(device='cuda').manual_seed(42)
        
        result_pil = pipeline(
            image=person_resized,
            condition_image=cloth_resized,
            mask=mask,
            num_inference_steps=50,
            guidance_scale=2.5,
            generator=generator
        )[0]
        
        # Save output to bytes
        img_byte_arr = io.BytesIO()
        result_pil.save(img_byte_arr, format='JPEG', quality=95)
        img_bytes = img_byte_arr.getvalue()
        
        return Response(content=img_bytes, media_type="image/jpeg")
        
    except Exception as e:
        print("[colab_server] ERROR DURING INFERENCE:", e)
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
