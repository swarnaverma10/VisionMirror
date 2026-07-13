import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@constants';
import PageLoader from '@components/Loader/PageLoader';

// ─── Lazy-loaded Pages ────────────────────────────────────────────────────────

const Landing          = lazy(() => import('@pages/Landing/LandingPage'));
const CompleteProfile  = lazy(() => import('@pages/CompleteProfile/CompleteProfilePage'));
const CameraCapture    = lazy(() => import('@pages/CameraCapture/CameraCapturePage'));
const PhotoPreview     = lazy(() => import('@pages/PhotoPreview/PhotoPreviewPage'));
const Collections      = lazy(() => import('@pages/Collections/CollectionsPage'));
const Preferences      = lazy(() => import('@pages/Preferences/PreferencesPage'));
const ScanPreview      = lazy(() => import('@pages/ModelSuggestions/ScanPreviewPage'));
const ExploreModels    = lazy(() => import('@pages/ModelSuggestions/ExploreModelsPage'));
const TryOn            = lazy(() => import('@pages/TryOn/TryOnPage'));
const AIStylist        = lazy(() => import('@pages/AIStylist/AIStylistPage'));
const FinalLook        = lazy(() => import('@pages/FinalLook/FinalLookPage'));
const ThankYou         = lazy(() => import('@pages/ThankYou/ThankYouPage'));

// ─── Router ───────────────────────────────────────────────────────────────────

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={ROUTES.LANDING}          element={<Landing />} />
        <Route path={ROUTES.COMPLETE_PROFILE} element={<CompleteProfile />} />
        <Route path={ROUTES.CAMERA_CAPTURE}   element={<CameraCapture />} />
        <Route path={ROUTES.PHOTO_PREVIEW}    element={<PhotoPreview />} />
        <Route path={ROUTES.COLLECTIONS}      element={<Collections />} />
        <Route path={ROUTES.PREFERENCES}      element={<Preferences />} />
        <Route path={ROUTES.SCAN_PREVIEW}     element={<ScanPreview />} />
        <Route path={ROUTES.EXPLORE_MODELS}   element={<ExploreModels />} />
        <Route path={ROUTES.TRYON}            element={<TryOn />} />
        <Route path={ROUTES.AI_STYLIST}       element={<AIStylist />} />
        <Route path={ROUTES.FINAL_LOOK}       element={<FinalLook />} />
        <Route path={ROUTES.THANK_YOU}        element={<ThankYou />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
      </Routes>
    </Suspense>
  );
}
