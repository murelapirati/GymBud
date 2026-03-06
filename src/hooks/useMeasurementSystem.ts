import { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import type { MeasurementSystem } from '../utils/measurements';

/**
 * Hook to access and use the measurement system preference
 */
export const useMeasurementSystem = () => {
  const [measurementSystem, setMeasurementSystem] = useState<MeasurementSystem>('imperial');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadMeasurementSystem();
  }, []);

  const loadMeasurementSystem = async () => {
    try {
      const system = await storage.getItem<MeasurementSystem>(STORAGE_KEYS.MEASUREMENT_SYSTEM);
      if (system) {
        setMeasurementSystem(system);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading measurement system:', error);
      setIsLoaded(true);
    }
  };

  return { measurementSystem, isLoaded };
};
