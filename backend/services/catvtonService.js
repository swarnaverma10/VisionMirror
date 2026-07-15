/**
 * catvtonService.js
 * ─────────────────
 * Calls the CatVTON Gradio app API running at CATVTON_API_URL (default http://localhost:7860).
 *
 * CatVTON's app.py uses Gradio, which exposes a two-step REST API:
 *   Step 1  POST  /upload                   → upload image files, get temp paths
 *   Step 2  POST  /call/<fn_name>           → submit inference job, get event_id
 *   Step 3  GET   /call/<fn_name>/<event_id>→ SSE stream, poll until "complete"
 *   Step 4  GET   /file=<path>              → download the result image
 *
 * If the server at CATVTON_API_URL is our custom FastAPI proxy (server.py),
 * it exposes a simpler POST /api/tryon endpoint that handles everything internally.
 * We detect which server is running and use the appropriate protocol.
 */

import axios      from 'axios';
import FormData   from 'form-data';
import fs         from 'fs';
import readline   from 'readline';
import config     from '../config/index.js';

const BASE = config.catvton.apiUrl; // default: http://localhost:7860
const AUTH = config.catvton.apiKey
  ? { Authorization: `Bearer ${config.catvton.apiKey}` }
  : {};

// ── Detect server type ────────────────────────────────────────────────────────
let _serverType = null; // 'rest' | 'gradio' | null (unknown yet)

async function detectServerType() {
  if (_serverType) return _serverType;
  try {
    const { data } = await axios.get(`${BASE}/`, { timeout: 5000 });
    // Our custom server.py returns { status: 'ok', message: 'CatVTON REST API running...' }
    if (data?.message?.includes('REST API')) {
      _serverType = 'rest';
    } else {
      _serverType = 'gradio';
    }
  } catch {
    // If / 404s or errors, try /gradio_api/info (Gradio 5-specific)
    try {
      await axios.get(`${BASE}/gradio_api/info`, { timeout: 5000 });
      _serverType = 'gradio';
    } catch {
      _serverType = 'gradio'; // assume gradio as default (app.py)
    }
  }
  console.log(`[catvtonService] Detected server type: ${_serverType}`);
  return _serverType;
}

// ── REST API path (custom server.py) ─────────────────────────────────────────
async function callRestApi(photoPath, garmentPath, gender) {
  const form = new FormData();
  form.append('person_image', fs.createReadStream(photoPath));
  form.append('cloth_image',  fs.createReadStream(garmentPath));
  form.append('cloth_type',   gender === 'men' ? 'upper' : 'overall');

  const response = await axios.post(
    `${BASE}/api/tryon`,
    form,
    { headers: { ...form.getHeaders(), ...AUTH }, responseType: 'arraybuffer', timeout: 300_000 }
  );
  return Buffer.from(response.data);
}

// ── Gradio API path (Gradio app.py) ───────────────────────────────────────────
async function callGradioApi(photoPath, garmentPath, gender) {
  const headers = { ...AUTH };

  // ── 1. Upload images ────────────────────────────────────────────────────────
  const personForm = new FormData();
  personForm.append('files', fs.createReadStream(photoPath));
  const personUp = await axios.post(`${BASE}/gradio_api/upload`, personForm, {
    headers: { ...personForm.getHeaders(), ...headers },
    timeout: 30_000,
  });
  const personPath = personUp.data[0]; // e.g. "/tmp/gradio/abc123/person.jpg"

  const clothForm = new FormData();
  clothForm.append('files', fs.createReadStream(garmentPath));
  const clothUp = await axios.post(`${BASE}/gradio_api/upload`, clothForm, {
    headers: { ...clothForm.getHeaders(), ...headers },
    timeout: 30_000,
  });
  const clothPath = clothUp.data[0];

  // ── 2. Get API info to find the function name ───────────────────────────────
  let fnName = 'predict_1'; // fallback to submit.click
  try {
    const infoRes = await axios.get(`${BASE}/gradio_api/info`, {
      headers,
      timeout: 10_000,
    });
    const namedEndpoints = infoRes.data?.named_endpoints || {};
    if (namedEndpoints['/submit_function']) {
      fnName = 'submit_function';
    } else if (namedEndpoints['/predict_1']) {
      fnName = 'predict_1';
    } else if (Object.keys(namedEndpoints).length > 0) {
      const submitKey = Object.keys(namedEndpoints).find(k => k.toLowerCase().includes('submit'));
      if (submitKey) {
        fnName = submitKey.replace(/^\//, '');
      } else {
        fnName = Object.keys(namedEndpoints)[0].replace(/^\//, '');
      }
    }
  } catch {
    // use default 'predict_1' for CatVTON app.py
  }
  console.log(`[catvtonService] Using Gradio fn: ${fnName}`);

  // ── 3. Submit inference ─────────────────────────────────────────────────────
  const clothType = gender === 'men' ? 'upper' : 'overall';

  // CatVTON submit_function expects ImageEditor format for person_image
  const payload = {
    data: [
      { 
        background: { 
          path: personPath,
          meta: { _type: 'gradio.FileData' }
        }, 
        layers: [], 
        composite: null 
      }, // person_image (ImageEditor)
      { 
        path: clothPath,
        meta: { _type: 'gradio.FileData' }
      },   // cloth_image
      clothType,             // cloth_type
      50,                    // num_inference_steps
      2.5,                   // guidance_scale
      42,                    // seed
      'result only',         // show_type
    ],
  };

  const submitUrl = `${BASE}/gradio_api/call/${fnName}`;
  console.log(`[catvtonService] Submitting to: ${submitUrl}`);

  const submitRes = await axios.post(submitUrl, payload, {
    headers: { 'Content-Type': 'application/json', ...headers },
    timeout: 60_000,
  });

  const eventId = submitRes.data?.event_id;
  if (!eventId) {
    throw new Error(`Gradio did not return an event_id. Response: ${JSON.stringify(submitRes.data)}`);
  }
  console.log(`[catvtonService] Event ID: ${eventId} — polling result...`);

  // ── 4. Poll SSE stream for completion ──────────────────────────────────────
  const pollUrl = `${BASE}/gradio_api/call/${fnName}/${eventId}`;
  
  const resultData = await new Promise((resolve, reject) => {
    axios.get(pollUrl, {
      headers,
      responseType: 'stream',
      timeout: 300_000,
    }).then(response => {
      const stream = response.data;
      const rl = readline.createInterface({
        input: stream,
        terminal: false
      });

      let seenComplete = false;
      let hasErrorEvent = false;
      let rawDataLogged = '';

      rl.on('line', (line) => {
        rawDataLogged += line + '\n';
        const trimmed = line.trim();
        if (trimmed === 'event: error') {
          hasErrorEvent = true;
        } else if (trimmed === 'event: complete') {
          seenComplete = true;
        } else if (line.startsWith('data:')) {
          const dataStr = line.slice(5).trim();
          if (hasErrorEvent) {
            console.error(`[catvtonService] Gradio SSE returned error event. Raw Stream So Far:\n${rawDataLogged}`);
            rl.close();
            stream.destroy();
            reject(new Error(`Gradio SSE stream returned event: error. Data: ${dataStr}`));
          } else if (seenComplete) {
            try {
              const parsed = JSON.parse(dataStr);
              rl.close();
              stream.destroy();
              resolve(parsed);
            } catch (e) {
              // keep parsing
            }
          } else {
            // Some Gradio versions send data without explicit event: complete
            try {
              const parsed = JSON.parse(dataStr);
              if (Array.isArray(parsed)) {
                rl.close();
                stream.destroy();
                resolve(parsed);
              }
            } catch (e) {
              // skip
            }
          }
        }
      });

      rl.on('error', (err) => {
        reject(err);
      });

      stream.on('end', () => {
        reject(new Error(`Gradio SSE stream ended without complete event. Raw Logged:\n${rawDataLogged}`));
      });
    }).catch(err => {
      reject(err);
    });
  });

  // ── 5. Extract image path from result ──────────────────────────────────────
  const output = resultData[0];
  let imgPath;
  if (typeof output === 'string') {
    imgPath = output;
  } else if (output && typeof output === 'object') {
    imgPath = output.path || output.url || output.value;
  }

  if (!imgPath) {
    throw new Error(`No image path in Gradio result: ${JSON.stringify(resultData)}`);
  }
  console.log(`[catvtonService] Result image path: ${imgPath}`);

  // ── 6. Download result image ────────────────────────────────────────────────
  const fetchUrl = imgPath.startsWith('http') ? imgPath : `${BASE}/gradio_api/file=${imgPath}`;
  console.log(`[catvtonService] Fetching image from: ${fetchUrl}`);

  const imgRes = await axios.get(fetchUrl, {
    headers,
    responseType: 'arraybuffer',
    timeout: 60_000,
  });
  return Buffer.from(imgRes.data);
}

// ── Public API ────────────────────────────────────────────────────────────────
/**
 * Call CatVTON to generate a virtual try-on image.
 *
 * @param {string} photoPath    - Absolute path to the user photo
 * @param {string} garmentPath  - Absolute path to the garment image
 * @param {string} gender       - 'women' | 'men' | 'kids'
 * @returns {Promise<Buffer>}   - JPEG image buffer
 */
export async function generateTryOn(photoPath, garmentPath, gender) {
  const serverType = await detectServerType();
  console.log(`[catvtonService] CatVTON Endpoint URL: ${BASE}`);
  console.log(`[catvtonService] Request Payload: photoPath=${photoPath}, garmentPath=${garmentPath}, gender=${gender}`);

  try {
    if (serverType === 'rest') {
      console.log('[catvtonService] Using REST API (server.py)');
      return await callRestApi(photoPath, garmentPath, gender);
    } else {
      console.log('[catvtonService] Using Gradio API (app.py)');
      return await callGradioApi(photoPath, garmentPath, gender);
    }
  } catch (err) {
    console.error('[catvtonService] ERROR DETAILS:');
    console.error(`- URL attempted: ${err.config?.url || 'N/A'}`);
    console.error(`- Method: ${err.config?.method || 'N/A'}`);
    console.error(`- Status: ${err.response?.status || 'N/A'}`);
    console.error(`- Response Data: ${JSON.stringify(err.response?.data) || 'N/A'}`);
    console.error(`- Stack: ${err.stack}`);
    throw err;
  }
}