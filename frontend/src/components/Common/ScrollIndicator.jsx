import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * ScrollIndicator — animated bounce arrow shown at the bottom of hero sections.
 * Purely decorative; fades out on scroll via parent logic if needed.
 */
export default function ScrollIndicator({ className = '' }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1,  y: 0 }}
        transition={{ delay: 2, duration: 0.6, ease: 'easeOut' }}
        className={`flex flex-col items-center gap-1 select-none pointer-events-none ${className}`}
        aria-hidden="true"
      >
        <span className="text-white/40 text-xxs font-semibold uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} className="text-white/40" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
