import { motion } from 'framer-motion';

/**
 * Full-screen page-level loading spinner shown during lazy-loading.
 */
export default function PageLoader() {
  return (
    <div className="min-h-screen bg-surface-light flex flex-col items-center justify-center gap-6">
      {/* Animated logo mark */}
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-brand-beige" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-espresso" />
      </motion.div>

      {/* Brand name */}
      <motion.p
        className="font-display text-xl font-semibold text-brand-espresso tracking-wider"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        VisionMirror
      </motion.p>
    </div>
  );
}
