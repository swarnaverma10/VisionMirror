import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Lightbulb, User, Baby, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ROUTES, GENDERS, PHOTO_TIPS } from '@constants';
import { useApp } from '@context/AppContext';

export default function PhotoPreviewPage() {
  const navigate = useNavigate();
  const { state, setProfile, showToast } = useApp();
  
  // Pre-fill with what was saved before the camera
  const [gender, setLocalGender] = useState(state.profile.gender || '');
  const [height, setLocalHeight] = useState(state.profile.height || '');
  const [errors, setErrors] = useState({ gender: '', height: '' });

  useEffect(() => {
    document.title = 'Photo Captured — VisionMirror';
    // If somehow they got here without a photo, send them back
    if (!state.profile.photoUrl) {
      navigate(ROUTES.COMPLETE_PROFILE);
    }
  }, [state.profile.photoUrl, navigate]);

  const handleRetakePhoto = () => {
    // Navigate back to the camera to change the photo
    navigate(ROUTES.CAMERA_CAPTURE);
  };

  const handleProceed = () => {
    const newErrors = { gender: '', height: '' };
    const h = parseInt(height, 10);
    let isValid = true;
    
    if (!gender) {
      newErrors.gender = 'Please select a gender.';
      isValid = false;
    }
    if (!height) {
      newErrors.height = 'Height is required.';
      isValid = false;
    } else if (isNaN(h) || h < 80 || h > 250) {
      newErrors.height = 'Must be 80-250 cm.';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      // Save any changes to Context
      setProfile({ gender, height: h });
      // Proceed to Browse Collections
      navigate(ROUTES.COLLECTIONS);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative h-[100dvh] w-full flex flex-col bg-brand-cream overflow-hidden"
    >
      {/* ── Background & Overlay ────────────────────────────────────────── */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: "url('/assets/backgrounds/collection-bg.jpg')" }}
        role="presentation"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/60 via-brand-cream/85 to-brand-cream backdrop-blur-md pointer-events-none" />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center px-4 py-3 lg:px-12 lg:py-6 shrink-0">
        <button 
          onClick={() => navigate(ROUTES.LANDING)}
          className="btn-icon"
          aria-label="Go back to Landing"
        >
          <ChevronLeft size={24} />
        </button>
      </header>

      {/* ── Main Content Container ──────────────────────────────────────── */}
      <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 lg:px-12 pb-4 lg:pb-6 flex flex-col min-h-0">
        
        {/* Title Area */}
        <div className="mb-3 lg:mb-8 text-center shrink-0">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-brand-espresso mb-1 lg:mb-2 tracking-widest uppercase"
          >
            PHOTO CAPTURED
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-success text-xs md:text-base font-medium tracking-wide flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} /> Photo captured successfully. Verify details below.
          </motion.p>
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col md:flex-row gap-4 lg:gap-16 flex-1 min-h-0">
          
          {/* ── Left Column: Form ── */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 w-full flex flex-col justify-center max-w-md mx-auto min-h-0"
          >
            {/* Captured Photo Profile (Allows changing) */}
            <div className="flex justify-center mb-4 lg:mb-8 shrink-0">
              <button 
                type="button"
                onClick={handleRetakePhoto}
                aria-label="Retake Photo"
                className="relative group block"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 lg:w-44 lg:h-44 rounded-full bg-white/80 backdrop-blur-sm border-2 border-brand-espresso flex items-center justify-center overflow-hidden shadow-card transition-all duration-300 group-hover:border-brand-gold group-hover:shadow-glow">
                  {state.profile.photoUrl ? (
                    <img 
                      src={state.profile.photoUrl} 
                      alt="Your profile" 
                      className="w-full h-full object-cover transform scale-x-[-1]" 
                    />
                  ) : (
                    <User size={48} className="text-brand-bronze opacity-30 group-hover:opacity-50 transition-opacity" />
                  )}
                  {/* Hover Overlay for Retake */}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <RefreshCw size={24} className="text-white mb-1" />
                    <span className="text-white text-[10px] lg:text-xs font-semibold tracking-wider uppercase">Retake</span>
                  </div>
                </div>
                {/* Retake Badge */}
                <div className="absolute bottom-0 right-0 lg:bottom-2 lg:right-2 w-8 h-8 md:w-11 md:h-11 bg-brand-cream text-brand-espresso rounded-full flex items-center justify-center shadow-card border-[3px] border-brand-espresso transition-transform duration-300 group-hover:scale-110">
                  <RefreshCw size={14} className="lg:w-5 lg:h-5" />
                </div>
              </button>
            </div>

            {/* Gender Selection */}
            <div className="mb-3 lg:mb-6 shrink-0 relative">
              <p className="text-[10px] lg:text-sm font-bold text-brand-dark mb-1.5 lg:mb-3 uppercase tracking-wider text-center">Gender</p>
              <div className="grid grid-cols-3 gap-2 lg:gap-4">
                {GENDERS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setLocalGender(g.id);
                      if (errors.gender) setErrors({ ...errors, gender: '' });
                    }}
                    className={`
                      flex flex-col items-center justify-center py-2 lg:py-4 rounded-xl lg:rounded-2xl border transition-all duration-300
                      ${gender === g.id 
                        ? 'border-brand-espresso bg-brand-espresso text-brand-cream shadow-card scale-[1.03]' 
                        : 'border-white bg-white/60 backdrop-blur-sm text-brand-bronze hover:border-brand-warm hover:bg-white'
                      }
                      ${errors.gender && !gender ? '!border-red-400 !bg-red-50/50' : ''}
                    `}
                  >
                    {g.id === 'kids' ? <Baby size={20} className="mb-1 lg:w-7 lg:h-7" /> : <User size={20} className="mb-1 lg:w-7 lg:h-7" />}
                    <span className="text-[10px] lg:text-sm font-semibold">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Height Input */}
            <div className="shrink-0 relative mt-2">
              <p className="text-[10px] lg:text-sm font-bold text-brand-dark mb-1.5 lg:mb-3 uppercase tracking-wider text-center">Height (cm)</p>
              <input
                type="number"
                placeholder="Enter your height (cm)"
                value={height}
                onChange={(e) => {
                  setLocalHeight(e.target.value);
                  if (errors.height) setErrors({ ...errors, height: '' });
                }}
                className={`
                  input-base text-center text-xs lg:text-lg py-2.5 lg:py-4 backdrop-blur-sm transition-all shadow-sm rounded-xl lg:rounded-2xl
                  ${errors.height ? 'border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20' : 'bg-white/60 border-white focus:bg-white'}
                `}
              />
            </div>
          </motion.div>

          {/* ── Right Column: Tips ── */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 flex flex-col justify-center max-w-md mx-auto md:max-w-sm lg:max-w-md min-h-0"
          >
            <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-2xl lg:rounded-3xl p-4 lg:p-8 shadow-card flex flex-col shrink-0">
              <div className="flex items-center gap-2 lg:gap-4 mb-3 lg:mb-8">
                <div className="p-1.5 lg:p-3 bg-brand-gold/15 rounded-lg lg:rounded-xl">
                  <Lightbulb size={20} className="text-brand-gold lg:w-6 lg:h-6" />
                </div>
                <h2 className="font-display text-lg lg:text-3xl font-semibold text-brand-espresso">Photo Tips</h2>
              </div>
              
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-2 gap-y-2 lg:gap-y-0 lg:space-y-5">
                {PHOTO_TIPS.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 lg:gap-4 text-brand-dark">
                    <span className="flex-shrink-0 w-4 h-4 lg:w-7 lg:h-7 rounded-full bg-brand-beige flex items-center justify-center text-brand-espresso font-bold text-[9px] lg:text-xs mt-0.5 border border-white shadow-sm">
                      {i + 1}
                    </span>
                    <span className="font-medium text-[10px] lg:text-base leading-tight lg:leading-snug pt-0.5 lg:pt-1">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom Actions ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="shrink-0 flex items-center justify-center gap-3 lg:gap-4 pt-3 lg:pt-6 mt-auto border-t border-brand-warm/30"
        >
          <button 
            onClick={() => navigate(ROUTES.LANDING)} 
            className="btn-secondary flex-1 md:flex-none md:w-[200px]"
          >
            Cancel
          </button>
          <button 
            onClick={handleProceed} 
            className="btn-primary flex-1 md:flex-none md:w-[240px] shadow-[0_8px_24px_rgba(44,24,16,0.35)]"
          >
            Try On
          </button>
        </motion.div>

      </div>
    </motion.main>
  );
}
