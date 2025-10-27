import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    
    const timer = setTimeout(() => {
      setToast(null);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    closeToast
  };
};