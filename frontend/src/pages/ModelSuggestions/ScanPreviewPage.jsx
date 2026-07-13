import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '@constants';
import { useApp } from '@context/AppContext';

export default function ScanPreviewPage() {
  const navigate = useNavigate();
  const { state } = useApp();
  
  const [progress, setProgress] = useState(0);

  // If there's no photo, redirect to start
  useEffect(() => {
    if (!state.profile?.photoUrl) {
      navigate(ROUTES.LANDING);
    }
  }, [state.profile?.photoUrl, navigate]);

  // Simulate scanning progress
  useEffect(() => {
    const duration = 4000; // 4 seconds
    const intervalMs = 50;
    const steps = duration / intervalMs;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, []);

  // Navigate when complete
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        navigate(ROUTES.EXPLORE_MODELS);
      }, 500); // slight pause at 100%
      return () => clearTimeout(timeout);
    }
  }, [progress, navigate]);

  const displayProgress = Math.min(100, Math.floor(progress));

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="page-container !h-[100dvh] relative overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Background elements */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none"
        style={{ backgroundImage: "url('/assets/backgrounds/tryon-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/80 via-brand-cream to-brand-cream backdrop-blur-[2px] pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-4 flex-1 min-h-0 py-8">
        
        {/* Loading Indicator */}
        <div className="text-center mb-6 shrink-0">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-brand-dark mb-2">
            Analyzing your style...
          </h2>
          <p className="text-brand-mocha font-medium tracking-widest uppercase">
            {displayProgress}% Complete
          </p>
        </div>

        {/* Portrait Camera Frame */}
        <div
          className="
            relative
            aspect-[3/4]
            h-full max-w-[75vw]
            rounded-[2.5rem] overflow-hidden
            bg-brand-dark
            shadow-[0_24px_72px_rgba(44,24,16,0.5)]
            border-[3px] border-white/55
            ring-1 ring-brand-gold/25
          "
        >
          {/* Captured Image */}
          {state.profile?.photoUrl && (
            <img
              src={state.profile.photoUrl}
              alt="Your captured photo"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* AI Scan Silhouette Overlay */}
          <div
            className="absolute inset-x-0 z-10 pointer-events-none flex justify-center"
            style={{ top: '22%', bottom: '4%' }}
          >
            <img
              src="/assets/overlays/scan-overlay.png"
              alt=""
              aria-hidden="true"
              className="w-[78%] h-full object-contain opacity-70 mix-blend-screen"
            />
          </div>

          {/* Animated Scanning Laser Line */}
          <motion.div
            className="absolute left-0 right-0 h-[3px] bg-brand-gold shadow-[0_0_20px_rgba(184,149,106,1)] z-20 pointer-events-none"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
          />
          
          {/* Scanning Grid/Mesh Overlay (Optional extra sci-fi feel) */}
          <div 
            className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay opacity-30"
            style={{
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
        </div>
      </div>
    </motion.main>
  );
}
