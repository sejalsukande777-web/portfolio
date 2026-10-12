import React, { useState } from "react";
import PixelWorld from "./scenes/HomeScene/HomeScene.jsx";
import Navigation from "./components/Navigation/Navigation.jsx";
import ProjectsScene from "./scenes/ProjectsScene/ProjectsScene.jsx";
import AboutScene from "./scenes/AboutScene/AboutScene.jsx";
import SkillsScene from "./scenes/SkillsScene/SkillsScene.jsx";
import ExperienceScene from "./scenes/ExperienceScene/ExperienceScene.jsx";
import EducationScene from "./scenes/EducationScene/EducationScene.jsx";
import ContactScene from "./scenes/ContactScene/ContactScene.jsx";
import { DayNightProvider, useDayNight } from "./context/DayNightContext.jsx";

const SCENES = {
  home: PixelWorld,
  about: AboutScene,
  skills: SkillsScene,
  projects: ProjectsScene,
  experience: ExperienceScene,
  education: EducationScene,
  contact: ContactScene,
};

function AppInner() {
  const [activeScene, setActiveScene] = useState("home");
  const { markVisited } = useDayNight();
  const ActiveComponent = SCENES[activeScene] || PixelWorld;

  const handleNavigate = (sceneId) => {
    setActiveScene(sceneId);
    markVisited(sceneId);
  };

  return (
    <div className="app-shell app-shell-column">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navigation activeScene={activeScene} onNavigate={handleNavigate} />
      <main id="main-content">
        <ActiveComponent />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <DayNightProvider>
      <AppInner />
    </DayNightProvider>
  );
}
