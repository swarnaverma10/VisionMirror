/**
 * Format a price in Indian Rupees.
 * @param {number} amount
 * @returns {string} e.g. "₹2,499"
 */
export function formatPrice(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Convert a File or Blob to a data URL (base64).
 * @param {File|Blob} file
 * @returns {Promise<string>}
 */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert a base64 data URL to a File object.
 * @param {string} dataUrl
 * @param {string} filename
 * @returns {File}
 */
export function dataUrlToFile(dataUrl, filename = 'photo.jpg') {
  const arr    = dataUrl.split(',');
  const mime   = arr[0].match(/:(.*?);/)[1];
  const bstr   = atob(arr[1]);
  let   n      = bstr.length;
  const u8arr  = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

/**
 * Create a local object URL from a File.
 * Remember to call URL.revokeObjectURL when done.
 * @param {File|Blob} file
 * @returns {string}
 */
export function createObjectUrl(file) {
  return URL.createObjectURL(file);
}

/**
 * Clamp a number between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Toggle a value in an array (add if missing, remove if present).
 * @template T
 * @param {T[]} arr
 * @param {T} value
 * @returns {T[]}
 */
export function toggleInArray(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

/**
 * Capitalise first letter.
 * @param {string} str
 * @returns {string}
 */
export function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Trigger a file download from a URL.
 * @param {string} url
 * @param {string} filename
 */
export function downloadFile(url, filename = 'visionmirror-look.jpg') {
  const a = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
}

/**
 * Share using the Web Share API (falls back to clipboard copy).
 * @param {{ title: string, text: string, url: string }} data
 */
export async function shareContent(data) {
  if (navigator.share) {
    await navigator.share(data);
  } else {
    await navigator.clipboard.writeText(data.url || data.text || '');
  }
}

/**
 * Delay utility.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if the device has a camera.
 * @returns {Promise<boolean>}
 */
export async function hasCameraAccess() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((d) => d.kind === 'videoinput');
  } catch {
    return false;
  }
}

/**
 * Resolve relative asset or upload paths to complete URLs if necessary.
 * @param {string} path - URL path
 * @returns {string}
 */
export function getImageUrl(path) {
  if (!path) return '';
  if (
    path.startsWith('data:') ||
    path.startsWith('blob:') ||
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    return path;
  }
  // Try resolving with Vite environment or fall back to default backend URL
  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : (import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '')
        : 'http://localhost:5000');
  return `${baseUrl}/${path.replace(/^\//, '')}`;
}

