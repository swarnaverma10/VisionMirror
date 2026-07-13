// ─── App Constants ───────────────────────────────────────────────────────────

export const APP_NAME = 'VisionMirror';
export const APP_TAGLINE = 'AI-Powered Virtual Try-On Experience';
export const APP_SUBTITLE = 'See Your Style, Instantly';

// ─── Routes ──────────────────────────────────────────────────────────────────

export const ROUTES = {
  LANDING:           '/',
  COMPLETE_PROFILE:  '/complete-profile',
  CAMERA_CAPTURE:    '/camera-capture',
  PHOTO_PREVIEW:     '/photo-preview',
  COLLECTIONS:       '/collections',
  PREFERENCES:       '/preferences',
  SCAN_PREVIEW:      '/scan-preview',
  EXPLORE_MODELS:    '/explore-models',
  TRYON:             '/tryon',
  AI_STYLIST:        '/ai-stylist',
  FINAL_LOOK:        '/final-look',
  THANK_YOU:         '/thank-you',
};

// ─── Gender Options ───────────────────────────────────────────────────────────

export const GENDERS = [
  { id: 'women', label: 'Women', icon: 'User' },
  { id: 'men',   label: 'Men',   icon: 'User' },
  { id: 'kids',  label: 'Kids',  icon: 'Baby' },
];

// ─── Category Filters ─────────────────────────────────────────────────────────

export const COLLECTION_CATEGORIES = [
  { id: 'all',     label: 'All' },
  { id: 'tops',    label: 'Tops' },
  { id: 'dresses', label: 'Dresses' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'outfits', label: 'Outfits' },
];

// ─── Wardrobe Categories (Preferences) ───────────────────────────────────────

export const WARDROBE_CATEGORIES = [
  { id: 'tops',      label: 'Tops',       icon: 'Shirt' },
  { id: 'dresses',   label: 'Dresses',    icon: 'Sparkles' },
  { id: 'shorts',    label: 'Shorts',     icon: 'Scissors' },
  { id: 'tshirts',   label: 'T-Shirts',   icon: 'Shirt' },
  { id: 'jeans',     label: 'Jeans',      icon: 'Minus' },
  { id: 'trousers',  label: 'Trousers',   icon: 'Minus' },
  { id: 'jackets',   label: 'Jackets',    icon: 'Wind' },
  { id: 'blazers',   label: 'Blazers',    icon: 'Briefcase' },
  { id: 'skirts',    label: 'Skirts',     icon: 'Triangle' },
  { id: 'coords',    label: 'Co-ords',    icon: 'Layers' },
  { id: 'kurtas',    label: 'Kurtas',     icon: 'Star' },
  { id: 'athleisure',label: 'Athleisure', icon: 'Zap' },
  { id: 'footwear',  label: 'Footwear',   icon: 'Footprints' },
  { id: 'accessories',label: 'Accessories',icon: 'Watch' },
];

// ─── Occasion Options ─────────────────────────────────────────────────────────

export const OCCASIONS = [
  'Office Wear',
  'Casual',
  'Party Wear',
  'Festive Wear',
  'Vacation',
  'Date Night',
  'Athleisure',
  'School / College',
  'Other',
];

// ─── Color Preferences ────────────────────────────────────────────────────────

export const COLOR_PREFERENCES = [
  { id: 'black',  label: 'Black',  hex: '#1a1a1a' },
  { id: 'white',  label: 'White',  hex: '#f5f5f5' },
  { id: 'beige',  label: 'Beige',  hex: '#C4A882' },
  { id: 'blue',   label: 'Blue',   hex: '#2563EB' },
  { id: 'brown',  label: 'Brown',  hex: '#7A5C3A' },
  { id: 'grey',   label: 'Grey',   hex: '#6B7280' },
  { id: 'pink',   label: 'Pink',   hex: '#EC4899' },
  { id: 'red',    label: 'Red',    hex: '#DC2626' },
  { id: 'green',  label: 'Green',  hex: '#16A34A' },
  { id: 'purple', label: 'Purple', hex: '#9333EA' },
];

// ─── Style Preferences ────────────────────────────────────────────────────────

export const STYLE_PREFERENCES = [
  'Minimal',
  'Trendy',
  'Elegant',
  'Traditional',
  'Street Style',
  'Boho',
  'Chic',
  'Classic',
  'Other',
];

// ─── Tips Content ─────────────────────────────────────────────────────────────

export const PHOTO_TIPS = [
  'Stand straight',
  'Good lighting',
  'Keep full body visible',
  'Remove bags / accessories',
  'Camera at eye level',
];

// ─── Camera Config ────────────────────────────────────────────────────────────

export const CAMERA_COUNTDOWN = 5; // seconds

// ─── API Endpoints ────────────────────────────────────────────────────────────

export const API_ENDPOINTS = {
  UPLOAD_PHOTO:      '/upload/photo',
  UPLOAD_GARMENT:    '/upload/garment',
  TRYON_GENERATE:    '/tryon/generate',
  RECOMMENDATIONS:   '/recommendations',
  COLLECTIONS:       '/collections',
};

// ─── Mock Collections ─────────────────────────────────────────────────────────

export const MOCK_COLLECTIONS = {
  women: [
    { id: 'w1', name: 'Beige Blazer',  price: 2499, category: 'outfits',  gender: 'women', image: null, wishlist: false },
    { id: 'w2', name: 'Black Dress',   price: 1999, category: 'dresses',  gender: 'women', image: null, wishlist: false },
    { id: 'w3', name: 'Floral Dress',  price: 2199, category: 'dresses',  gender: 'women', image: null, wishlist: false },
    { id: 'w4', name: 'White Shirt',   price: 1299, category: 'tops',     gender: 'women', image: null, wishlist: false },
    { id: 'w5', name: 'Denim Jacket',  price: 1499, category: 'jackets',  gender: 'women', image: null, wishlist: false },
    { id: 'w6', name: 'Co-ord Set',    price: 2799, category: 'outfits',  gender: 'women', image: null, wishlist: false },
  ],
  men: [
    { id: 'm1', name: 'Slim Chinos',   price: 1799, category: 'bottoms',  gender: 'men',   image: null, wishlist: false },
    { id: 'm2', name: 'Oxford Shirt',  price: 1299, category: 'tops',     gender: 'men',   image: null, wishlist: false },
    { id: 'm3', name: 'Blazer Set',    price: 3499, category: 'outfits',  gender: 'men',   image: null, wishlist: false },
    { id: 'm4', name: 'Casual Tee',    price:  799, category: 'tops',     gender: 'men',   image: null, wishlist: false },
    { id: 'm5', name: 'Denim Jacket',  price: 1999, category: 'jackets',  gender: 'men',   image: null, wishlist: false },
    { id: 'm6', name: 'Jogger Set',    price: 1599, category: 'outfits',  gender: 'men',   image: null, wishlist: false },
  ],
  kids: [
    { id: 'k1', name: 'Floral Frock',  price:  999, category: 'dresses',  gender: 'kids',  image: null, wishlist: false },
    { id: 'k2', name: 'Denim Set',     price: 1299, category: 'outfits',  gender: 'kids',  image: null, wishlist: false },
    { id: 'k3', name: 'Cotton Tee',    price:  599, category: 'tops',     gender: 'kids',  image: null, wishlist: false },
    { id: 'k4', name: 'Cargo Pants',   price:  899, category: 'bottoms',  gender: 'kids',  image: null, wishlist: false },
  ],
};
