import { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAccessibility } from '../hooks/useAccessibility';

/**
 * Accessibility Enhancer Component
 * Provides comprehensive accessibility features and improvements
 */
const AccessibilityEnhancer = memo(({ children }) => {
  const { 
    isDyslexiaModeEnabled, 
    isScreenReaderModeEnabled,
    toggleDyslexiaMode,
    toggleScreenReaderMode 
  } = useAccessibility();

  const [isVisible, setIsVisible] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  // Keyboard navigation enhancement
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Show accessibility panel with Alt + A
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        setIsVisible(prev => !prev);
      }

      // Skip to main content with Alt + M
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        const main = document.querySelector('main, [role="main"]');
        if (main) {
          main.focus();
          main.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Toggle dyslexia mode with Alt + D
      if (event.altKey && event.key === 'd') {
        event.preventDefault();
        toggleDyslexiaMode();
      }

      // Toggle screen reader mode with Alt + S
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        toggleScreenReaderMode();
      }

      // Show focus indicators when using keyboard
      if (event.key === 'Tab') {
        setFocusVisible(true);
      }
    };

    const handleMouseDown = () => {
      setFocusVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [toggleDyslexiaMode, toggleScreenReaderMode]);

  // Enhanced focus management
  useEffect(() => {
    if (focusVisible) {
      document.body.classList.add('focus-visible');
    } else {
      document.body.classList.remove('focus-visible');
    }
  }, [focusVisible]);

  // ARIA live region for announcements
  const [announcement, setAnnouncement] = useState('');

  const announce = useCallback((message) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 1000);
  }, []);

  // Announce mode changes
  useEffect(() => {
    if (isDyslexiaModeEnabled) {
      announce('Dyslexia-friendly mode enabled');
    } else {
      announce('Dyslexia-friendly mode disabled');
    }
  }, [isDyslexiaModeEnabled, announce]);

  useEffect(() => {
    if (isScreenReaderModeEnabled) {
      announce('Screen reader optimized mode enabled');
    } else {
      announce('Screen reader optimized mode disabled');
    }
  }, [isScreenReaderModeEnabled, announce]);

  // Color contrast enhancement
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast);
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [highContrast, fontSize]);

  // Skip links
  const skipLinks = [
    { href: '#main-content', text: 'Skip to main content' },
    { href: '#navigation', text: 'Skip to navigation' },
    { href: '#footer', text: 'Skip to footer' }
  ];

  return (
    <>
      {/* Skip Links */}
      <div className="skip-links" aria-label="Skip links">
        {skipLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="skip-link"
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector(link.href);
              if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {link.text}
          </a>
        ))}
      </div>

      {/* Accessibility Panel */}
      <div 
        className={`accessibility-panel ${isVisible ? 'visible' : ''}`}
        role="dialog"
        aria-label="Accessibility Options"
        aria-hidden={!isVisible}
      >
        <div className="accessibility-panel-header">
          <h2>Accessibility Options</h2>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Close accessibility panel"
            className="close-button"
          >
            ×
          </button>
        </div>

        <div className="accessibility-controls">
          {/* Vision Assistance */}
          <fieldset>
            <legend>Vision Assistance</legend>
            
            <label className="accessibility-option">
              <input
                type="checkbox"
                checked={isDyslexiaModeEnabled}
                onChange={toggleDyslexiaMode}
                aria-describedby="dyslexia-help"
              />
              <span>Dyslexia-friendly font</span>
              <small id="dyslexia-help">Uses OpenDyslexic font for easier reading</small>
            </label>

            <label className="accessibility-option">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                aria-describedby="contrast-help"
              />
              <span>High contrast mode</span>
              <small id="contrast-help">Increases color contrast for better visibility</small>
            </label>

            <label className="accessibility-option">
              <span>Font size: {fontSize}%</span>
              <input
                type="range"
                min="75"
                max="150"
                step="25"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                aria-describedby="font-size-help"
              />
              <small id="font-size-help">Adjust text size for comfortable reading</small>
            </label>
          </fieldset>

          {/* Screen Reader */}
          <fieldset>
            <legend>Screen Reader Optimization</legend>
            
            <label className="accessibility-option">
              <input
                type="checkbox"
                checked={isScreenReaderModeEnabled}
                onChange={toggleScreenReaderMode}
                aria-describedby="screen-reader-help"
              />
              <span>Screen reader mode</span>
              <small id="screen-reader-help">Optimizes layout for screen readers</small>
            </label>
          </fieldset>

          {/* Keyboard Shortcuts */}
          <fieldset>
            <legend>Keyboard Shortcuts</legend>
            <div className="keyboard-shortcuts">
              <div><kbd>Alt + A</kbd> - Toggle this panel</div>
              <div><kbd>Alt + M</kbd> - Skip to main content</div>
              <div><kbd>Alt + D</kbd> - Toggle dyslexia mode</div>
              <div><kbd>Alt + S</kbd> - Toggle screen reader mode</div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* Accessibility Toggle Button */}
      <button
        className="accessibility-toggle"
        onClick={() => setIsVisible(true)}
        aria-label="Open accessibility options"
        title="Accessibility Options (Alt + A)"
      >
        <span aria-hidden="true">♿</span>
      </button>

      {/* ARIA Live Region for Announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>

      {/* Main Content */}
      <div id="main-content">
        {children}
      </div>

      <style>{`
        .skip-links {
          position: absolute;
          top: -100px;
          left: 0;
          z-index: 10000;
        }

        .skip-link {
          position: absolute;
          top: 0;
          left: 0;
          background: #005BB5;
          color: white;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 0 0 4px 0;
          font-weight: bold;
          transition: top 0.3s;
        }

        .skip-link:focus {
          top: 100px;
        }

        .accessibility-panel {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 320px;
          max-height: 80vh;
          background: white;
          border: 2px solid #005BB5;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 9999;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          overflow-y: auto;
        }

        .accessibility-panel.visible {
          transform: translateX(0);
        }

        .accessibility-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #eee;
          background: #f8f9fa;
        }

        .accessibility-panel-header h2 {
          margin: 0;
          font-size: 1.2rem;
          color: #005BB5;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .close-button:hover {
          background: #e9ecef;
        }

        .accessibility-controls {
          padding: 16px;
        }

        .accessibility-controls fieldset {
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 16px;
          padding: 12px;
        }

        .accessibility-controls legend {
          font-weight: bold;
          color: #005BB5;
          padding: 0 8px;
        }

        .accessibility-option {
          display: block;
          margin-bottom: 12px;
          cursor: pointer;
        }

        .accessibility-option input {
          margin-right: 8px;
        }

        .accessibility-option small {
          display: block;
          color: #666;
          font-size: 0.85rem;
          margin-top: 4px;
          margin-left: 24px;
        }

        .keyboard-shortcuts {
          font-size: 0.9rem;
        }

        .keyboard-shortcuts div {
          margin-bottom: 4px;
        }

        .keyboard-shortcuts kbd {
          background: #f1f3f4;
          border: 1px solid #dadce0;
          border-radius: 3px;
          padding: 2px 6px;
          font-family: monospace;
          font-size: 0.8rem;
        }

        .accessibility-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #005BB5;
          color: white;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          z-index: 9998;
          transition: transform 0.2s;
        }

        .accessibility-toggle:hover {
          transform: scale(1.1);
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Focus visible styles */
        .focus-visible :focus {
          outline: 3px solid #005BB5 !important;
          outline-offset: 2px !important;
        }

        /* High contrast mode */
        .high-contrast {
          filter: contrast(150%) brightness(110%);
        }

        .high-contrast * {
          text-shadow: none !important;
          box-shadow: none !important;
        }

        @media (max-width: 768px) {
          .accessibility-panel {
            width: calc(100vw - 40px);
            right: 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .accessibility-panel,
          .accessibility-toggle,
          .skip-link {
            transition: none;
          }
        }
      `}</style>
    </>
  );
});

AccessibilityEnhancer.displayName = 'AccessibilityEnhancer';

AccessibilityEnhancer.propTypes = {
  children: PropTypes.node.isRequired
};

export default AccessibilityEnhancer;