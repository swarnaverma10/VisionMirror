import { motion } from 'framer-motion';
import { Sparkles, Cpu, Wand2, Smartphone } from 'lucide-react';

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren:   0.3,
    },
  },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const FEATURES = [
  { icon: Cpu,        label: 'AI-Powered Try-On'             },
  { icon: Wand2,      label: 'Realistic & Instant'           },
  { icon: Sparkles,   label: 'Personalised Style'            },
  { icon: Smartphone, label: 'Touch Friendly'                },
];

/**
 * FeaturePills — four small trust-building badges shown below the CTA row.
 */
export default function FeaturePills() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
    >
      {FEATURES.map(({ icon: Icon, label }) => (
        <motion.div
          key={label}
          variants={itemVariants}
          className="
            flex items-center gap-1.5
            px-3 py-1.5 rounded-full
            bg-white/10 backdrop-blur-sm
            border border-white/20
            text-white/80 text-xs font-medium
            select-none
          "
        >
          <Icon size={12} className="shrink-0 text-brand-tan" />
          <span>{label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
