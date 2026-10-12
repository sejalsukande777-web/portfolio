import React, { createContext, useContext, useState, useCallback } from "react";

// Maps each scene to how far into the "day" it represents.
// Progress is based on the FURTHEST scene visited, not visit order —
// jumping straight to Contact via nav should still show night.
const SCENE_STAGE = {
  home: 0, // Morning
  about: 1, // Late Morning
  education: 1, // Late Morning
  skills: 2, // Afternoon
  projects: 3, // Sunset
  experience: 4, // Dusk
  contact: 5, // Night
};

const DayNightContext = createContext(null);

export function DayNightProvider({ children }) {
  const [maxStageReached, setMaxStageReached] = useState(0);

  const markVisited = useCallback((sceneId) => {
    const stage = SCENE_STAGE[sceneId] ?? 0;
    setMaxStageReached((prev) => Math.max(prev, stage));
  }, []);

  return (
    <DayNightContext.Provider value={{ stageIndex: maxStageReached, markVisited }}>
      {children}
    </DayNightContext.Provider>
  );
}

export function useDayNight() {
  const ctx = useContext(DayNightContext);
  if (!ctx) {
    throw new Error("useDayNight must be used inside a DayNightProvider");
  }
  return ctx;
}
