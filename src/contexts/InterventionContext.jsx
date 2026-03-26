import React, { createContext, useContext, useState, useEffect } from 'react';

const InterventionContext = createContext(undefined);

export const useInterventions = () => {
  const context = useContext(InterventionContext);
  if (!context) throw new Error('useInterventions must be used within InterventionProvider');
  return context;
};

export const InterventionProvider = ({ children }) => {
  const [interventions, setInterventions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('interventions') || '{}'); }
    catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('interventions', JSON.stringify(interventions));
  }, [interventions]);

  const addIntervention = (studentId, data) => {
    const entry = {
      id: Date.now(),
      ...data,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setInterventions(prev => ({
      ...prev,
      [studentId]: [...(prev[studentId] || []), entry],
    }));
  };

  const resolveIntervention = (studentId, id) => {
    setInterventions(prev => ({
      ...prev,
      [studentId]: (prev[studentId] || []).map(i =>
        i.id === id ? { ...i, status: 'resolved', resolvedAt: new Date().toISOString() } : i
      ),
    }));
  };

  const getForStudent = (studentId) => interventions[studentId] || [];

  const getAllOpen = () =>
    Object.entries(interventions).flatMap(([sid, list]) =>
      list.filter(i => i.status === 'open').map(i => ({ ...i, studentId: sid }))
    );

  return (
    <InterventionContext.Provider value={{ addIntervention, resolveIntervention, getForStudent, getAllOpen }}>
      {children}
    </InterventionContext.Provider>
  );
};
