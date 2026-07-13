import { createContext, useContext, useReducer, useCallback } from 'react';

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  // Profile
  profile: {
    gender:    null,   // 'women' | 'men' | 'kids'
    height:    '',
    photoFile: null,   // File object
    photoUrl:  null,   // blob URL or server URL
  },

  // Selected garment from Collections
  selectedGarment: null,

  // Selected AI Model from Explore Models
  selectedModel: null,

  // Preferences (Step 1 — categories)
  selectedCategories: [],

  // Preferences (Step 2 — AI Stylist questions)
  occasion:          null,
  colorPreferences:  [],
  stylePreferences:  [],

  // Try-On result
  tryOnResult: null,   // URL of AI-generated image
  tryOnLoading: false,

  // Recommendations
  recommendations: [],
  recommendationsLoading: false,

  // Final look alternates
  alternateOutfits: [],

  // UI state
  toast: null,         // { message, type: 'success'|'error'|'info' }
};

// ─── Action Types ─────────────────────────────────────────────────────────────

export const ACTIONS = {
  SET_PROFILE:               'SET_PROFILE',
  SET_PROFILE_PHOTO:         'SET_PROFILE_PHOTO',
  SET_SELECTED_GARMENT:      'SET_SELECTED_GARMENT',
  SET_SELECTED_MODEL:        'SET_SELECTED_MODEL',
  SET_SELECTED_CATEGORIES:   'SET_SELECTED_CATEGORIES',
  SET_OCCASION:              'SET_OCCASION',
  SET_COLOR_PREFERENCES:     'SET_COLOR_PREFERENCES',
  SET_STYLE_PREFERENCES:     'SET_STYLE_PREFERENCES',
  SET_TRYON_RESULT:          'SET_TRYON_RESULT',
  SET_TRYON_LOADING:         'SET_TRYON_LOADING',
  SET_RECOMMENDATIONS:       'SET_RECOMMENDATIONS',
  SET_RECOMMENDATIONS_LOADING:'SET_RECOMMENDATIONS_LOADING',
  SET_ALTERNATE_OUTFITS:     'SET_ALTERNATE_OUTFITS',
  SET_TOAST:                 'SET_TOAST',
  CLEAR_TOAST:               'CLEAR_TOAST',
  RESET_SESSION:             'RESET_SESSION',
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PROFILE:
      return { ...state, profile: { ...state.profile, ...action.payload } };

    case ACTIONS.SET_PROFILE_PHOTO:
      return {
        ...state,
        profile: {
          ...state.profile,
          photoFile: action.payload.file,
          photoUrl:  action.payload.url,
        },
      };

    case ACTIONS.SET_SELECTED_GARMENT:
      return { ...state, selectedGarment: action.payload };

    case ACTIONS.SET_SELECTED_MODEL:
      return { ...state, selectedModel: action.payload };

    case ACTIONS.SET_SELECTED_CATEGORIES:
      return { ...state, selectedCategories: action.payload };

    case ACTIONS.SET_OCCASION:
      return { ...state, occasion: action.payload };

    case ACTIONS.SET_COLOR_PREFERENCES:
      return { ...state, colorPreferences: action.payload };

    case ACTIONS.SET_STYLE_PREFERENCES:
      return { ...state, stylePreferences: action.payload };

    case ACTIONS.SET_TRYON_RESULT:
      return { ...state, tryOnResult: action.payload, tryOnLoading: false };

    case ACTIONS.SET_TRYON_LOADING:
      return { ...state, tryOnLoading: action.payload };

    case ACTIONS.SET_RECOMMENDATIONS:
      return { ...state, recommendations: action.payload, recommendationsLoading: false };

    case ACTIONS.SET_RECOMMENDATIONS_LOADING:
      return { ...state, recommendationsLoading: action.payload };

    case ACTIONS.SET_ALTERNATE_OUTFITS:
      return { ...state, alternateOutfits: action.payload };

    case ACTIONS.SET_TOAST:
      return { ...state, toast: action.payload };

    case ACTIONS.CLEAR_TOAST:
      return { ...state, toast: null };

    case ACTIONS.RESET_SESSION:
      return { ...initialState };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const setProfile = useCallback((data) => {
    dispatch({ type: ACTIONS.SET_PROFILE, payload: data });
  }, []);

  const setProfilePhoto = useCallback((file, url) => {
    dispatch({ type: ACTIONS.SET_PROFILE_PHOTO, payload: { file, url } });
  }, []);

  const setSelectedGarment = useCallback((garment) => {
    dispatch({ type: ACTIONS.SET_SELECTED_GARMENT, payload: garment });
  }, []);

  const setSelectedModel = useCallback((model) => {
    dispatch({ type: ACTIONS.SET_SELECTED_MODEL, payload: model });
  }, []);

  const setSelectedCategories = useCallback((cats) => {
    dispatch({ type: ACTIONS.SET_SELECTED_CATEGORIES, payload: cats });
  }, []);

  const setOccasion = useCallback((occasion) => {
    dispatch({ type: ACTIONS.SET_OCCASION, payload: occasion });
  }, []);

  const setColorPreferences = useCallback((colors) => {
    dispatch({ type: ACTIONS.SET_COLOR_PREFERENCES, payload: colors });
  }, []);

  const setStylePreferences = useCallback((styles) => {
    dispatch({ type: ACTIONS.SET_STYLE_PREFERENCES, payload: styles });
  }, []);

  const setTryOnResult = useCallback((url) => {
    dispatch({ type: ACTIONS.SET_TRYON_RESULT, payload: url });
  }, []);

  const setTryOnLoading = useCallback((bool) => {
    dispatch({ type: ACTIONS.SET_TRYON_LOADING, payload: bool });
  }, []);

  const setRecommendations = useCallback((data) => {
    dispatch({ type: ACTIONS.SET_RECOMMENDATIONS, payload: data });
  }, []);

  const setRecommendationsLoading = useCallback((bool) => {
    dispatch({ type: ACTIONS.SET_RECOMMENDATIONS_LOADING, payload: bool });
  }, []);

  const setAlternateOutfits = useCallback((outfits) => {
    dispatch({ type: ACTIONS.SET_ALTERNATE_OUTFITS, payload: outfits });
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    dispatch({ type: ACTIONS.SET_TOAST, payload: { message, type } });
    setTimeout(() => dispatch({ type: ACTIONS.CLEAR_TOAST }), 3500);
  }, []);

  const resetSession = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_SESSION });
  }, []);

  const value = {
    state,
    dispatch,
    // Helpers
    setProfile,
    setProfilePhoto,
    setSelectedGarment,
    setSelectedModel,
    setSelectedCategories,
    setOccasion,
    setColorPreferences,
    setStylePreferences,
    setTryOnResult,
    setTryOnLoading,
    setRecommendations,
    setRecommendationsLoading,
    setAlternateOutfits,
    showToast,
    resetSession,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
