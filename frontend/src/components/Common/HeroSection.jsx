import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shirt } from 'lucide-react';
import { ROUTES, APP_NAME, APP_TAGLINE } from '@constants';
import FeaturePills    from '@components/Common/FeaturePills';
import ScrollIndicator from '@components/Common/ScrollIndicator';

// ─── Animation Variants ───────────────────────────────────────────────────────

/** Stagger wrapper — children animate in sequence */
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren:   0.55,
    },
  },
};

/** Individual text / element entry */
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Logo scale + fade */
const logoVariant = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 },
  },
};

/** Ornamental divider */
const dividerVariant = {
  hidden:  { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.7 },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * HeroSection — the core content block of the Landing page.
 * Renders logo, tagline, subtitle, CTA buttons, feature pills, and scroll indicator.
 * All layout and sizing via Tailwind only.
 */
export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 flex flex-col items-center justify-between h-full py-12 sm:py-16 px-6">

      {/* ── Top spacer (balances bottom scroll indicator) ───────────────── */}
      <div className="flex-1" />

      {/* ── Main Content Block ──────────────────────────────────────────── */}
      <div className="flex flex-col items-center text-center w-full max-w-lg mx-auto gap-0">

        {/* Logo image */}
        <motion.div
          variants={logoVariant}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-8"
        >
          <img
            src="/assets/logos/visionmirror-logo.png"
            alt={`${APP_NAME} logo`}
            className="w-40 sm:w-52 md:w-60 h-auto object-contain drop-shadow-2xl"
            draggable={false}
          />
        </motion.div>

        {/* Staggered text content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-4 sm:gap-5"
        >
          {/* Brand name wordmark */}
          <motion.h1
            variants={fadeUp}
            className="
              font-display font-bold tracking-tight
              text-4xl sm:text-5xl md:text-6xl
              text-white drop-shadow-lg
              leading-none
            "
          >
            {APP_NAME}
          </motion.h1>

          {/* Ornamental divider */}
          <motion.div
            variants={dividerVariant}
            className="w-20 h-px bg-gradient-to-r from-transparent via-brand-tan to-transparent origin-center"
            aria-hidden="true"
          />

          {/* Tagline */}
          <motion.p
            variants={fadeUp}
            className="
              font-display italic
              text-lg sm:text-xl md:text-2xl
              text-brand-tan/90
              tracking-wide leading-snug
            "
          >
            "{APP_TAGLINE}"
          </motion.p>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="
              font-sans font-light
              text-sm sm:text-base
              text-white/60
              tracking-widest uppercase
              leading-relaxed
            "
          >
            AI&ndash;Powered Virtual Try&#8209;On Experience
          </motion.p>

          {/* ── CTA Buttons ─────────────────────────────────────────────── */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-3 w-full sm:w-auto"
          >
            {/* Primary CTA */}
            <motion.button
              id="landing-get-started-btn"
              onClick={() => navigate(ROUTES.COMPLETE_PROFILE)}
              aria-label="Get started — go to complete your profile"
              whileHover={{ scale: 1.04 }}
              whileTap={{   scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="
                group relative overflow-hidden
                flex items-center justify-center gap-2.5
                w-full sm:w-auto
                px-8 py-4 rounded-2xl
                bg-brand-espresso
                text-brand-cream font-semibold text-base
                shadow-[0_8px_32px_rgba(44,24,16,0.45)]
                transition-shadow duration-300
                hover:shadow-[0_12px_40px_rgba(44,24,16,0.6)]
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-tan focus-visible:ring-offset-2
                focus-visible:ring-offset-transparent
              "
            >
              {/* Shimmer overlay on hover */}
              <span
                className="
                  absolute inset-0 -translate-x-full
                  bg-gradient-to-r from-transparent via-white/10 to-transparent
                  group-hover:translate-x-full transition-transform duration-700
                "
                aria-hidden="true"
              />
              <span className="relative">Get Started</span>
              <ArrowRight
                size={18}
                className="relative transition-transform duration-200 group-hover:translate-x-1"
              />
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              id="landing-explore-btn"
              onClick={() => navigate(ROUTES.COLLECTIONS)}
              aria-label="Explore collections"
              whileHover={{ scale: 1.03 }}
              whileTap={{   scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="
                group flex items-center justify-center gap-2.5
                w-full sm:w-auto
                px-8 py-4 rounded-2xl
                bg-white/10 backdrop-blur-md
                border border-white/25
                text-white/85 font-medium text-base
                transition-all duration-300
                hover:bg-white/18 hover:border-white/40
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-white/50 focus-visible:ring-offset-2
                focus-visible:ring-offset-transparent
              "
            >
              <Shirt size={17} className="text-brand-tan transition-transform duration-200 group-hover:scale-110" />
              <span>Explore Collections</span>
            </motion.button>
          </motion.div>

          {/* ── Feature Pills ────────────────────────────────────────────── */}
          <motion.div variants={fadeUp} className="mt-1 w-full">
            <FeaturePills />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ────────────────────────────────────────────── */}
      <div className="flex-1 flex items-end justify-center pb-4">
        <ScrollIndicator />
      </div>
    </div>
  );
}
