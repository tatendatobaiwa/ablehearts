/**
 * Utility functions for automatically scrolling to modals and overlays
 */

/**
 * Scrolls to center a modal element in the viewport
 * @param {string} modalSelector - CSS selector for the modal element
 * @param {number} delay - Delay in milliseconds before scrolling (default: 50)
 * @param {Object} options - Additional options
 * @param {boolean} options.smooth - Whether to use smooth scrolling (default: true)
 * @param {number} options.offset - Additional offset from center (default: 0)
 */
export const scrollToModal = (modalSelector, delay = 50, options = {}) => {
  const { smooth = true, offset = 0 } = options;
  
  setTimeout(() => {
    const modal = document.querySelector(modalSelector);
    if (modal) {
      const modalRect = modal.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll position to center the modal
      const scrollY = window.scrollY + modalRect.top - (viewportHeight / 2) + (modalRect.height / 2) + offset;
      
      // Smooth scroll to center the modal
      window.scrollTo({
        top: Math.max(0, scrollY), // Ensure we don't scroll above the page
        behavior: smooth ? 'smooth' : 'instant'
      });
    }
  }, delay);
};

/**
 * Scrolls to center a modal element using a ref
 * @param {React.RefObject} modalRef - React ref to the modal element
 * @param {number} delay - Delay in milliseconds before scrolling (default: 50)
 * @param {Object} options - Additional options
 * @param {boolean} options.smooth - Whether to use smooth scrolling (default: true)
 * @param {number} options.offset - Additional offset from center (default: 0)
 */
export const scrollToModalRef = (modalRef, delay = 50, options = {}) => {
  const { smooth = true, offset = 0 } = options;
  
  setTimeout(() => {
    const modal = modalRef.current;
    if (modal) {
      const modalRect = modal.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll position to center the modal
      const scrollY = window.scrollY + modalRect.top - (viewportHeight / 2) + (modalRect.height / 2) + offset;
      
      // Smooth scroll to center the modal
      window.scrollTo({
        top: Math.max(0, scrollY), // Ensure we don't scroll above the page
        behavior: smooth ? 'smooth' : 'instant'
      });
    }
  }, delay);
};

/**
 * Hook for automatically scrolling to modals when they open
 * @param {boolean} isOpen - Whether the modal is open
 * @param {string|React.RefObject} modalTarget - CSS selector string or React ref
 * @param {Object} options - Scroll options
 */
export const useModalAutoScroll = (isOpen, modalTarget, options = {}) => {
  // This would need to be imported as a React hook in components that use it
  // React.useEffect(() => {
  //   if (isOpen) {
  //     if (typeof modalTarget === 'string') {
  //       scrollToModal(modalTarget, options.delay, options);
  //     } else if (modalTarget && modalTarget.current) {
  //       scrollToModalRef(modalTarget, options.delay, options);
  //     }
  //   }
  // }, [isOpen, modalTarget, options]);
};