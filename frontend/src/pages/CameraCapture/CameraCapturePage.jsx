import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { ROUTES } from '@constants';
import { useApp } from '@context/AppContext';
import { useCountdown } from '@hooks';

/**
 * Request portrait 3:4 video from the browser.
 *
 * Setting aspectRatio: 3/4 tells the browser's MediaDevices API to deliver
 * a portrait-cropped stream directly — the sensor is cropped server-side
 * before the pixels reach the <video> element. This means:
 *   - The live <video> tag is natively portrait (no letterbox bars).
 *   - getScreenshot() returns a portrait image that matches the live view.
 *   - object-cover fills the portrait frame with no gaps and no distortion.
 *
 * width/height ideals bias toward high resolution within that ratio.
 * The browser picks the closest supported mode; it never distorts or rotates.
 */
const videoConstraints = {
  facingMode: 'user',
  aspectRatio: 3 / 4,          // portrait 3:4  (width ÷ height)
  width:  { ideal: 1080 },     // resolution hint — browser may lower it
  height: { ideal: 1440 },
};

export default function CameraCapturePage() {
  const navigate  = useNavigate();
  const { setProfilePhoto, showToast } = useApp();

  const webcamRef    = useRef(null);
  const captureRef   = useRef(null);   // stable callback ref for countdown
  const fileInputRef = useRef(null);

  const [hasPermission, setHasPermission] = useState(null);
  const [capturedImg,   setCapturedImg]   = useState(null);
  const [bodyDetected,  setBodyDetected]  = useState(false);
  const [isDesktop,     setIsDesktop]     = useState(window.innerWidth >= 1024);
  const [posenetModel,  setPosenetModel]  = useState(null);
  const [modelLoading,  setModelLoading]  = useState(true);

  /* ── Countdown ───────────────────────────────────────────────────────────── */
  const { count, running: isRunning, start, reset } = useCountdown(
    5,
    useCallback(() => { captureRef.current?.(); }, [])
  );

  /* ── Lifecycle ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    document.title = 'Camera Capture — VisionMirror';
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => { reset(); window.removeEventListener('resize', onResize); };
  }, [reset]);

  // Load PoseNet model from CDN scripts
  useEffect(() => {
    let active = true;
    const loadModel = async () => {
      while (active && !window.posenet) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      if (!active) return;
      try {
        const model = await window.posenet.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: { width: 257, height: 257 },
          multiplier: 0.75
        });
        if (active) {
          setPosenetModel(model);
          setModelLoading(false);
        }
      } catch (e) {
        console.error("Failed to load PoseNet:", e);
        if (active) setModelLoading(false);
      }
    };
    loadModel();
    return () => { active = false; };
  }, []);

  // Run PoseNet body detection on the webcam feed
  useEffect(() => {
    if (!posenetModel || hasPermission !== true || capturedImg || isRunning) return;

    const detectBody = async () => {
      const video = webcamRef.current?.video;
      if (video && video.readyState === 4) {
        try {
          const pose = await posenetModel.estimateSinglePose(video, {
            flipHorizontal: true
          });
          
          const nose = pose.keypoints.find(k => k.part === 'nose');
          const leftAnkle = pose.keypoints.find(k => k.part === 'leftAnkle');
          const rightAnkle = pose.keypoints.find(k => k.part === 'rightAnkle');
          
          const minScore = 0.45;
          
          const headVisible = nose && nose.score >= minScore;
          const feetVisible = (leftAnkle && leftAnkle.score >= minScore) || (rightAnkle && rightAnkle.score >= minScore);
          
          setBodyDetected(!!(headVisible && feetVisible));
        } catch (e) {
          console.error("Estimation error:", e);
        }
      }
    };

    const interval = setInterval(detectBody, 400);
    return () => clearInterval(interval);
  }, [posenetModel, hasPermission, capturedImg, isRunning]);

  /* ── Capture ─────────────────────────────────────────────────────────────── */
  const capturePhoto = useCallback(() => {
    const cam = webcamRef.current;
    if (!cam) { console.error('webcamRef is null'); return; }

    // Because videoConstraints requests aspectRatio 3:4, the browser delivers
    // a portrait stream. getScreenshot() therefore returns a portrait image
    // that is pixel-identical to the live view — no canvas crop needed.
    const img = cam.getScreenshot();
    if (!img) { console.error('getScreenshot() returned null'); return; }

    setCapturedImg(img);
    setProfilePhoto(null, img);
  }, [setProfilePhoto]);

  captureRef.current = capturePhoto;

  /* ── Handlers ────────────────────────────────────────────────────────────── */
  const handleUserMedia = () => { setHasPermission(true); reset(); };

  const handleUserMediaError = (err) => {
    console.error('Camera error:', err);
    setHasPermission(false);
    showToast('Camera access denied or unavailable.', 'error');
  };

  const handleStartCapture = () => {
    if (hasPermission !== true) return;
    reset();
    start();
  };

  const handleRetake = () => {
    setCapturedImg(null);
    setProfilePhoto(null, null);
    setBodyDetected(false);
    reset();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setCapturedImg(dataUrl);
      setProfilePhoto(file, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleContinue = async () => {
    if (!capturedImg) return;
    try {
      if (capturedImg.startsWith('data:') && !fileInputRef.current?.files?.[0]) {
        const res  = await fetch(capturedImg);
        const blob = await res.blob();
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        setProfilePhoto(file, capturedImg);
      }
      navigate(ROUTES.PHOTO_PREVIEW);
    } catch {
      showToast('Failed to save photo.', 'error');
    }
  };

  /* ── Render ──────────────────────────────────────────────────────────────── */
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative h-[100dvh] w-full flex flex-col bg-brand-cream overflow-hidden"
    >
      {/* Luxury background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: "url('/assets/backgrounds/tryon-bg.jpg')" }}
        role="presentation"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/60 via-brand-cream/85 to-brand-cream backdrop-blur-md pointer-events-none" />

      {/* ── Header ── */}
      <header className="relative z-50 flex items-center px-4 py-2 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="btn-icon"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>
      </header>

      {/* ── Camera section — fills all space between header and controls ── */}
      {/* px-2: minimal side breathing room; no pb so frame touches controls bar */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-2 min-h-0">

        {/*
          Portrait mirror frame — true 3:4 ratio, ~85dvh tall.

          aspect-[3/4] locks the ratio so width = height × 0.75.
          h-full fills the flex-1 container (viewport minus header + controls).
          max-w-[75vw] prevents overflow on narrow screens.
          No hard pixel cap — the frame scales with the viewport.

          On a 1080p desktop (1920×1080):
            available height ≈ 980px → width = 735px (38% of 1920 — fills center)
          On a typical laptop (1366×768):
            available height ≈ 660px → width = 495px (36% of 1366)
          On mobile (390×844):
            available height ≈ 740px → width = 555px, capped by 75vw = 292px
        */}
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

          {/* ── Camera not permitted ── */}
          {hasPermission === false && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 bg-brand-dark/95 backdrop-blur-md">
              <AlertCircle size={44} className="text-red-400 mb-4" />
              <p className="text-brand-cream text-base font-display font-medium mb-2">Camera Access Required</p>
              <p className="text-brand-cream/70 text-sm max-w-[240px] leading-relaxed">
                Please enable camera permissions in your browser settings to use the virtual mirror.
              </p>
            </div>
          )}

          {/* ── Live webcam feed ── */}
          {!capturedImg && (
            /*
              object-cover fills the portrait frame from edge to edge —
              no black bars, no empty space. The landscape video is cropped
              on the left and right (not top/bottom), so the face stays visible.
              scaleX(-1) mirrors it to feel like a real mirror.
              No scale(), no zoom — natural size, just cropped to fill.
            */
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.95}
              videoConstraints={videoConstraints}
              onUserMedia={handleUserMedia}
              onUserMediaError={handleUserMediaError}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          )}

          {/* ── Captured image preview ── */}
          {capturedImg && (
            /*
              The captured image was cropped to exactly match what was visible
              in the live feed (same portrait crop). Use object-cover to fill
              the same frame without any bars or stretching.
              No scaleX(-1): the canvas-cropped image is already correct orientation.
            */
            <img
              src={capturedImg}
              alt="Your captured photo"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* ── Fitting guide (top overlay, live only) ── */}
          {!capturedImg && (
            <div className="absolute top-3 left-3 right-3 z-20 pointer-events-none">
              <div className="bg-black/55 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-center">
                <p className="text-white/90 text-[9px] font-bold tracking-widest uppercase mb-0.5">
                  Fitting Guide
                </p>
                <p className="text-white/65 text-[9px] leading-snug">
                  {isDesktop
                    ? 'Centre your upper body · step back for full body'
                    : 'Stand 2–3 m away · fit your full body in the frame'}
                </p>
              </div>
            </div>
          )}

          {/* ── HUD corner brackets (live only) ── */}
          {!capturedImg && ['top-4 left-4 border-t-[2px] border-l-[2px]',
            'top-4 right-4 border-t-[2px] border-r-[2px]',
            'bottom-14 left-4 border-b-[2px] border-l-[2px]',
            'bottom-14 right-4 border-b-[2px] border-r-[2px]',
          ].map((cls, i) => (
            <div key={i} className={`absolute ${cls} w-5 h-5 border-white/35 pointer-events-none z-10`} />
          ))}

          {/* ── Silhouette overlay (live only — hidden on capture for clean preview) ── */}
          {!capturedImg && (
            <div
              className="absolute inset-x-0 z-10 pointer-events-none flex justify-center"
              style={{ top: '22%', bottom: '4%' }}
            >
              <img
                src="/assets/overlays/scan-overlay.png"
                alt=""
                aria-hidden="true"
                className="w-[78%] h-full object-contain opacity-60 mix-blend-screen"
              />
            </div>
          )}

          {/* ── Laser scan line (countdown only) ── */}
          {!capturedImg && isRunning && (
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-brand-gold/70 shadow-[0_0_14px_rgba(184,149,106,0.9)] z-20 pointer-events-none"
              animate={{ top: ['12%', '88%', '12%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            />
          )}

          {!capturedImg && hasPermission === true && !isRunning && (
            <div
              className={`
                absolute bottom-3 left-3 right-3 z-20
                px-3 py-1.5 rounded-xl text-center border pointer-events-none
                text-[9px] font-bold uppercase tracking-widest
                transition-colors duration-500
                ${modelLoading
                  ? 'bg-brand-dark/85 border-white/10 text-white animate-pulse'
                  : bodyDetected
                    ? 'bg-brand-gold/85 border-brand-gold/30 text-brand-dark'
                    : 'bg-brand-dark/75 border-white/15 text-white/90'}
              `}
            >
              {modelLoading
                ? '⚙ Initializing AI body guide...'
                : bodyDetected
                  ? '✓ Full Body Detected — Ready'
                  : '💡 For best results, use a full-body photo'}
            </div>
          )}

          {/* ── Countdown overlay ── */}
          <AnimatePresence>
            {isRunning && count > 0 && !capturedImg && (
              <motion.div
                key={count}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={{ scale: 0.8,    opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[1px]"
              >
                <span className="font-display font-bold text-white text-[9rem] leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
                  {count}
                </span>
                {count === 5 && (
                  <span className="text-white/85 text-sm font-semibold mt-2 tracking-widest uppercase animate-pulse">
                    Get Ready
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>{/* /portrait frame */}
      </div>{/* /camera section */}

      {/* ── Bottom Controls — fixed bar, always below camera ── */}
      <div className="relative z-50 shrink-0 px-4 py-3 w-full bg-brand-cream/85 backdrop-blur-lg border-t border-brand-warm/25">
        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-2">

          {/* Desktop tip */}
          {!capturedImg && !isRunning && isDesktop && (
            <p className="text-[9px] text-brand-espresso/55 text-center font-medium leading-snug select-none max-w-[300px]">
              For best AI try-on results, upload a full-body photo or use a mobile device.
            </p>
          )}

          <div className="flex items-center gap-3 w-full">

            {/* State: before capture */}
            {!capturedImg && !isRunning && (
              <>
                <button
                  id="btn-capture"
                  onClick={handleStartCapture}
                  disabled={hasPermission !== true}
                  className="btn-primary flex-1 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Capture
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  id="btn-upload"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary flex-1"
                >
                  Upload Photo
                </button>
              </>
            )}

            {/* State: after capture */}
            {capturedImg && (
              <>
                <button
                  id="btn-retake"
                  onClick={handleRetake}
                  className="btn-secondary flex-1"
                >
                  <RefreshCw size={16} className="mr-1.5 inline" />
                  Retake
                </button>
                <button
                  id="btn-continue"
                  onClick={handleContinue}
                  className="btn-primary flex-1 shadow-[0_8px_24px_rgba(44,24,16,0.3)]"
                >
                  <Check size={18} className="mr-1.5 inline" />
                  Continue
                </button>
              </>
            )}

          </div>
        </div>
      </div>

    </motion.main>
  );
}
