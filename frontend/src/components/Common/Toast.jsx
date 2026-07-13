import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '@context/AppContext';
import { ACTIONS } from '@context/AppContext';

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  info:    Info,
};

const COLORS = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50 border-red-200 text-red-800',
  info:    'bg-brand-cream border-brand-warm text-brand-espresso',
};

const ICON_COLORS = {
  success: 'text-green-500',
  error:   'text-red-500',
  info:    'text-brand-bronze',
};

/**
 * Global Toast notification — driven by AppContext state.
 */
export default function Toast() {
  const { state, dispatch } = useApp();
  const { toast } = state;

  const dismiss = () => dispatch({ type: ACTIONS.CLEAR_TOAST });

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`
            fixed bottom-6 left-1/2 -translate-x-1/2 z-50
            flex items-center gap-3
            px-4 py-3 rounded-2xl border shadow-card
            max-w-[90vw] w-max
            ${COLORS[toast.type] || COLORS.info}
          `}
          role="alert"
          aria-live="polite"
        >
          {/* Icon */}
          {(() => {
            const Icon = ICONS[toast.type] || Info;
            return <Icon size={18} className={ICON_COLORS[toast.type] || ICON_COLORS.info} />;
          })()}

          {/* Message */}
          <span className="text-sm font-medium">{toast.message}</span>

          {/* Dismiss */}
          <button
            onClick={dismiss}
            aria-label="Dismiss notification"
            className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
