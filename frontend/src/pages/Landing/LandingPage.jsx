import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@constants';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'VisionMirror — AI-Powered Virtual Try-On Experience';
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="relative h-[100dvh] w-full overflow-hidden flex flex-col"
      role="main"
      aria-label="VisionMirror landing page"
    >
      {/* ── DESKTOP background (≥1024px) ─────────────────────────────────────
          Landscape image with logo, tagline and all models baked in.
          object-cover + object-top ensures the top logo area is always shown.
          Hidden entirely on mobile/tablet via `hidden lg:block`.
      ──────────────────────────────────────────────────────────────────────── */}
      <img
        src="/assets/backgrounds/landing-desktop.jpg.jpg"
        alt=""
        aria-hidden="true"
        draggable="false"
        className="hidden lg:block absolute inset-0 w-full h-full object-cover object-top pointer-events-none select-none"
      />

      {/* ── MOBILE/TABLET background (<1024px) ───────────────────────────────
          Portrait image with logo, tagline and all models baked in at the
          correct scale. object-cover + object-top keeps the V logo and
          VISIONMIRROR text in frame. The image fills the full 100dvh height.
          Hidden entirely on desktop via `block lg:hidden`.
      ──────────────────────────────────────────────────────────────────────── */}
      <img
        src="/assets/backgrounds/landing-mobile.jpg.png"
        alt=""
        aria-hidden="true"
        draggable="false"
        className="block lg:hidden absolute inset-0 w-full h-full object-cover object-top pointer-events-none select-none"
      />

      {/* ── Gradient overlay (bottom fade for button legibility) ──────────── */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      {/* ── Get Started — bottom center, all sizes ────────────────────────── */}
      <div className="relative z-10 flex flex-col flex-1 pb-10 lg:pb-14 px-6 items-center justify-end">
        <motion.button
          onClick={() => navigate(ROUTES.COMPLETE_PROFILE)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="btn-primary w-full max-w-[320px]"
        >
          Get Started
        </motion.button>
      </div>
    </motion.main>
  );
}
