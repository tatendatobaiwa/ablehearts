import React from 'react';
import PropTypes from 'prop-types';
import { safeMap } from '../../../utils/safeArrayOperations';

const EventModal = ({
  selectedEvent,
  isEventClosing,
  closeEventModal,
  handleImageClick,
  isPaginatedImages,
  imagePage,
  setImagePage,
  eventModalRef,
}) => {
  if (!selectedEvent) return null;

  const allImages = Array.isArray(selectedEvent?.images) ? selectedEvent.images : [];
  const perPage = isPaginatedImages ? 4 : allImages.length;
  const totalImagePages = Math.max(1, Math.ceil(allImages.length / (perPage || 1)));
  const clampedImgPage = Math.min(Math.max(1, imagePage), totalImagePages);
  const imgStart = (clampedImgPage - 1) * perPage;
  const visibleModalImages = allImages.slice(imgStart, imgStart + perPage);
  const canPaginate = isPaginatedImages && allImages.length > perPage;

  return (
    <div 
      className={`modal-overlay ${isEventClosing ? 'closing' : ''}`} 
      onClick={closeEventModal} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="event-modal-title-text"
      aria-describedby="event-modal-description-text"
    >
      <div className={`modal-content event-modal-content ${isEventClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()} ref={eventModalRef}>
        <button className="modal-close-button" onClick={closeEventModal} aria-label="Close event details">
          ×
        </button>
        <div className="event-modal-header">
          <h2 id="event-modal-title-text" className="event-modal-title-text">{selectedEvent.title}</h2>
          {selectedEvent.date && <p className="event-modal-date-text">{selectedEvent.date}</p>}
          <p id="event-modal-description-text" className="event-modal-description-text">{selectedEvent.description}</p>
        </div>

        <div className="event-images-grid">
          {safeMap(visibleModalImages, (image) => (
            <div
              key={image.id}
              className="event-image-card"
              onClick={() => handleImageClick(image)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleImageClick(image)}
              aria-label={`View image: ${image.caption || 'Event image'}`}
            >
              <img
                src={image.url}
                alt={image.caption || `Image from ${selectedEvent.title}`}
                className="event-image-item"
                width={800}
                height={600}
                loading="lazy"
              />
              {image.caption && (
                <div className="event-image-overlay">
                  <p className="event-image-caption-text">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {canPaginate && (
          <nav className="pagination image-pagination" aria-label="Image pagination">
            <button
              type="button"
              className="page-button"
              onClick={() => setImagePage((p) => Math.max(1, p - 1))}
              disabled={clampedImgPage === 1}
              aria-label="Previous images"
            >
              ‹
            </button>
            <span className="page-info" aria-live="polite">
              Images {imgStart + 1}-{Math.min(imgStart + perPage, allImages.length)} of {allImages.length}
            </span>
            <button
              type="button"
              className="page-button"
              onClick={() => setImagePage((p) => Math.min(totalImagePages, p + 1))}
              disabled={clampedImgPage === totalImagePages}
              aria-label="Next images"
            >
              ›
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

EventModal.propTypes = {
  selectedEvent: PropTypes.object,
  isEventClosing: PropTypes.bool,
  closeEventModal: PropTypes.func.isRequired,
  handleImageClick: PropTypes.func.isRequired,
  isPaginatedImages: PropTypes.bool.isRequired,
  imagePage: PropTypes.number.isRequired,
  setImagePage: PropTypes.func.isRequired,
  eventModalRef: PropTypes.object,
};

export default EventModal;
