import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, Sparkles } from 'lucide-react';
import { ROUTES } from '@constants';

export default function ThankYouPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Thank You — VisionMirror';
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="h-[100dvh] w-full overflow-hidden relative flex flex-col items-center justify-between bg-[#F5F0E8]"
      role="main"
    >
      {/* ── Luxury background texture ─────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial glow at center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(196,168,130,0.18)_0%,transparent_70%)]" />
        {/* Subtle top vignette */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#E8DDD0]/60 to-transparent" />
        {/* Subtle bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#E8DDD0]/80 to-transparent" />
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center gap-6 min-h-0">

        {/* Success icon ring */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 18 }}
          className="relative flex items-center justify-center"
        >
          {/* Outer decorative ring */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-brand-bronze/30 flex items-center justify-center">
            {/* Inner filled circle */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-brand-espresso to-brand-mocha flex items-center justify-center shadow-[0_8px_32px_rgba(92,61,30,0.35)]">
              <CheckCircle2 size={40} className="text-brand-cream sm:w-12 sm:h-12" strokeWidth={1.5} />
            </div>
          </div>

          {/* Gold decorative dots */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <div
              key={deg}
              className="absolute w-1.5 h-1.5 rounded-full bg-brand-gold/50"
              style={{
                transform: `rotate(${deg}deg) translateY(-62px) sm:translateY(-78px)`,
              }}
            />
          ))}
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          {/* Decorative line */}
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 sm:w-14 h-px bg-gradient-to-r from-transparent to-brand-bronze/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-bronze/60" />
            <div className="w-10 sm:w-14 h-px bg-gradient-to-l from-transparent to-brand-bronze/50" />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.04em] text-brand-espresso uppercase leading-tight">
            Thank You!
          </h1>

          <p className="text-brand-mocha text-sm sm:text-base font-medium max-w-xs leading-relaxed">
            Your AI styling session is complete.
          </p>
          <p className="text-brand-bronze/80 text-xs sm:text-sm tracking-wide">
            Your personalized look has been saved successfully.
          </p>
        </motion.div>

      </div>

      {/* ── Bottom buttons ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="relative z-10 shrink-0 w-full max-w-md flex items-center justify-center gap-4 px-6 pb-10 sm:pb-14"
      >
        <button
          onClick={() => navigate(ROUTES.EXPLORE_MODELS)}
          className="btn-primary flex-1 whitespace-nowrap"
        >
          <Sparkles size={16} />
          Start New Try-On
        </button>

        <button
          onClick={() => navigate(ROUTES.LANDING)}
          className="btn-primary flex-1 whitespace-nowrap"
        >
          <Home size={16} />
          Home
        </button>
      </motion.div>
    </motion.main>
  );
}
