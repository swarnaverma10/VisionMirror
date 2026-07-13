import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Star, Heart, Download, CheckCircle2,
  Scissors, Palette, CalendarDays, Tag
} from 'lucide-react';
import { ROUTES } from '@constants';
import { useApp } from '@context/AppContext';
import { generateStyleRecommendations } from '@utils/styleRecommendations';
import { getImageUrl } from '@utils/helpers';

export default function FinalLookPage() {
  const navigate = useNavigate();
  const { state, showToast } = useApp();

  const tryOnResult = state.tryOnResult;
  const outfit      = state.selectedModel;

  useEffect(() => {
    document.title = 'Final Look — VisionMirror';
    if (!tryOnResult && !outfit) {
      navigate(ROUTES.LANDING);
    }
  }, [tryOnResult, outfit, navigate]);

  const recs = useMemo(
    () => generateStyleRecommendations(outfit),
    [outfit]
  );

  const scoreColor =
    recs.score >= 92 ? 'text-green-400' :
    recs.score >= 85 ? 'text-yellow-400' :
    'text-orange-400';

  const handleSave = () => {
    showToast('Look saved to your collection!', 'success');
  };

  const handleDownload = async () => {
    if (!tryOnResult) {
      showToast('No generated image to download.', 'error');
      return;
    }
    try {
      showToast('Preparing download...', 'info');
      const imageUrl = getImageUrl(tryOnResult);
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to fetch image');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `visionmirror-look-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast('Download started!', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showToast('Failed to download image.', 'error');
    }
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
      <header className="relative z-20 flex items-center justify-between px-4 py-3 lg:px-8 shrink-0">
        <button
          onClick={() => navigate(ROUTES.AI_STYLIST)}
          className="btn-icon"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="w-10 h-10" />
      </header>

      {/* Title */}
      <div className="relative z-10 text-center px-4 shrink-0 mb-4">
        <h1 className="font-display text-[28px] md:text-[40px] font-[800] uppercase tracking-[0.06em] text-brand-dark leading-tight">
          FINAL LOOK
        </h1>
        <p className="text-brand-mocha text-xs md:text-sm font-medium">
          Your AI styled outfit is ready.
        </p>
      </div>

      {/* ── Main layout: Center image | Right details ───────────────────────────── */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col md:flex-row gap-3 md:gap-4 px-4 md:px-6 pb-24 md:pb-20 justify-center items-center md:items-start overflow-hidden">
        
        {/* LEFT — Large AI Generated Image */}
        <div className="h-[32vh] aspect-[3/4] md:h-full md:flex-1 md:max-w-[400px] flex flex-col min-w-0 min-h-0 shrink-0">
          <div className="w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl border-2 md:border-4 border-white/80 bg-brand-beige relative">
            <AnimatePresence mode="wait">
              {tryOnResult ? (
                <motion.img
                  key="tryon"
                  src={getImageUrl(tryOnResult)}
                  alt="Final AI Look"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              ) : outfit?.image ? (
                <motion.img
                  key="outfit"
                  src={outfit.image}
                  alt={outfit.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              ) : null}
            </AnimatePresence>
            
            {/* Verified badge */}
            <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-black/40 backdrop-blur-md text-white rounded-full px-2 py-1 md:px-3 md:py-1.5 flex items-center gap-1 md:gap-1.5 shadow-lg">
              <CheckCircle2 size={12} className="text-green-400" />
              <span className="text-[8px] md:text-[10px] font-bold tracking-widest uppercase">AI Verified</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Compact Summary Card */}
        <div className="w-full max-w-[300px] flex flex-col gap-3 shrink-0 min-h-0">
          
          <div className="rounded-2xl md:rounded-3xl bg-brand-espresso text-white p-4 md:p-6 shadow-xl md:shadow-2xl flex flex-col gap-3 md:gap-4 border border-white/10">
            {/* Header */}
            <div>
              <p className="text-[8px] md:text-[10px] tracking-[0.2em] uppercase text-white/50 mb-0.5 md:mb-1">Selected Outfit</p>
              <h3 className="font-display text-base md:text-xl font-bold leading-tight line-clamp-2">
                {outfit?.name || 'Your Outfit'}
              </h3>
              <p className="text-brand-beige font-bold text-sm md:text-lg mt-0.5 md:mt-1">{outfit?.price || '—'}</p>
            </div>

            {/* Specs */}
            <div className="border-t border-white/15 pt-2 md:pt-4 space-y-2 md:space-y-3 text-xs md:text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 md:gap-2 text-white/50">
                  <Scissors size={13} />
                  <span className="text-[11px] md:text-xs">Fabric</span>
                </div>
                <span className="text-brand-beige font-medium text-right truncate w-28 md:w-32">{outfit?.fabric || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 md:gap-2 text-white/50">
                  <Palette size={13} />
                  <span className="text-[11px] md:text-xs">Color</span>
                </div>
                <span className="text-brand-beige font-medium text-right truncate w-28 md:w-32">{outfit?.color || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 md:gap-2 text-white/50">
                  <CalendarDays size={13} />
                  <span className="text-[11px] md:text-xs">Occasion</span>
                </div>
                <span className="text-brand-beige font-medium text-right truncate w-28 md:w-32">{outfit?.occasion || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 md:gap-2 text-white/50">
                  <Tag size={13} />
                  <span className="text-[11px] md:text-xs">Sizes</span>
                </div>
                <span className="text-brand-beige font-medium text-right truncate w-28 md:w-32">{outfit?.sizes || 'XS–XL'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Action Bar ──────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 inset-x-0 z-40 p-4 bg-gradient-to-t from-brand-cream via-brand-cream/95 to-transparent pb-5 pt-10 pointer-events-none flex flex-col items-center">
        <div className="max-w-xl w-full flex gap-3 pointer-events-auto">
          
          <button
            onClick={handleSave}
            className="btn-primary flex-1"
          >
            <Heart size={16} />
            Save Look
          </button>

          <button
            onClick={handleDownload}
            className="btn-primary flex-1"
          >
            <Download size={16} />
            Download
          </button>

          <button
            onClick={() => navigate(ROUTES.THANK_YOU)}
            className="btn-primary flex-1"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.main>
  );
}
