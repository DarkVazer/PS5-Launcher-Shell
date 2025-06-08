import { useEffect, useCallback } from 'react';
import Header from './components/Header.jsx';
import GameTiles from './components/GameTiles.jsx';
import MustSeeSection from './components/MustSeeSection.jsx';
import useNavigationStore from './store.js';
import './App.css';

// Import the video asset statically
import BackgroundVideo from '/assets/LoopNoParticles.webm';

function App() {
  const { currentSection, currentIndex, lastGameTileIndex, setNavigation } = useNavigationStore();

  const handleKeyDown = useCallback((e) => {
    let newSection = currentSection;
    let newIndex = currentIndex;

    if (e.key === 'ArrowRight') {
      if (currentSection === 'header' && currentIndex < 4) newIndex++;
      if (currentSection === 'game-tiles' && currentIndex < 10) newIndex++;
      if (currentSection === 'must-see-tiles' && currentIndex < 5) newIndex++;
    } else if (e.key === 'ArrowLeft') {
      if (currentIndex > 0) newIndex--;
    } else if (e.key === 'ArrowDown') {
      if (currentSection === 'header') {
        newSection = 'game-tiles';
        newIndex = lastGameTileIndex;
      } else if (currentSection === 'game-tiles') {
        newSection = 'must-see-tiles';
        newIndex = 0;
      }
    } else if (e.key === 'ArrowUp') {
      if (currentSection === 'must-see-tiles') {
        newSection = 'game-tiles';
        newIndex = lastGameTileIndex;
      } else if (currentSection === 'game-tiles') {
        newSection = 'header';
        newIndex = 0;
      }
    }

    if (newSection !== currentSection || newIndex !== currentIndex) {
      setNavigation(newSection, newIndex);
    }
  }, [currentSection, currentIndex, lastGameTileIndex, setNavigation]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="app-root">
      <div className="video-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="video-background"
        >
          <source src={BackgroundVideo} type="video/webm" />
        </video>
      </div>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="borderGradient">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="30%" stopColor="rgba(255, 255, 255, 0.7)" />
            <stop offset="70%" stopColor="rgba(255, 255, 255, 0.7)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.9)" />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 0.5 0.5"
              to="360 0.5 0.5"
              dur="2s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
      </svg>
      <div className="app-content">
        <Header
          currentSection={currentSection}
          currentIndex={currentIndex}
          setNavigation={setNavigation}
        />
        <GameTiles
          currentSection={currentSection}
          currentIndex={currentIndex}
          setNavigation={setNavigation}
          lastGameTileOffset={useNavigationStore((state) => state.lastGameTileOffset)}
        />
        <MustSeeSection
          currentSection={currentSection}
          currentIndex={currentIndex}
          setNavigation={setNavigation}
        />
      </div>
    </div>
  );
}

export default App;
