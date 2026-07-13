import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sparkles, Tag, Palette, Scissors, CalendarDays, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@constants';
import { useApp } from '@context/AppContext';
import { getImageUrl } from '@utils/helpers';

// Loading steps labels
const LOADING_STEPS = [
  'Analyzing Body',
  'Detecting Pose',
  'Matching Outfit',
  'Rendering AI Look',
];

export default function TryOnPage() {
  const navigate = useNavigate();
  const { state, setTryOnResult, setTryOnLoading, showToast } = useApp();

  const userPhoto   = state.profile?.photoUrl;
  const outfit      = state.selectedModel;
  const tryOnResult = state.tryOnResult;
  const isLoading   = state.tryOnLoading;

  const [progress, setProgress]     = useState(0);
  const [stepIndex, setStepIndex]   = useState(0);
  const [sliderPos, setSliderPos]   = useState(50); // percentage
  const [dragging, setDragging]     = useState(false);
  const sliderRef                   = useRef(null);

  // Redirect guard
  useEffect(() => {
    document.title = 'AI Virtual Try-On — VisionMirror';
    if (!userPhoto) navigate(ROUTES.LANDING);
  }, [userPhoto, navigate]);

  // Progress ticker – only when loading
  useEffect(() => {
    if (!isLoading) return;

    setProgress(0);
    setStepIndex(0);

    const duration = 4000;
    const intervalMs = 50;
    const increment = 100 / (duration / intervalMs);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(timer); return 100; }
        return Math.min(100, prev + increment);
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isLoading]);

  // Advance step label as progress moves
  useEffect(() => {
    const idx = Math.floor(progress / 25);
    setStepIndex(Math.min(idx, LOADING_STEPS.length - 1));
  }, [progress]);

  // Reset result whenever the selected outfit changes (new outfit → must regenerate)
  useEffect(() => {
    setTryOnResult(null);
    setTryOnLoading(false);
  }, [outfit?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Slider drag handlers ──────────────────────────────────────────────────
  const handlePointerDown = (e) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e) => {
    if (!dragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setSliderPos(Math.min(100, Math.max(0, (x / rect.width) * 100)));
  };
  const handlePointerUp = () => setDragging(false);

  const handleGenerate = async () => {
    if (isLoading || tryOnResult) return;
    setTryOnLoading(true);

    try {
      let uploadedUserImageUrl = null;
      if (state.profile?.photoFile) {
        const { uploadFile } = await import('../../services/apiService.js');
        const uploadRes = await uploadFile(state.profile.photoFile);
        uploadedUserImageUrl = uploadRes.imageUrl;
      } else {
        uploadedUserImageUrl = userPhoto; // fallback
      }
      
      const { generateTryOn } = await import('../../services/apiService.js');
      const tryonRes = await generateTryOn({
        userImage: uploadedUserImageUrl,
        outfitImage: outfit?.image
      });
      
      setTryOnResult(tryonRes.generatedImage);
    } catch (error) {
      console.error('TryOn API Error:', error);
      showToast(error.message || 'Failed to generate Try-On. Please try again.', 'error');
    } finally {
      setTryOnLoading(false);
    }
  };

  const displayProgress = Math.min(100, Math.floor(progress));

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="page-container !h-[100dvh] relative overflow-hidden flex flex-col"
    >
      {/* ── Background ─────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none"
        style={{ backgroundImage: "url('/assets/backgrounds/tryon-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/80 via-brand-cream to-brand-cream backdrop-blur-[2px] pointer-events-none" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="relative z-20 flex items-center justify-between px-4 py-3 lg:px-8 shrink-0">
        <button
          onClick={() => navigate(ROUTES.EXPLORE_MODELS)}
          className="btn-icon"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-mocha">
            AI Virtual Try-On
          </p>
        </div>
        <div className="w-10 h-10" />
      </header>

      {/* ── Title ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 text-center px-4 shrink-0 mt-1 mb-3">
        <h1 className="font-display text-[28px] md:text-[44px] font-[800] uppercase tracking-[0.06em] text-brand-dark leading-tight">
          AI VIRTUAL TRY-ON
        </h1>
        <p className="text-brand-mocha text-xs md:text-sm">
          See your selected outfit on yourself.
        </p>
      </div>

      {/* ── Main Area ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 min-h-0 flex gap-4 px-4 md:px-8 pb-20 overflow-hidden items-center justify-center">

        {/* ── CENTER: Before / After card (3:4 ratio, centered) ───────────── */}
        <div className="relative aspect-[3/4] h-full max-w-full flex flex-col gap-3 min-w-0 min-h-0 mx-auto md:mx-0">

          {/* Before/After comparison / Generated Image Display */}
          <div
            ref={sliderRef}
            className={`flex-1 relative rounded-3xl overflow-hidden shadow-card border border-white/60 select-none ${!tryOnResult ? 'cursor-col-resize' : ''}`}
            onPointerDown={!tryOnResult ? handlePointerDown : undefined}
            onPointerMove={!tryOnResult ? handlePointerMove : undefined}
            onPointerUp={!tryOnResult ? handlePointerUp : undefined}
          >
            {/* Main Image Panel */}
            <div className="absolute inset-0 bg-brand-beige">
              {tryOnResult ? (
                <img
                  src={getImageUrl(tryOnResult)}
                  alt="AI Try-On Result"
                  className="w-full h-full object-cover object-top"
                />
              ) : userPhoto ? (
                <img
                  src={userPhoto}
                  alt="Your Photo"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-mocha/50 text-sm">
                  No photo
                </div>
              )}
            </div>

            {/* Right panel — try-on result placeholder (only when not generated) */}
            {!tryOnResult && (
              <div
                className="absolute inset-0 bg-brand-dark/10"
                style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key="placeholder"
                    className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-brand-espresso/90 to-brand-dark"
                  >
                    <Sparkles size={36} className="text-brand-gold mb-3 opacity-70" />
                    <p className="text-white/70 text-sm font-medium tracking-wider uppercase">
                      AI Result
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                      Press Generate Try-On
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* Slider handle (only when not generated) */}
            {!tryOnResult && (
              <div
                className="absolute inset-y-0 z-10 pointer-events-none"
                style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
              >
                {/* Vertical line */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/80" />
                {/* Handle pill */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-brand-espresso/30">
                  <span className="text-brand-espresso font-bold text-xs select-none">⇄</span>
                </div>
              </div>
            )}

            {/* Labels */}
            {!tryOnResult ? (
              <>
                <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-brand-espresso/80 backdrop-blur-sm">
                  <span className="text-white text-xs font-semibold tracking-widest uppercase">Original</span>
                </div>
                <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-brand-espresso/80 backdrop-blur-sm">
                  <span className="text-white text-xs font-semibold tracking-widest uppercase">
                    Pending
                  </span>
                </div>
              </>
            ) : (
              <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-brand-espresso/80 backdrop-blur-sm">
                <span className="text-white text-xs font-semibold tracking-widest uppercase">
                  AI Generated Look
                </span>
              </div>
            )}

            {/* Loading overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-brand-dark/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
                >
                  {/* Animated gold laser line */}
                  <motion.div
                    className="absolute left-0 right-0 h-[2px] bg-brand-gold shadow-[0_0_20px_rgba(184,149,106,1)] pointer-events-none"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                  />

                  {/* Step label */}
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={stepIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="text-brand-gold font-semibold tracking-[0.18em] uppercase text-sm"
                    >
                      {LOADING_STEPS[stepIndex]}
                    </motion.p>
                  </AnimatePresence>

                  {/* Progress bar */}
                  <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-brand-gold rounded-full"
                      style={{ width: `${displayProgress}%` }}
                      transition={{ ease: 'linear' }}
                    />
                  </div>
                  <p className="text-white/60 text-xs tracking-widest">{displayProgress}%</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── RIGHT: Outfit Details panel ────────────────────────────────── */}
        <div className="hidden md:flex w-64 lg:w-72 flex-col gap-3 min-h-0 h-full shrink-0">

          {/* Outfit image thumbnail */}
          {outfit?.image && (
            <div className="rounded-2xl overflow-hidden border border-white/60 shadow-sm bg-brand-beige shrink-0"
              style={{ height: '200px' }}
            >
              <img
                src={outfit.image}
                alt={outfit.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          )}

          {/* Details card */}
          <div className="flex-1 rounded-2xl bg-brand-espresso text-white p-5 shadow-card overflow-y-auto no-scrollbar flex flex-col gap-4">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-white/60 mb-1">Selected Outfit</p>
              <h3 className="font-display text-xl font-bold leading-tight">
                {outfit?.name || 'No outfit selected'}
              </h3>
              <p className="text-brand-beige font-bold text-lg mt-1">{outfit?.price || '—'}</p>
            </div>

            <div className="border-t border-white/15 pt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Scissors size={14} className="text-brand-beige shrink-0" />
                <span className="text-white/60 w-16 shrink-0">Fabric</span>
                <span className="text-brand-beige">{outfit?.fabric || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette size={14} className="text-brand-beige shrink-0" />
                <span className="text-white/60 w-16 shrink-0">Color</span>
                <span className="text-brand-beige">{outfit?.color || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays size={14} className="text-brand-beige shrink-0" />
                <span className="text-white/60 w-16 shrink-0">Occasion</span>
                <span className="text-brand-beige">{outfit?.occasion || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-brand-beige shrink-0" />
                <span className="text-white/60 w-16 shrink-0">Sizes</span>
                <span className="text-brand-beige">{outfit?.sizes || 'XS–XL'}</span>
              </div>
            </div>

            {tryOnResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 mt-auto bg-white/10 rounded-xl px-3 py-2"
              >
                <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                <span className="text-white/90 text-xs font-medium">Try-On Generated!</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Action Bar ───────────────────────────────────────────────── */}
      <div className="absolute bottom-0 inset-x-0 z-40 p-4 bg-gradient-to-t from-brand-cream via-brand-cream/95 to-transparent pb-5 pt-10 pointer-events-none">
        <div className="max-w-lg mx-auto flex gap-3 pointer-events-auto">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !!tryOnResult}
            className="btn-primary flex-1 py-3 !rounded-2xl text-sm shadow-glow flex items-center justify-center gap-2"
          >
            <Sparkles size={16} className={isLoading ? 'animate-pulse' : ''} />
            {isLoading ? 'Generating...' : tryOnResult ? 'Generated ✓' : 'Generate Try-On'}
          </button>

          <button
            onClick={() => navigate(ROUTES.AI_STYLIST)}
            disabled={!tryOnResult}
            className="btn-primary flex-1 py-3 !rounded-2xl text-sm shadow-glow disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.main>
  );
}
