import React, { createContext, useContext, useState, useEffect } from 'react';

const NotesContext = createContext(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error('useNotes must be used within NotesProvider');
  return context;
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studentNotes') || '{}'); }
    catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('studentNotes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (studentId, text) => {
    const note = { id: Date.now(), text, createdAt: new Date().toISOString() };
    setNotes(prev => ({ ...prev, [studentId]: [...(prev[studentId] || []), note] }));
  };

  const deleteNote = (studentId, noteId) => {
    setNotes(prev => ({
      ...prev,
      [studentId]: (prev[studentId] || []).filter(n => n.id !== noteId),
    }));
  };

  const getNotesForStudent = (studentId) => notes[studentId] || [];

  return (
    <NotesContext.Provider value={{ addNote, deleteNote, getNotesForStudent }}>
      {children}
    </NotesContext.Provider>
  );
};
