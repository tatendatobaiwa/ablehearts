import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { safeMap, isValidArray } from '../../utils/safeArrayOperations';
import './Gallery.css';
import { useFadeInAnimation, usePageFadeIn } from '../../hooks/useFadeInAnimation';
import SimpleSEO from '../../components/SEO/SimpleSEO';
import { galleryEventsData, blobImagePaths } from './galleryData';
const SCROLL_THRESHOLD_TOP_BTN = 300;


const MemoizedImage = memo(({ src, alt, className, onClick, width, height, loading = "lazy" }) => (
  <img
    src={src}
    alt={alt}
    className={className}
    onClick={onClick}
    loading={loading}
    width={width}
    height={height}
  />
));
MemoizedImage.displayName = 'MemoizedImage';

MemoizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.string,
};

const Gallery = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const eventModalRef = useRef(null);
  const imageModalRef = useRef(null);
  const prevFocusBeforeEventRef = useRef(null);
  const prevFocusBeforeImageRef = useRef(null);

  // Show 3 events per page on smaller screens, 6 on screens larger than 1200px
  const [pageSize, setPageSize] = useState(window.innerWidth > 1200 ? 6 : 3);
  
  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth > 1200 ? 6 : 3);
      setCurrentPage(1); // Reset to first page when page size changes
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  usePageFadeIn();
  useFadeInAnimation('.gallery-page-wrapper');

  useEffect(() => {
    setIsContentLoaded(true);

    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
      scrollTimeout = window.requestAnimationFrame(() => {
        setShowScrollToTop(window.scrollY > SCROLL_THRESHOLD_TOP_BTN);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEventClick = useCallback((event) => {
    prevFocusBeforeEventRef.current = document.activeElement;
    setSelectedEvent(event);
    setSelectedImage(null);
  }, []);

  const handleImageClick = useCallback((image) => {
    prevFocusBeforeImageRef.current = document.activeElement;
    setSelectedImage(image);
    if (selectedEvent && Array.isArray(selectedEvent.images)) {
      const idx = selectedEvent.images.findIndex((img) => img.id === image.id);
      setSelectedImageIndex(idx >= 0 ? idx : 0);
    } else {
      setSelectedImageIndex(0);
    }
  }, [selectedEvent]);

  const closeEventModal = useCallback(() => {
    setSelectedEvent(null);
    // restore focus
    const el = prevFocusBeforeEventRef.current;
    if (el && typeof el.focus === 'function') {
      setTimeout(() => el.focus(), 0);
    }
  }, []);

  const closeImageModal = useCallback(() => {
    setSelectedImage(null);
    // restore focus
    const el = prevFocusBeforeImageRef.current;
    if (el && typeof el.focus === 'function') {
      setTimeout(() => el.focus(), 0);
    }
  }, []);

  const nextImage = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!selectedEvent || !Array.isArray(selectedEvent.images) || selectedEvent.images.length === 0) return;
    const next = ((selectedImageIndex ?? 0) + 1) % selectedEvent.images.length;
    setSelectedImageIndex(next);
    setSelectedImage(selectedEvent.images[next]);
  }, [selectedEvent, selectedImageIndex]);

  const prevImage = useCallback((e) => {
    if (e) e.stopPropagation();
    if (!selectedEvent || !Array.isArray(selectedEvent.images) || selectedEvent.images.length === 0) return;
    const prev = ((selectedImageIndex ?? 0) - 1 + selectedEvent.images.length) % selectedEvent.images.length;
    setSelectedImageIndex(prev);
    setSelectedImage(selectedEvent.images[prev]);
  }, [selectedEvent, selectedImageIndex]);

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

    const elementsToObserve = document.querySelectorAll('.gallery-page-wrapper .pre-animate');
    elementsToObserve.forEach(element => observer.observe(element));

    return () => {
        elementsToObserve.forEach(element => {
            if(element) observer.unobserve(element);
        });
        observer.disconnect();
    }
  }, [isContentLoaded]); // Rerun observer setup if contentLoaded changes, to catch initially hidden elements

  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (selectedImage) {
          closeImageModal();
        } else if (selectedEvent) {
          closeEventModal();
        }
      } else if (selectedImage && selectedEvent && Array.isArray(selectedEvent.images)) {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          const next = (selectedImageIndex + 1) % selectedEvent.images.length;
          setSelectedImageIndex(next);
          setSelectedImage(selectedEvent.images[next]);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          const prev = (selectedImageIndex - 1 + selectedEvent.images.length) % selectedEvent.images.length;
          setSelectedImageIndex(prev);
          setSelectedImage(selectedEvent.images[prev]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, selectedEvent, selectedImageIndex, closeImageModal, closeEventModal]);

  // Focus trap for event modal
  useEffect(() => {
    if (!selectedEvent) return;
    const modalEl = eventModalRef.current;
    if (!modalEl) return;
    const focusable = modalEl.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first && first.focus();
    const onKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last && last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first && first.focus();
        }
      }
    };
    modalEl.addEventListener('keydown', onKeyDown);
    return () => modalEl.removeEventListener('keydown', onKeyDown);
  }, [selectedEvent]);

  // Focus trap for image modal
  useEffect(() => {
    if (!selectedImage) return;
    const modalEl = imageModalRef.current;
    if (!modalEl) return;
    const focusable = modalEl.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first && first.focus();
    const onKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last && last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first && first.focus();
        }
      }
    };
    modalEl.addEventListener('keydown', onKeyDown);
    return () => modalEl.removeEventListener('keydown', onKeyDown);
  }, [selectedImage]);

  const memoizedBlobComponents = useMemo(() => safeMap(blobImagePaths, (blobSrc, index) => (
    <MemoizedImage
      key={`blob-${index}`}
      src={blobSrc}
      alt=""
      className={`gallery-blobg blob-${index + 1}`}
      width="600"
      height="600"
      aria-hidden="true"
    />
  )), []);

  // Allow background scroll even when modals are open (requested UX)
  // Removed previous overflow locking to avoid affecting image viewing

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(galleryEventsData.length / pageSize));
  const clampedPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (clampedPage - 1) * pageSize;
  const visibleEvents = galleryEventsData.slice(startIndex, startIndex + pageSize);

  const goToPage = useCallback((p) => {
    setIsTransitioning(true);
    setCurrentPage(prev => {
      const next = Math.min(Math.max(1, typeof p === 'number' ? p : prev), totalPages);
      return next;
    });
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(clampedPage + 1), [goToPage, clampedPage]);
  const prevPage = useCallback(() => goToPage(clampedPage - 1), [goToPage, clampedPage]);

  return (
    <>
      <SimpleSEO 
        title="Event Gallery"
        description="Explore our events and the moments that make them special. View photos from our community initiatives, talent shows, donations, and impact programs across Botswana."
        keywords="gallery, events, photos, community initiatives, talent show, donations, Botswana, able hearts foundation"
      />
      <div className={`gallery-page-wrapper page-fade-in ${isContentLoaded ? 'content-loaded' : ''}`}>
      <div className="gallery-background-blobs" aria-hidden={Boolean(selectedEvent || selectedImage)}>
        {memoizedBlobComponents}
      </div>

      <header className={`gallery-header pre-animate`} aria-hidden={Boolean(selectedEvent || selectedImage)}>
        <h1>Event Gallery</h1>
        <p>Explore our events and the moments that make them special.</p>
      </header>

      <main className={`gallery-main-content pre-animate`} aria-hidden={Boolean(selectedEvent || selectedImage)}>
        <div className={`events-grid ${isTransitioning ? 'loading' : ''}`}>
          {safeMap(visibleEvents, (event, index) => (
            <div
              key={event.id}
              className={`event-card pre-animate-scale`}
              style={{ transitionDelay: `${index * 0.1}s` }}
              onClick={() => handleEventClick(event)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleEventClick(event)}
              aria-label={`View details for ${event.title}`}
            >
              <MemoizedImage
                src={event.coverImage}
                alt={`Cover image for ${event.title}`}
                className="event-cover-image"
                width={400} 
                height={300}
                sizes="(max-width: 480px) 100vw, (max-width: 992px) 50vw, 400px"
              />
              <div className="event-card-overlay">
                <h3 className="event-card-title">{event.title}</h3>
                {event.date && <p className="event-card-date">{event.date}</p>}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="pagination" aria-label="Event gallery pagination">
            <button
              type="button"
              className="page-button"
              onClick={prevPage}
              disabled={clampedPage === 1}
              aria-label="Previous page"
            >
              ‹
            </button>
            <span className="page-info" aria-live="polite">
              Page {clampedPage} of {totalPages}
            </span>
            <button
              type="button"
              className="page-button"
              onClick={nextPage}
              disabled={clampedPage === totalPages}
              aria-label="Next page"
            >
              ›
            </button>
          </nav>
        )}
      </main>

      {selectedEvent && (
        <div 
          className="modal-overlay" 
          onClick={closeEventModal} 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="event-modal-title-text"
          aria-describedby="event-modal-description-text"
        >
          <div className="modal-content event-modal-content" onClick={(e) => e.stopPropagation()} ref={eventModalRef}>
            <button className="modal-close-button" onClick={closeEventModal} aria-label="Close event details">
              ×
            </button>
            <div className="event-modal-header">
              <h2 id="event-modal-title-text" className="event-modal-title-text">{selectedEvent.title}</h2>
              {selectedEvent.date && <p className="event-modal-date-text">{selectedEvent.date}</p>}
              <p id="event-modal-description-text" className="event-modal-description-text">{selectedEvent.description}</p>
            </div>
            <div className="event-images-grid">
              {safeMap(selectedEvent?.images, (image) => (
                <div
                  key={image.id}
                  className="event-image-card"
                  onClick={() => handleImageClick(image)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleImageClick(image)}
                  aria-label={`View image: ${image.caption || 'Event image'}`}
                >
                  <div className="event-image-wrapper">
                    <MemoizedImage
                      src={image.url}
                      alt={image.caption || `Image from ${selectedEvent.title}`}
                      className="event-image-item"
                      width={800}
                      height={600}
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  {image.caption && (
                    <div className="event-image-overlay">
                      <p className="event-image-caption-text">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div 
          className="modal-overlay image-modal-overlay" 
          onClick={closeImageModal} 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="image-modal-caption-text"
        >
          <div className="modal-content image-modal-content" onClick={(e) => e.stopPropagation()} ref={imageModalRef}>
            <button className="modal-close-button image-modal-close-button" onClick={closeImageModal} aria-label="Close image viewer">
              ×
            </button>
            <button className="image-nav-button prev" onClick={prevImage} aria-label="Previous image">‹</button>
            <button className="image-nav-button next" onClick={nextImage} aria-label="Next image">›</button>
            <MemoizedImage
              src={selectedImage.url}
              alt={selectedImage.caption || 'Enlarged gallery image'}
              className="enlarged-modal-image"
              width={selectedImage.width}
              height={selectedImage.height}
              loading="eager"
            />
            <div className="image-modal-meta" aria-live="polite">
              {selectedEvent && Array.isArray(selectedEvent.images) && (
                <span className="image-index">
                  {(selectedImageIndex ?? 0) + 1} / {selectedEvent.images.length}
                </span>
              )}
              {selectedImage.caption && <p id="image-modal-caption-text" className="enlarged-modal-caption-text">{selectedImage.caption}</p>}
            </div>
          </div>
        </div>
      )}

      {showScrollToTop && (
        <button type="button" className="scroll-to-top-btn-gallery" onClick={scrollToTop} aria-label="Scroll to top">
          ↑
        </button>
      )}
      </div>
    </>
  );
};

export default memo(Gallery);
