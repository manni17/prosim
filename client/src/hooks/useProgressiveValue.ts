import { useState, useEffect, useRef } from 'react';

export const useProgressiveValue = (targetValue: number, duration: number = 15000, initialValue?: number) => {
  const [currentValue, setCurrentValue] = useState(initialValue !== undefined ? initialValue : targetValue);
  const startValue = useRef(initialValue !== undefined ? initialValue : targetValue);
  const startTime = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // If target differs from current, start animation
    if (targetValue !== currentValue) {
      startValue.current = currentValue;
      startTime.current = null;
      
      const animate = (time: number) => {
        if (startTime.current === null) startTime.current = time;
        const elapsed = time - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        
        // Linear interpolation
        const nextValue = startValue.current + (targetValue - startValue.current) * progress;
        
        setCurrentValue(nextValue);

        if (progress < 1) {
          requestRef.current = requestAnimationFrame(animate);
        }
      };

      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [targetValue, duration]); // Dependency on targetValue triggers the effect

  return currentValue;
};
