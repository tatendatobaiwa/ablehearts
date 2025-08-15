import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { db } from '/src/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { safeMap, safeLength, isValidArray } from '../../utils/safeArrayOperations';
import { safeDocument, safeWindow } from '../../utils/safeDOMAccess';
import './Shop.css';
import { useFadeInAnimation, usePageFadeIn } from '../../hooks/useFadeInAnimation';
import SimpleSEO from '../../components/SEO/SimpleSEO';

import blob1 from '/src/assets/fixed/icons/blob1.webp';
import blob2 from '/src/assets/fixed/icons/blob2.webp';
import blob3 from '/src/assets/fixed/icons/blob3.webp';
import blob4 from '/src/assets/fixed/icons/blob4.webp';

import whiteTfront from '/src/assets/fixed/merch/whiteTfront.webp';
import whiteTback from '/src/assets/fixed/merch/whiteTback.webp';
import whitejersey1 from '/src/assets/fixed/merch/whitejersey1.webp';
import whitejersey2 from '/src/assets/fixed/merch/whitejersey2.webp';
import blackjerseyfront from '/src/assets/fixed/merch/blackjerseyfront.webp';
import blackjerseyback from '/src/assets/fixed/merch/blackjerseyback.webp';

const BLOB_IMAGE_IMPORTS = [blob1, blob3, blob4, blob2];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SCROLL_THRESHOLD_TOP_BTN = 300;

const SHOP_PRODUCTS = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    price: 200.00,
    images: [whiteTfront, whiteTback],
  },
  {
    id: 2,
    name: '"EQUALITY" White Sports Jersey',
    price: 250.00,
    images: [whitejersey1, whitejersey2],
  },
  {
    id: 3,
    name: '"EQUALITY" Black Sports Jersey',
    price: 300.00,
    images: [blackjerseyfront, blackjerseyback],
  },
];

const ProductCard = memo(({ product, onOpenModal }) => (
  <div
    className="product-card-shop"
    onClick={() => onOpenModal(product)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenModal(product)}
    aria-label={`View details for ${product.name}`}
  >
    <img
      src={product.images[0]}
      alt={product.name}
      className="product-image-shop"
      loading="lazy"
      width="300"
      height="300"
    />
    <h2 className="product-title-shop">{product.name}</h2>
    <p className="product-price-shop">P{product.price.toFixed(2)}</p>
  </div>
));
ProductCard.displayName = 'ProductCard';

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onOpenModal: PropTypes.func.isRequired,
};

const Shop = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactDetails, setContactDetails] = useState({ email: '', phone: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formError, setFormError] = useState('');

  usePageFadeIn();
  useFadeInAnimation('.shop-page-wrapper');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    const elementsToObserve = document.querySelectorAll('.shop-page-wrapper .pre-animate');
    elementsToObserve.forEach(element => observer.observe(element));
    return () => {
        elementsToObserve.forEach(element => {
            if(element) observer.unobserve(element);
        });
        observer.disconnect();
    }
  }, [isContentLoaded]);

  useEffect(() => {
    setIsContentLoaded(true);
    const handleScroll = () => setShowScrollToTop(window.scrollY > SCROLL_THRESHOLD_TOP_BTN);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const openModal = useCallback((product) => {
    setSelectedProduct(product);
    setSelectedSize(product.defaultSize || 'M');
    setQuantity(1);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProduct(null);
    setEnlargedImage(null);
  }, []);

  const handleImageClick = useCallback((image) => setEnlargedImage(image), []);
  const closeEnlargedImage = useCallback(() => setEnlargedImage(null), []);

  const addToCart = useCallback(() => {
    if (!selectedProduct) return;
    const cartItem = {
      id: `${selectedProduct.id}-${selectedSize}-${Date.now()}`,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      size: selectedSize,
      quantity: quantity,
      image: selectedProduct.images[0],
      timestamp: new Date().toLocaleString(),
    };
    setCart(prevCart => [...prevCart, cartItem]);
    setIsCartOpen(true);
    closeModal();
  }, [selectedProduct, selectedSize, quantity, closeModal]);

  const removeFromCart = useCallback((itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  }, []);

  const getTotalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const handleContactChange = useCallback((e) => {
    const { name, value } = e.target;
    setContactDetails(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmitOrder = async () => {
    setFormError('');
    if (cart.length === 0) {
      setFormError('Your cart is empty.');
      return;
    }
    if (isSubmitting) return;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!contactDetails.email || !emailRegex.test(contactDetails.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    const phoneRegex = /^(?:\+267|0)?\d{7,8}$/;
    if (!contactDetails.phone || !phoneRegex.test(contactDetails.phone.replace(/\s+/g, ''))) {
        setFormError('Please enter a valid Botswana phone number (e.g., +26771234567 or 71234567).');
        return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        items: safeMap(cart, item => ({
          productId: item.productId, name: item.name, price: item.price,
          size: item.size, quantity: item.quantity,
        })),
        totalAmount: getTotalPrice,
        contact: contactDetails,
        status: 'pending_pre-order',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'pre-orders'), orderData);
      setShowSuccessModal(true);
      setCart([]);
      setIsCartOpen(false);
      setContactDetails({ email: '', phone: '' });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error submitting order:', error);
      }
      setFormError('Failed to place pre-order. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (enlargedImage) closeEnlargedImage();
        else if (selectedProduct) closeModal();
        else if (isCartOpen) setIsCartOpen(false);
        else if (showSuccessModal) setShowSuccessModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enlargedImage, selectedProduct, isCartOpen, showSuccessModal, closeEnlargedImage, closeModal]);

  const memoizedBlobComponents = useMemo(() => safeMap(BLOB_IMAGE_IMPORTS, (blobSrc, index) => (
    <img
      key={`blob-${index}`}
      src={blobSrc}
      alt=""
      className={`shop-blobg blob-${index + 1}`}
      loading="lazy"
      width="600"
      height="600"
      aria-hidden="true"
    />
  )), []);

  return (
    <>
      <SimpleSEO 
        title="Shop with a Purpose"
        description="Support our mission by purchasing items from our shop. Every purchase helps fund our initiatives. Browse our collection of t-shirts and jerseys."
        keywords="shop, merchandise, t-shirts, jerseys, support, donation, able hearts foundation, Botswana"
        type="website"
      />
      <div className={`shop-page-wrapper page-fade-in ${isContentLoaded ? 'content-loaded' : ''}`}>
      <div className="shop-background-blobs" aria-hidden="true">
        {memoizedBlobComponents}
      </div>
      <header className={`shop-header pre-animate`}>
        <h1 className="shop-title-main">Shop with a Purpose</h1>
        <p className="shop-subtitle">
          Support our mission by purchasing items from our shop. Every purchase helps fund our initiatives.
        </p>
      </header>
      <main className={`shop-main-content pre-animate`}>
        <div className="product-grid-shop">
          {safeMap(SHOP_PRODUCTS, (product, index) => (
            <div key={product.id} className="pre-animate-scale" style={{ transitionDelay: `${index * 0.2}s` }}>
              <ProductCard product={product} onOpenModal={openModal} />
            </div>
          ))}
        </div>
      </main>

      {selectedProduct && (
        <div className="modal-overlay-shop" onClick={closeModal} role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
          <div className="modal-content-shop" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button shop-modal-close" onClick={closeModal} aria-label="Close product details">
              <X size={24} />
            </button>
            <div className="modal-product-header">
              <div className="modal-images-container">
                {safeMap(selectedProduct?.images, (imageSrc, index) => (
                  <img
                    key={index}
                    src={imageSrc}
                    alt={`${selectedProduct.name} - view ${index + 1}`}
                    className="modal-product-image-thumbnail zoomable"
                    onClick={() => handleImageClick(imageSrc)}
                    width="100"
                    height="100"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleImageClick(imageSrc)}
                  />
                ))}
              </div>
              <h2 id="product-modal-title" className="modal-product-title">{selectedProduct.name}</h2>
              <p className="modal-product-price">P{selectedProduct.price.toFixed(2)}</p>
              
              <div className="size-selector">
                <p>Select Size:</p>
                <div className="size-buttons-container">
                  {safeMap(SIZES, (size) => (
                    <button
                      key={size}
                      type="button"
                      className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="quantity-selector">
                <p>Quantity:</p>
                <div className="quantity-input-controls">
                  <button type="button" className="quantity-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    className="quantity-input-field"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    aria-label="Current quantity"
                  />
                  <button type="button" className="quantity-btn" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <button type="button" className="cta-button add-to-cart-main" onClick={addToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`mini-cart ${isCartOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <button className="mini-cart-close-btn" onClick={() => setIsCartOpen(false)} aria-label="Close cart"><X size={20} /></button>
        <div className="mini-cart-header">
          <h3 id="cart-title">Your Cart</h3>
        </div>
        
        <div className="mini-cart-items-container">
          {safeLength(cart) === 0 ? (
            <p className="empty-cart-message">Your cart is empty.</p>
          ) : (
            safeMap(cart, (item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>Size: {item.size}, Qty: {item.quantity}</p>
                  <p className="cart-item-price-row">
                    P{(item.price * item.quantity).toFixed(2)}
                    <button className="remove-item-btn" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name} from cart`}>
                      <X size={16} />
                    </button>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {safeLength(cart) > 0 && (
          <>
            <div className="contact-details-form">
              <h4>Contact for Pre-order</h4>
              {formError && <p className="form-error-message">{formError}</p>}
              <div>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={contactDetails.email} onChange={handleContactChange} placeholder="your.email@example.com" required />
              </div>
              <div>
                <label htmlFor="phone">Phone:</label>
                <input type="tel" id="phone" name="phone" value={contactDetails.phone} onChange={handleContactChange} placeholder="+267 71234567" required />
              </div>
            </div>
            <div className="mini-cart-footer">
              <p className="cart-total-price">Total: P{getTotalPrice.toFixed(2)}</p>
              <button type="button" className="cta-button checkout-action" onClick={handleSubmitOrder} disabled={isSubmitting}>
                {isSubmitting ? 'Placing Pre-order...' : 'Place Pre-order'}
              </button>
            </div>
          </>
        )}
      </div>
      
      {!isCartOpen && (
        <button type="button" className="cart-toggle-btn" onClick={() => setIsCartOpen(prev => !prev)} aria-label="Toggle cart visibility" aria-expanded={isCartOpen}>
          <ShoppingCart size={24} />
          {safeLength(cart) > 0 && <span className="cart-item-count">{safeLength(cart)}</span>}
        </button>
      )}

      {enlargedImage && (
        <div className="enlarged-image-overlay" onClick={closeEnlargedImage} role="dialog" aria-modal="true" aria-label="Enlarged product image">
          <img src={enlargedImage} alt="Enlarged product view" className="enlarged-image-content" onClick={(e) => e.stopPropagation()} />
          <button className="modal-close-button enlarged-image-close-btn" onClick={closeEnlargedImage} aria-label="Close enlarged image"><X size={28}/></button>
        </div>
      )}

      {showSuccessModal && (
        <div className="success-modal-overlay" role="alertdialog" aria-modal="true" aria-labelledby="success-modal-title">
          <div className="success-modal-content">
            <h3 id="success-modal-title">Pre-order Placed!</h3>
            <p>Your pre-order has been successfully placed. We will contact you regarding the progress of your Order!</p>
            <button type="button" className="cta-button" onClick={() => setShowSuccessModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showScrollToTop && (
        <button type="button" className="scroll-to-top-btn" onClick={scrollToTop} aria-label="Scroll to top">
          ↑
        </button>
      )}
      </div>
    </>
  );
};

export default memo(Shop);