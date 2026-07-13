import { createContext, useContext, useState, useCallback } from 'react';

// ─── Context ──────────────────────────────────────────────────────────────────

const CollectionsContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CollectionsProvider({ children }) {
  const [activeGender,   setActiveGender]   = useState('women');
  const [activeCategory, setActiveCategory] = useState('all');
  const [wishlist,       setWishlist]       = useState([]);

  const toggleWishlist = useCallback((itemId) => {
    setWishlist((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  }, []);

  const isWishlisted = useCallback(
    (itemId) => wishlist.includes(itemId),
    [wishlist]
  );

  const value = {
    activeGender,
    setActiveGender,
    activeCategory,
    setActiveCategory,
    wishlist,
    toggleWishlist,
    isWishlisted,
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCollections() {
  const ctx = useContext(CollectionsContext);
  if (!ctx) throw new Error('useCollections must be used within CollectionsProvider');
  return ctx;
}

export default CollectionsContext;
