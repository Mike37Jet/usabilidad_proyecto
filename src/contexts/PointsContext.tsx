import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PointsContextType {
  points: number;
  addPoints: (amount: number) => void;
  resetPoints: () => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const PointsProvider = ({ children }: { children: ReactNode }) => {
  const [points, setPoints] = useState(0);

  // Cargar puntos desde localStorage al iniciar
  useEffect(() => {
    const savedPoints = localStorage.getItem('userPoints');
    if (savedPoints) {
      const parsedPoints = parseInt(savedPoints, 10);
      if (!isNaN(parsedPoints)) {
        setPoints(parsedPoints);
      }
    }
  }, []);

  // Guardar puntos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('userPoints', points.toString());
  }, [points]);

  const addPoints = (amount: number) => {
    setPoints(prev => prev + amount);
  };

  const resetPoints = () => {
    setPoints(0);
    localStorage.removeItem('userPoints');
  };

  return (
    <PointsContext.Provider value={{ points, addPoints, resetPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};