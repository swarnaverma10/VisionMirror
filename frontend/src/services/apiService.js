import axios from 'axios';

// ─── Axios Instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'),
  timeout: 60000, // 60s for AI calls
  // NOTE: Do NOT set a default Content-Type here.
  // Axios will auto-set 'application/json' for JSON bodies and
  // 'multipart/form-data; boundary=...' for FormData — overriding breaks uploads.
});

// ─── Request Interceptor ──────────────────────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    // Attach auth token if available (for future use)
    const token = localStorage.getItem('vm_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    return Promise.reject(new Error(message));
  }
);

// ─── Upload File ─────────────────────────────────────────────────────────────

/**
 * Upload a file (user photo or garment).
 * @param {File} file
 * @param {function} onProgress  - optional upload progress callback (0-100)
 * @returns {Promise<{ imageUrl: string, filename: string }>}
 */
export async function uploadFile(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post('/upload', formData, {
    // No Content-Type override — browser/Axios auto-sets multipart/form-data + boundary
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return data;
}

// ─── Generate Try-On ──────────────────────────────────────────────────────────

/**
 * Call backend to generate try-on image.
 * @param {{ userImage: string, outfitImage: string, gender?: string }} payload
 * @returns {Promise<{ resultUrl: string }>}
 */
export async function generateTryOn(payload) {
  // CatVTON inference (especially cold GPU warm-up) can exceed the default
  // 60s client timeout, so only this call gets an extended timeout.
  const { data } = await api.post('/tryon', payload, { timeout: 300000 });
  return data;
}

// ─── Generate Stylist Recommendations ─────────────────────────────────────────

/**
 * Fetch AI stylist recommendations from backend.
 * @param {{ category: string, outfitName: string, color: string, fabric: string, occasion: string, style: string }} payload
 * @returns {Promise<{ summary: string, tips: string[], occasion: string, fabric: string, color: string }>}
 */
export async function generateStylist(payload) {
  const { data } = await api.post('/stylist', payload);
  return data;
}

// ─── Get Collections ──────────────────────────────────────────────────────────

/**
 * Fetch garment collections from backend.
 * @param {{ gender: string, category: string }} params
 * @returns {Promise<{ items: object[] }>}
 */
export async function getCollections(params) {
  const { data } = await api.get('/collections', { params });
  return data;
}

export default api;