import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sparkles, RefreshCw, Lightbulb } from 'lucide-react';
import { ROUTES } from '@constants';
import { useApp } from '@context/AppContext';
import { generateStyleRecommendations } from '@utils/styleRecommendations';
import { getImageUrl } from '@utils/helpers';

export default function AIStylistPage() {
  const navigate = useNavigate();
  const { state, setRecommendations, setRecommendationsLoading, showToast } = useApp();

  const tryOnResult = state.tryOnResult;
  const outfit      = state.selectedModel;
  const recs        = state.recommendations;
  const isLoading   = state.recommendationsLoading;

  const [regenerateKey, setRegenerateKey] = useState(0);

  useEffect(() => {
    document.title = 'AI Stylist — VisionMirror';
  }, []);

  useEffect(() => {
    if (!outfit) return;
    
    const fetchStylist = async () => {
      setRecommendationsLoading(true);
      try {
        const { generateStylist } = await import('../../services/apiService.js');
        const res = await generateStylist({
          category: outfit.category || 'Outfit',
          outfitName: outfit.name || 'Selected Outfit',
          color: outfit.color || 'Neutral',
          fabric: outfit.fabric || 'Standard',
          occasion: outfit.occasion || 'Casual',
          style: outfit.style || 'Modern'
        });
        setRecommendations(res);
      } catch (err) {
        console.error('Stylist API Error:', err);
        showToast(err.message || 'Failed to fetch stylist recommendations.', 'error');
      } finally {
        setRecommendationsLoading(false);
      }
    };

    fetchStylist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outfit?.id, regenerateKey]);

  const handleRegenerate = () => {
    if (!isLoading) setRegenerateKey(k => k + 1);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="page-container !h-[100dvh] relative overflow-hidden flex flex-col"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none"
        style={{ backgroundImage: "url('/assets/backgrounds/tryon-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/80 via-brand-cream to-brand-cream backdrop-blur-[2px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 flex items-center px-4 py-3 lg:px-8 shrink-0">
        <button
          onClick={() => navigate(ROUTES.TRYON)}
          className="btn-icon"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>
      </header>

      {/* Title */}
      <div className="relative z-10 text-center px-4 shrink-0 mb-3 md:mb-4">
        <h1 className="font-display text-2xl md:text-4xl font-[800] uppercase tracking-[0.06em] text-brand-dark leading-tight">
          AI STYLIST
        </h1>
        <p className="text-brand-mocha text-xs md:text-sm">
          Your personalised style analysis.
        </p>
      </div>

      {/* ── Main layout ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col md:flex-row gap-4 px-4 md:px-6 pb-24 overflow-hidden justify-center items-center md:items-start">

        {/* LEFT — Generated look image */}
        <div className="h-[30vh] md:h-full aspect-[3/4] md:flex-none md:w-[260px] lg:w-[300px] shrink-0 min-h-0 rounded-2xl md:rounded-3xl overflow-hidden shadow-card border border-white/60 bg-brand-beige relative">
          <AnimatePresence mode="wait">
            {tryOnResult ? (
              <motion.img
                key="tryon"
                src={getImageUrl(tryOnResult)}
                alt="Your AI Look"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55 }}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            ) : outfit?.image ? (
              <motion.img
                key="outfit"
                src={outfit.image}
                alt={outfit.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55 }}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-mocha/50 gap-2">
                <Sparkles size={28} />
                <p className="text-xs">No image</p>
              </div>
            )}
          </AnimatePresence>

          {/* Bottom badge */}
          <div className="absolute bottom-3 inset-x-0 flex justify-center z-10">
            <div className="px-3 py-1 rounded-full bg-brand-espresso/85 backdrop-blur-sm">
              <span className="text-white text-[10px] font-semibold tracking-widest uppercase">
                {tryOnResult ? 'AI Generated Look' : outfit?.name || 'Your Look'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — Outfit Summary + Styling Tips only */}
        <div className="flex-1 min-w-0 min-h-0 max-w-[480px] flex flex-col justify-center gap-4 overflow-hidden">

          {/* Outfit Summary */}
          <div className="rounded-2xl bg-brand-espresso px-5 py-4 shadow-sm shrink-0">
            <p className="text-[10px] tracking-[0.18em] uppercase text-white/55 mb-1">Outfit Summary</p>
            <h3 className="font-display text-base md:text-lg font-bold text-white truncate">
              {outfit?.name || 'No outfit selected'}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-brand-beige flex-wrap">
              {outfit?.price    && <span className="font-bold">{outfit.price}</span>}
              {outfit?.occasion && <span className="opacity-80">• {outfit.occasion}</span>}
              {outfit?.fabric   && <span className="opacity-80">• {outfit.fabric}</span>}
            </div>
          </div>

          {/* Styling Tips */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${regenerateKey}-${outfit?.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl bg-brand-espresso p-5 shadow-sm shrink-0"
            >
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={15} className="text-yellow-400 shrink-0" />
                <p className="text-[10px] tracking-[0.15em] uppercase text-white/55 font-semibold">
                  Styling Tips
                </p>
              </div>
              <ul className="space-y-3">
                {isLoading ? (
                  <li className="text-brand-beige/70 text-sm animate-pulse">Analyzing your outfit...</li>
                ) : recs?.tips?.length > 0 ? (
                  recs.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] md:text-sm text-brand-beige/95 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-beige/60 mt-1.5 shrink-0" />
                      {tip}
                    </li>
                  ))
                ) : (
                  <li className="text-brand-beige/70 text-sm">No tips available.</li>
                )}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom Action Bar ── */}
      <div className="absolute bottom-0 inset-x-0 z-40 px-4 pb-5 pt-10 bg-gradient-to-t from-brand-cream via-brand-cream/95 to-transparent pointer-events-none flex justify-center">
        <div className="max-w-lg w-full flex gap-3 pointer-events-auto">
          <button
            onClick={handleRegenerate}
            className="btn-primary flex-1"
          >
            <RefreshCw size={15} />
            Regenerate
          </button>
          <button
            onClick={() => navigate(ROUTES.FINAL_LOOK)}
            className="btn-primary flex-1"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.main>
  );
}
