import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { ROUTES } from '@constants';
import { useApp } from '@context/AppContext';

const PREFERENCES_DATA = [
  {
    id: 'occasion',
    title: '1. What occasions are you shopping for?',
    options: ['Casual', 'Formal', 'Party', 'Office', 'Wedding', 'Travel']
  },
  {
    id: 'colors',
    title: '2. What colors do you prefer?',
    options: ['Black', 'White', 'Beige', 'Brown', 'Blue', 'Green', 'Red']
  },
  {
    id: 'styles',
    title: '3. Any specific style you like?',
    options: ['Minimal', 'Classic', 'Luxury', 'Streetwear', 'Ethnic', 'Trendy']
  }
];

export default function PreferencesPage() {
  const navigate = useNavigate();
  const { state, setOccasion, setColorPreferences, setStylePreferences } = useApp();

  // Local state for multi-select
  const [selectedOccasions, setSelectedOccasions] = useState(
    Array.isArray(state.occasion) ? state.occasion : (state.occasion ? [state.occasion] : [])
  );
  const [selectedColors, setSelectedColors] = useState(state.colorPreferences || []);
  const [selectedStyles, setSelectedStyles] = useState(state.stylePreferences || []);

  useEffect(() => {
    document.title = 'Preferences — VisionMirror';
  }, []);

  const toggleSelection = (sectionId, option) => {
    if (sectionId === 'occasion') {
      setSelectedOccasions(prev => 
        prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
      );
    } else if (sectionId === 'colors') {
      setSelectedColors(prev => 
        prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
      );
    } else if (sectionId === 'styles') {
      setSelectedStyles(prev => 
        prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
      );
    }
  };

  const handleContinue = () => {
    // Save selections to context
    setOccasion(selectedOccasions);
    setColorPreferences(selectedColors);
    setStylePreferences(selectedStyles);
    
    // Navigate to Scan Preview
    navigate(ROUTES.SCAN_PREVIEW);
  };

  const isSelectionEmpty = selectedOccasions.length === 0 && selectedColors.length === 0 && selectedStyles.length === 0;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="page-container !h-[100dvh] relative overflow-hidden flex flex-col"
    >
      {/* Background elements */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none"
        style={{ backgroundImage: "url('/assets/backgrounds/tryon-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/80 via-brand-cream to-brand-cream backdrop-blur-[2px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-4 py-4 lg:px-8 shrink-0">
        <button
          onClick={() => navigate(ROUTES.COLLECTIONS)}
          className="btn-icon"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="w-10 h-10" /> {/* Spacer to balance Back button */}
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col px-4 w-full max-w-3xl mx-auto min-h-0">
        <div className="text-center mt-6 mb-4 shrink-0">
          <h1 className="font-display text-[44px] md:text-[52px] lg:text-[56px] font-[800] uppercase tracking-[0.06em] text-brand-dark leading-[1.1]">
            PERSONALIZE YOUR STYLE
          </h1>
        </div>
        <div className="flex flex-col gap-3 flex-1 min-h-0 pb-24 justify-start">
          
          {PREFERENCES_DATA.map((section, idx) => {
            const currentSelection = 
              section.id === 'occasion' ? selectedOccasions :
              section.id === 'colors' ? selectedColors : 
              selectedStyles;

            return (
              <motion.section 
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white/40 backdrop-blur-sm rounded-3xl p-4 md:p-5 shadow-sm border border-white/50"
              >
                <h2 className="font-display text-lg md:text-xl text-brand-dark mb-3 text-center">
                  {section.title}
                </h2>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {section.options.map(option => {
                    const isSelected = currentSelection.includes(option);
                    
                    return (
                      <motion.button
                        key={option}
                        onClick={() => toggleSelection(section.id, option)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                          ${isSelected 
                            ? 'bg-brand-espresso text-brand-cream shadow-md border-transparent' 
                            : 'bg-brand-cream text-brand-mocha border border-brand-warm/60 hover:border-brand-espresso/50 hover:bg-white'}
                        `}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 inset-x-0 z-50 p-4 bg-gradient-to-t from-brand-cream via-brand-cream/90 to-transparent pb-6 pt-12">
        <div className="max-w-md mx-auto flex gap-4">
          <button
            onClick={handleContinue}
            className="btn-primary flex-1 shadow-glow"
          >
            {isSelectionEmpty ? 'Skip for now' : 'Continue'}
          </button>
        </div>
      </div>
    </motion.main>
  );
}
