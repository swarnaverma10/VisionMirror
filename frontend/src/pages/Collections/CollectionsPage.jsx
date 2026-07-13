import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check } from 'lucide-react';
import { ROUTES } from '@constants';
import { useApp } from '@context/AppContext';

// Category data mapping to existing local product assets
const CATEGORIES = [
  {
    id: 'women',
    label: 'Women',
    image: '/assets/products/women/gowns/gowns_01.jpg',
  },
  {
    id: 'men',
    label: 'Men',
    image: '/assets/products/men/blazer-set/blazer_set_01.jpeg',
  },
  {
    id: 'kids',
    label: 'Kids',
    image: '/assets/products/kids/boys/casuals/casuals_01.webp',
  }
];

export default function CollectionsPage() {
  const navigate = useNavigate();
  const { state, setProfile } = useApp();
  
  // Initialize with existing context value if available
  const [selectedId, setSelectedId] = useState(state.profile?.gender || null);

  useEffect(() => {
    document.title = 'Browse Collections — VisionMirror';
  }, []);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleContinue = () => {
    if (!selectedId) return;
    
    // Save selected category (gender) to context
    setProfile({ gender: selectedId });
    navigate(ROUTES.PREFERENCES);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="page-container !h-[100dvh] relative overflow-hidden"
    >
      {/* Background elements */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none"
        style={{ backgroundImage: "url('/assets/backgrounds/tryon-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/80 via-brand-cream to-brand-cream backdrop-blur-[2px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-4 py-5 lg:px-8 shrink-0">
        <button
          onClick={() => navigate(ROUTES.PHOTO_PREVIEW)}
          className="btn-icon"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-widest text-brand-espresso">
          BROWSE COLLECTION
        </h1>
        <div className="w-10 h-10" /> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col pt-2 pb-20 px-4 w-full max-w-5xl mx-auto min-h-0">
        <div className="text-center mb-6 shrink-0">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wide text-brand-dark mb-2">
            PERSONALIZE YOUR STYLE
          </h2>
          <p className="text-brand-mocha text-sm md:text-base max-w-md mx-auto">
            Select a category to view personalized style recommendations.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0 pb-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedId === cat.id;
            
            return (
              <motion.button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative group overflow-hidden rounded-[2rem] text-left
                  transition-all duration-300 ease-out h-full w-full
                  shadow-card border-2
                  ${isSelected ? 'border-brand-espresso ring-4 ring-brand-espresso/10' : 'border-transparent hover:border-brand-warm'}
                `}
              >
                {/* Image Background */}
                <div className="absolute inset-0 bg-brand-beige">
                  <img 
                    src={cat.image} 
                    alt={cat.label}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>

                {/* Selection Indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-espresso text-brand-cream flex items-center justify-center shadow-lg"
                    >
                      <Check size={18} strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Label */}
                <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-display text-3xl md:text-4xl text-white font-medium drop-shadow-md">
                    {cat.label}
                  </h3>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-brand-cream/90 backdrop-blur-lg border-t border-brand-warm/30">
        <div className="max-w-md mx-auto flex gap-4">
          <button
            onClick={handleContinue}
            disabled={!selectedId}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_24px_rgba(44,24,16,0.25)]"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.main>
  );
}
