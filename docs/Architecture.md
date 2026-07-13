# VisionMirror — Project Foundation

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Frontend    | React 19, Vite, Tailwind CSS, Framer Motion, React Router |
| State       | Context API + useReducer                |
| HTTP        | Axios (services only)                   |
| Camera      | react-webcam                            |
| Carousel    | Swiper.js                               |
| Icons       | Lucide React                            |
| Backend     | Node.js, Express                        |
| Uploads     | Multer                                  |
| AI (Try-On) | CatVTON                                 |
| AI (Recs)   | OpenRouter                              |

---

## Project Structure

```
VisionMirror/
├── frontend/
│   ├── index.html              # SEO meta, fonts
│   ├── vite.config.js          # Path aliases + API proxy
│   ├── tailwind.config.js      # Brand palette, animations
│   ├── postcss.config.js
│   ├── .env
│   └── src/
│       ├── main.jsx            # React 19 root
│       ├── App.jsx             # Providers + Router
│       ├── styles/index.css    # Tailwind + component layer
│       ├── constants/index.js  # All app-wide constants
│       ├── context/
│       │   ├── AppContext.jsx       # Global session state
│       │   └── CollectionsContext.jsx
│       ├── hooks/index.js      # useCountdown, useToggle, useMultiSelect
│       ├── services/
│       │   └── apiService.js   # All Axios calls
│       ├── utils/helpers.js    # Formatting, file, share utils
│       ├── routes/index.jsx    # Lazy-loaded routes
│       ├── components/
│       │   ├── Loader/PageLoader.jsx
│       │   └── Common/Toast.jsx
│       └── pages/              # 11 screen stubs — ready to implement
│           ├── Landing/
│           ├── CompleteProfile/
│           ├── CameraCapture/
│           ├── PhotoPreview/
│           ├── Collections/
│           ├── Preferences/
│           ├── ModelSuggestions/
│           ├── TryOn/
│           ├── AIStylist/
│           ├── FinalLook/
│           └── ThankYou/
└── backend/
    ├── server.js               # Express entry
    ├── config/index.js
    ├── middleware/
    │   ├── upload.js           # Multer
    │   └── errorHandler.js
    ├── routes/                 # upload / tryon / recommendations
    ├── controllers/
    ├── services/
    │   ├── catvtonService.js
    │   └── openrouterService.js
    └── utils/mockData.js
```

---

## Screen → Route Map

| # | Screen                    | Route              |
|---|---------------------------|--------------------|
| 1 | Landing                   | `/`                |
| 2 | Complete Your Profile     | `/complete-profile`|
| 2A| Camera Capture            | `/camera-capture`  |
| 2B| Photo Preview             | `/photo-preview`   |
| 3 | Browse Collections        | `/collections`     |
| 4 | Preferences (Categories)  | `/preferences`     |
| 4S| Scan Preview + Occasions  | `/scan-preview`    |
| 6 | Explore Models            | `/explore-models`  |
| 7 | Try-On View               | `/tryon`           |
| 8 | AI Stylist (Colors/Style) | `/ai-stylist`      |
| 9 | Final Look                | `/final-look`      |
|10 | Thank You                 | `/thank-you`       |

---

## Brand Design System

### Color Palette
- `brand-cream` → `#F5F0E8`
- `brand-beige` → `#E8DDD0`
- `brand-tan` → `#C4A882`
- `brand-gold` → `#B8956A`
- `brand-bronze` → `#9A7A55`
- `brand-mocha` → `#7A5C3A`
- `brand-espresso` → `#5C3D1E`
- `brand-dark` → `#2C1810`

### Component Classes
- `.btn-primary` `.btn-secondary` `.btn-ghost` `.btn-gold` `.btn-icon`
- `.card` `.card-glass`
- `.input-base`
- `.chip` `.chip-active`
- `.glass` `.glass-dark`
- `.skeleton`
- `.text-gradient-brand` `.text-gradient-gold`

### Fonts
- Display: **Playfair Display** (headings)
- Body: **Inter** (UI)

---

## Running the App

```bash
# Frontend
cd frontend && npm run dev      # → http://localhost:5173

# Backend
cd backend && npm run dev       # → http://localhost:5000
```

---

## Environment Setup

**frontend/.env**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

**backend/.env**
```
OPENROUTER_API_KEY=your_key_here
CATVTON_API_URL=http://localhost:7860
```
