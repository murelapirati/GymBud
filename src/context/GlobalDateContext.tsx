import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getTodayDate } from '../utils/date';

interface GlobalDateContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const GlobalDateContext = createContext<GlobalDateContextType | undefined>(undefined);

export function GlobalDateProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());

  return (
    <GlobalDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </GlobalDateContext.Provider>
  );
}

export function useGlobalDate() {
  const context = useContext(GlobalDateContext);
  if (context === undefined) {
    throw new Error('useGlobalDate must be used within a GlobalDateProvider');
  }
  return context;
}
