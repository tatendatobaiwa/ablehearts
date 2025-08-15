import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { safeJSONStorage } from '../utils/safeStorage';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [isDyslexiaModeEnabled, setIsDyslexiaModeEnabled] = useState(() => {
    // Initialize from safe storage or default to false
    return safeJSONStorage.getItem('dyslexiaMode', false);
  });

  const [isScreenReaderModeEnabled, setIsScreenReaderModeEnabled] = useState(() => {
    // Initialize from safe storage or default to false
    return safeJSONStorage.getItem('screenReaderMode', false);
  });

  useEffect(() => {
    safeJSONStorage.setItem('dyslexiaMode', isDyslexiaModeEnabled);
    if (typeof document !== 'undefined' && document.body) {
      if (isDyslexiaModeEnabled) {
        document.body.classList.add('dyslexia-mode');
      } else {
        document.body.classList.remove('dyslexia-mode');
      }
    }
  }, [isDyslexiaModeEnabled]);

  useEffect(() => {
    safeJSONStorage.setItem('screenReaderMode', isScreenReaderModeEnabled);
    if (typeof document !== 'undefined' && document.body) {
      if (isScreenReaderModeEnabled) {
        document.body.classList.add('screen-reader-mode');
        // Potentially announce changes or focus on main content for screen readers
        // For example, you might add an aria-live region to announce the mode change.
      } else {
        document.body.classList.remove('screen-reader-mode');
      }
    }
  }, [isScreenReaderModeEnabled]);

  const toggleDyslexiaMode = () => {
    setIsDyslexiaModeEnabled(prevMode => !prevMode);
  };

  const toggleScreenReaderMode = () => {
    setIsScreenReaderModeEnabled(prevMode => !prevMode);
  };

  return (
    <AccessibilityContext.Provider value={{
      isDyslexiaModeEnabled,
      toggleDyslexiaMode,
      isScreenReaderModeEnabled,
      toggleScreenReaderMode
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

AccessibilityProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

 