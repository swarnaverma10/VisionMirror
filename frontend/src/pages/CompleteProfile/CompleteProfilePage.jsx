import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Lightbulb, Camera, User, Baby } from 'lucide-react';
import { ROUTES, GENDERS, PHOTO_TIPS } from '@constants';
import { useApp } from '@context/AppContext';

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { state, setProfile } = useApp();
  
  const [gender, setLocalGender] = useState(state.profile.gender || '');
  const [height, setLocalHeight] = useState(state.profile.height || '');
  
  // Inline validation state
  const [errors, setErrors] = useState({ gender: '', height: '' });

  useEffect(() => {
    document.title = 'Complete Profile — VisionMirror';
  }, []);

  const validateAndProceed = () => {
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
      // Save to Context
      setProfile({ gender, height: h });
      // Navigate to Camera Capture
      navigate(ROUTES.CAMERA_CAPTURE);
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
          aria-label="Go back"
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
            COMPLETE YOUR PROFILE
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-mocha text-xs md:text-base font-medium tracking-wide"
          >
            Let's personalize your shopping experience
          </motion.p>
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-16 flex-1 min-h-0">
          
          {/* ── Left Column: Form ── */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 w-full flex flex-col justify-center max-w-md mx-auto md:mx-0 min-h-0"
          >
            {/* Profile Placeholder (Navigates to Camera instead of file picker) */}
            <div className="flex justify-center mb-4 lg:mb-8 shrink-0">
              <button 
                type="button"
                onClick={validateAndProceed}
                aria-label="Open Camera"
                className="relative group block"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 lg:w-44 lg:h-44 rounded-full bg-[#6B4226] border border-[#7D4E2D] flex items-center justify-center overflow-hidden shadow-card transition-all duration-300 group-hover:border-brand-gold group-hover:shadow-glow">
                  <User size={48} className="text-white opacity-60 group-hover:opacity-90 transition-opacity" />
                </div>
                {/* Camera Badge */}
                <div className="absolute bottom-0 right-0 lg:bottom-2 lg:right-2 w-8 h-8 md:w-11 md:h-11 bg-[#6B4226] text-white rounded-full flex items-center justify-center shadow-card border-2 border-white/20 transition-transform duration-300 group-hover:scale-110">
                  <Camera size={16} className="lg:w-5 lg:h-5" />
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
                        ? 'border-brand-gold bg-[#6B4226] text-white shadow-card scale-[1.03] font-extrabold' 
                        : 'border-white/10 bg-[#6B4226]/45 text-white/85 hover:border-white/30 hover:bg-[#6B4226]/65 hover:text-white font-bold'
                      }
                      ${errors.gender && !gender ? '!border-red-400 !bg-red-950/20 text-white' : ''}
                    `}
                  >
                    {g.id === 'kids' 
                      ? <Baby size={20} className={`mb-1 lg:w-7 lg:h-7 ${gender === g.id ? 'text-white' : 'text-white/85'}`} /> 
                      : <User size={20} className={`mb-1 lg:w-7 lg:h-7 ${gender === g.id ? 'text-white' : 'text-white/85'}`} />
                    }
                    <span className="text-[10px] lg:text-sm">{g.label}</span>
                  </button>
                ))}
              </div>
              {/* Inline Error for Gender */}
              {errors.gender && (
                <p className="absolute -bottom-4 lg:-bottom-5 left-0 right-0 text-center text-red-500 text-[10px] lg:text-xs font-semibold animate-pulse">
                  {errors.gender}
                </p>
              )}
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
                  input-base text-center text-xs lg:text-lg py-2.5 lg:py-4 backdrop-blur-sm transition-all shadow-sm rounded-xl lg:rounded-2xl text-white placeholder-white/60
                  ${errors.height 
                    ? 'border-red-400 bg-red-950/20 focus:border-red-500 focus:ring-red-500/20' 
                    : 'bg-[#6B4226]/80 border-white/10 focus:bg-[#6B4226] focus:border-white/30'
                  }
                `}
              />
              {/* Inline Error for Height */}
              {errors.height && (
                <p className="absolute -bottom-4 lg:-bottom-5 left-0 right-0 text-center text-red-500 text-[10px] lg:text-xs font-semibold animate-pulse">
                  {errors.height}
                </p>
              )}
            </div>
          </motion.div>

          {/* ── Right Column: Tips ── */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 w-full flex flex-col justify-center max-w-md mx-auto md:mx-0 min-h-0"
          >
            <div className="bg-[#6B4226] border border-[#7D4E2D] rounded-2xl lg:rounded-3xl p-4 lg:p-8 shadow-card flex flex-col shrink-0 text-white">
              <div className="flex items-center gap-2 lg:gap-4 mb-3 lg:mb-8">
                <div className="p-1.5 lg:p-3 bg-white/20 rounded-lg lg:rounded-xl">
                  <Lightbulb size={20} className="text-white lg:w-6 lg:h-6" />
                </div>
                <h2 className="font-display text-lg lg:text-3xl font-bold text-white">Photo Tips</h2>
              </div>
              
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-2 gap-y-2 lg:gap-y-0 lg:space-y-5">
                {PHOTO_TIPS.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 lg:gap-4 text-white">
                    <span className="flex-shrink-0 w-4 h-4 lg:w-7 lg:h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-extrabold text-[9px] lg:text-xs mt-0.5 border border-white/40 shadow-sm">
                      {i + 1}
                    </span>
                    <span className="font-bold text-[10px] lg:text-base leading-tight lg:leading-snug pt-0.5 lg:pt-1 text-white">{tip}</span>
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
          className="shrink-0 flex items-center justify-center gap-3 lg:gap-4 pt-4 lg:pt-6 mt-auto border-t border-brand-warm/30"
        >
          <button 
            onClick={() => navigate(ROUTES.LANDING)} 
            className="btn-secondary flex-1 md:flex-none md:w-[200px]"
          >
            Cancel
          </button>
          <button 
            onClick={validateAndProceed} 
            className="btn-primary flex-1 md:flex-none md:w-[240px] shadow-[0_8px_24px_rgba(44,24,16,0.35)]"
          >
            Try On
          </button>
        </motion.div>

      </div>
    </motion.main>
  );
}
