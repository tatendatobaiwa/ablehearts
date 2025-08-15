import { useState } from 'react';

/**
 * Custom hook for managing loading states
 * @param {boolean} initialState - Initial loading state
 * @param {number} minLoadingTime - Minimum time to show loading (prevents flashing)
 */
const useLoadingState = (initialState = false, minLoadingTime = 500) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [startTime, setStartTime] = useState(null);

  const startLoading = () => {
    setIsLoading(true);
    setStartTime(Date.now());
  };

  const stopLoading = () => {
    if (startTime) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadingTime - elapsed);
      
      setTimeout(() => {
        setIsLoading(false);
        setStartTime(null);
      }, remaining);
    } else {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    setLoading: setIsLoading
  };
};

export default useLoadingState;