import React, { createContext, useContext, useState, useEffect } from 'react';

interface CategoryPoints {
  grammar: number;
  listening: number;
  reading: number;
}

interface PointsContextType {
  points: number;
  categoryPoints: CategoryPoints;
  addPoints: (amount: number) => void;
  addCategoryPoints: (category: 'grammar' | 'listening' | 'reading', amount: number) => void;
  resetPoints: () => void;
  getSessionPoints: (category: 'grammar' | 'listening' | 'reading') => number;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const PointsProvider = ({ children }: { children: any }) => {
  const [points, setPoints] = useState(0);
  const [categoryPoints, setCategoryPoints] = useState({
    grammar: 0,
    listening: 0,
    reading: 0
  });

  // Cargar puntos desde localStorage al iniciar
  useEffect(() => {
    const savedPoints = localStorage.getItem('userPoints');
    const savedCategoryPoints = localStorage.getItem('categoryPoints');
    
    if (savedPoints) {
      const parsedPoints = parseInt(savedPoints, 10);
      if (!isNaN(parsedPoints)) {
        setPoints(parsedPoints);
      }
    }

    if (savedCategoryPoints) {
      try {
        const parsedCategoryPoints = JSON.parse(savedCategoryPoints);
        setCategoryPoints(parsedCategoryPoints);
      } catch (error) {
        console.error('Error parsing category points:', error);
      }
    }
  }, []);

  // Guardar puntos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('userPoints', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('categoryPoints', JSON.stringify(categoryPoints));
  }, [categoryPoints]);

  const addPoints = (amount: number) => {
    setPoints(prev => prev + amount);
  };

  const addCategoryPoints = (category: 'grammar' | 'listening' | 'reading', amount: number) => {
    setCategoryPoints(prev => {
      const newAmount = Math.max(prev[category], amount); // Solo conservar el máximo histórico
      const updatedPoints = { ...prev, [category]: newAmount };
      const totalPoints = (updatedPoints.grammar + updatedPoints.listening + updatedPoints.reading);
      setPoints(totalPoints);
      return updatedPoints;
    });
  };

  const resetPoints = () => {
    setPoints(0);
    setCategoryPoints({ grammar: 0, listening: 0, reading: 0 });
    localStorage.removeItem('userPoints');
    localStorage.removeItem('categoryPoints');
  };

  const getSessionPoints = (category: 'grammar' | 'listening' | 'reading') => {
    const sessionKey = `${category}SessionPoints`;
    const sessionPoints = localStorage.getItem(sessionKey);
    return sessionPoints ? parseInt(sessionPoints, 10) : 0;
  };

  return (
    <PointsContext.Provider value={{ points, categoryPoints, addPoints, addCategoryPoints, resetPoints, getSessionPoints }}>
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