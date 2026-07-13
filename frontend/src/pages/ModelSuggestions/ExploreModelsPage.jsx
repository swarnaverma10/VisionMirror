import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, Heart, X, Star } from 'lucide-react';
import { ROUTES } from '@constants';
import { useApp } from '@context/AppContext';

const productModules = import.meta.glob('/public/assets/products/**/*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' });

const PRICES = ["₹1,999", "₹2,499", "₹3,799", "₹5,499", "₹7,999", "₹11,999"];

function getProductDetails(path, index) {
  let name = "Premium Designer Outfit";
  let description = "Exclusive luxury collection.";
  let fabric = "Premium Blend";
  let occasion = "Versatile";

  const pick = (arr) => arr[index % arr.length];

  if (path.includes('/women/')) {
    if (path.includes('/saree/')) {
      name = pick(["Kanjeevaram Silk Saree", "Royal Banarasi Saree"]);
      description = "Elegant handcrafted silk saree for festive occasions.";
      fabric = "Pure Silk";
      occasion = "Wedding / Festive";
    } else if (path.includes('/blazer-dress/')) {
      name = "Premium Office Blazer";
      description = "Premium office wear crafted for a modern professional look.";
      fabric = "Poly Viscose";
      occasion = "Office / Formal";
    } else if (path.includes('/ethnic-suits/')) {
      name = pick(["Cotton Ethnic Suit", "Designer Anarkali", "Classic Black Kurti"]);
      description = "Comfortable and elegant ethnic wear.";
      fabric = "Cotton Silk";
      occasion = "Festive / Casual";
    } else if (path.includes('/gowns/')) {
      name = "Midnight Velvet Gown";
      description = "Luxury evening wear with premium fabric.";
      fabric = "Velvet / Satin";
      occasion = "Party / Evening";
    } else if (path.includes('/dresses/')) {
      name = pick(["Floral Summer Dress", "Elegant Maxi Dress"]);
      description = "Comfortable and stylish dress for day outs.";
      fabric = "Cotton Blend";
      occasion = "Casual / Party";
    } else if (path.includes('/jeans-top/')) {
      name = "Executive Co-ord Set";
      description = "Trendy and comfortable everyday outfit.";
      fabric = "Denim / Cotton";
      occasion = "Casual";
    } else if (path.includes('/lehenga/')) {
      name = pick(["Princess Lehenga", "Luxury Wedding Lehenga"]);
      description = "Luxury handcrafted lehenga for weddings.";
      fabric = "Georgette / Net";
      occasion = "Wedding";
    }
  } else if (path.includes('/men/')) {
    if (path.includes('/blazer-set/')) {
      name = pick(["Executive Suit", "Slim Fit Blazer", "Premium Office Blazer", "Formal Trouser"]);
      description = "Tailored perfection for business and formal events.";
      fabric = "Wool Blend";
      occasion = "Formal / Office";
    } else if (path.includes('/kurta/')) {
      name = "Cotton Kurta";
      description = "Comfortable and elegant ethnic wear.";
      fabric = "Cotton";
      occasion = "Festive / Casual";
    } else if (path.includes('/sherwani/')) {
      name = "Wedding Sherwani";
      description = "Premium embroidered sherwani for groomsmen.";
      fabric = "Silk Blend";
      occasion = "Wedding";
    } else if (path.includes('/shirt-jeans/')) {
      name = "Linen Casual Shirt";
      description = "Perfect smart-casual outfit for everyday wear.";
      fabric = "100% Linen";
      occasion = "Casual";
    } else if (path.includes('/tshirt-jeans/')) {
      name = pick(["Denim Jacket", "Streetwear Hoodie", "Polo T-Shirt", "Cargo Outfit"]);
      description = "Trendy and comfortable streetwear.";
      fabric = "Denim / Cotton";
      occasion = "Casual";
    }
  } else if (path.includes('/kids/')) {
    if (path.includes('/boys/blazer-set/')) {
      name = "Winter Jacket Set";
      description = "Stylish jacket set for parties.";
      fabric = "Cotton Blend";
      occasion = "Party / Casual";
    } else if (path.includes('/boys/casuals/')) {
      name = pick(["Kids Denim Outfit", "Boys Hoodie Set", "Cartoon Cotton Tee", "Casual Playwear"]);
      description = "Comfortable cotton outfit for all-day play.";
      fabric = "Soft Cotton";
      occasion = "Casual";
    } else if (path.includes('/boys/kurta-pyjama/')) {
      name = pick(["Kids Sherwani", "Ethnic Kurta Set"]);
      description = "Cute traditional wear for festivals.";
      fabric = "Silk Blend";
      occasion = "Festive";
    } else if (path.includes('/girls/casuals/')) {
      name = "Kids Denim Outfit";
      description = "Comfortable cotton outfit for all-day wear.";
      fabric = "Denim / Cotton";
      occasion = "Casual";
    } else if (path.includes('/girls/ethnic/')) {
      name = "Girls Floral Dress";
      description = "Beautiful traditional wear for girls.";
      fabric = "Cotton Silk";
      occasion = "Festive";
    } else if (path.includes('/girls/gowns/')) {
      name = "Birthday Dress";
      description = "Luxury gown for special occasions.";
      fabric = "Net / Satin";
      occasion = "Party / Birthday";
    } else if (path.includes('/girls/western-dresses/')) {
      name = "Princess Party Frock";
      description = "Beautiful party wear for kids.";
      fabric = "Net / Satin";
      occasion = "Party";
    } else {
      name = "Casual Playwear";
      description = "Comfortable playwear for kids.";
      fabric = "Soft Cotton";
      occasion = "Casual";
    }
  }

  return { name, description, fabric, occasion, price: PRICES[index % PRICES.length] };
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function ExploreModelsPage() {
  const navigate = useNavigate();
  const { state, setSelectedModel } = useApp();
  
  const [selectedId, setSelectedId] = useState(state.selectedModel?.id || null);
  const [wishlist, setWishlist] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    document.title = 'Explore Models — VisionMirror';
  }, []);

  const activeGender = state.profile?.gender || 'women';

  // Parse products and randomly assign mock data
  const allProducts = useMemo(() => {
    const filteredUrls = Object.entries(productModules)
      .filter(([path]) => {
        const match = path.match(/\/products\/(women|men|kids)\//);
        const gender = match ? match[1] : null;
        return gender === activeGender;
      })
      .map(([path, url]) => ({ id: path, image: url }));

    const shuffledUrls = shuffle(filteredUrls);
    const selectedUrls = shuffledUrls.slice(0, 16);

    // If there are less than 16, repeat them to fill the grid
    while (selectedUrls.length > 0 && selectedUrls.length < 16) {
      selectedUrls.push({ ...selectedUrls[selectedUrls.length % shuffledUrls.length], id: selectedUrls.length + '_dup' });
    }

    return selectedUrls.map((item, index) => {
      const details = getProductDetails(item.id, index);
      return {
        ...item,
        name: details.name,
        description: details.description,
        price: details.price,
        fabric: details.fabric,
        color: "Multiple Colors Available",
        occasion: details.occasion,
        sizes: "XS, S, M, L, XL",
        rating: (4 + Math.random()).toFixed(1)
      };
    });
  }, [activeGender]);

  const paginatedProducts = useMemo(() => {
    const start = currentPage * 8;
    return allProducts.slice(start, start + 8);
  }, [allProducts, currentPage]);

  const toggleWishlist = (e, id) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]);
  };

  const handleSelectOutfit = () => {
    if (modalProduct) {
      setSelectedId(modalProduct.id);
      setSelectedModel(modalProduct); // Store in context
      setModalProduct(null); // Close modal
    }
  };

  const handleContinue = () => {
    if (selectedId) {
      navigate(ROUTES.TRYON);
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
          onClick={() => navigate(ROUTES.SCAN_PREVIEW)}
          className="btn-icon"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="w-10 h-10" />
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col px-4 w-full max-w-7xl mx-auto min-h-0 pt-0 pb-20">
        
        {/* Title Section */}
        <div className="text-center mt-2 mb-4 shrink-0">
          <h1 className="font-display text-[32px] md:text-[52px] font-[800] uppercase tracking-[0.06em] text-brand-dark leading-tight mb-1">
            EXPLORE MODELS
          </h1>
          <p className="text-brand-mocha text-xs md:text-sm max-w-md mx-auto hidden sm:block">
            Choose a model to preview your selected style.
          </p>
        </div>

        {/* Paginated Grid - 8 Items (4x2 Desktop, 2x4 Mobile) */}
        <div className="flex-1 min-h-0 w-full flex flex-col justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentPage}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 grid-rows-4 md:grid-rows-2 gap-3 md:gap-5 w-full h-full max-h-full"
            >
              {paginatedProducts.map((product) => {
                const isSelected = selectedId === product.id;
                const isWished = wishlist.includes(product.id);

                return (
                  <motion.div
                    key={product.id}
                    onClick={() => setModalProduct(product)}
                    whileHover={{ scale: 0.98 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative group overflow-hidden rounded-2xl flex flex-col
                      bg-white/60 backdrop-blur-sm border transition-all cursor-pointer shadow-sm
                      ${isSelected ? 'border-brand-espresso ring-2 ring-brand-espresso/20' : 'border-white hover:border-brand-warm'}
                    `}
                  >
                    {/* Image Container */}
                    <div className="relative flex-1 min-h-0 w-full overflow-hidden bg-brand-beige">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Top Right Wishlist Icon */}
                      <button 
                        onClick={(e) => toggleWishlist(e, product.id)}
                        className="absolute top-2 right-2 p-2 rounded-full bg-white/60 backdrop-blur-md hover:bg-white transition-colors z-10"
                      >
                        <Heart 
                          size={16} 
                          className={`transition-colors ${isWished ? 'fill-red-500 text-red-500' : 'text-brand-dark'}`} 
                        />
                      </button>

                      {/* Selection Indicator */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute top-2 left-2 w-6 h-6 rounded-full bg-brand-espresso text-brand-cream flex items-center justify-center shadow-md z-10"
                          >
                            <Check size={14} strokeWidth={3} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Card Content Footer */}
                    <div className="p-3 md:p-4 flex flex-col justify-between shrink-0 bg-brand-espresso">
                      <h3 className="font-display text-sm md:text-base font-semibold text-white truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs md:text-sm text-white/80 truncate mt-0.5 mb-1 hidden sm:block">
                        {product.description}
                      </p>
                      <p className="text-sm md:text-base font-bold text-white">
                        {product.price}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-4 shrink-0">
            <button 
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
              className="p-2 rounded-full bg-white/60 backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
            >
              <ChevronLeft size={20} className="text-brand-dark" />
            </button>
            <div className="flex gap-2">
              <div className={`w-2 h-2 rounded-full ${currentPage === 0 ? 'bg-brand-espresso' : 'bg-brand-warm'}`} />
              <div className={`w-2 h-2 rounded-full ${currentPage === 1 ? 'bg-brand-espresso' : 'bg-brand-warm'}`} />
            </div>
            <button 
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-white/60 backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors rotate-180"
            >
              <ChevronLeft size={20} className="text-brand-dark" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 inset-x-0 z-40 p-3 bg-gradient-to-t from-brand-cream via-brand-cream/90 to-transparent pb-4 pt-8 pointer-events-none">
        <div className="max-w-md mx-auto flex gap-4 pointer-events-auto">
          <button
            onClick={handleContinue}
            disabled={!selectedId}
            className="btn-primary flex-1 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {modalProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-sm"
            onClick={() => setModalProduct(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-brand-espresso w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setModalProduct(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-brand-cream rounded-full hover:bg-brand-beige transition-colors"
              >
                <X size={20} className="text-brand-espresso" />
              </button>

              {/* Modal Image */}
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-brand-beige relative overflow-hidden">
                <img 
                  src={modalProduct.image} 
                  alt={modalProduct.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Modal Details */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col h-full overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                    {modalProduct.name}
                  </h2>
                  <button 
                    onClick={(e) => toggleWishlist(e, modalProduct.id)}
                    className="p-2 rounded-full bg-brand-cream hover:bg-brand-beige transition-colors shrink-0"
                  >
                    <Heart 
                      size={20} 
                      className={wishlist.includes(modalProduct.id) ? 'fill-red-500 text-red-500' : 'text-brand-espresso'} 
                    />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    <Star size={16} className="fill-current" />
                    <Star size={16} className="fill-current" />
                    <Star size={16} className="fill-current" />
                    <Star size={16} className="fill-current" />
                    <Star size={16} className="fill-current opacity-50" />
                  </div>
                  <span className="text-sm font-medium text-white/80">{modalProduct.rating} / 5.0</span>
                </div>

                <p className="text-2xl font-bold text-brand-beige mb-4">
                  {modalProduct.price}
                </p>

                <div className="space-y-4 text-white/80 text-sm md:text-base flex-1">
                  <p className="text-white">{modalProduct.description}</p>
                  
                  <div className="grid grid-cols-2 gap-y-2 pt-4 border-t border-brand-beige/30">
                    <div className="font-semibold text-white">Fabric</div>
                    <div className="text-brand-beige">{modalProduct.fabric}</div>
                    
                    <div className="font-semibold text-white">Color</div>
                    <div className="text-brand-beige">{modalProduct.color}</div>
                    
                    <div className="font-semibold text-white">Occasion</div>
                    <div className="text-brand-beige">{modalProduct.occasion}</div>

                    <div className="font-semibold text-white">Sizes</div>
                    <div className="text-brand-beige">{modalProduct.sizes}</div>
                  </div>
                </div>

                <button
                  onClick={handleSelectOutfit}
                  className="w-full py-4 rounded-2xl text-base font-bold bg-brand-cream text-brand-espresso shadow-glow mt-8 shrink-0 hover:bg-brand-beige transition-colors"
                >
                  Select This Outfit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
