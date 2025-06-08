import { useEffect, useCallback, useState } from 'react';
import Header from './components/Header.jsx';
import GameTiles from './components/GameTiles.jsx';
import MustSeeSection from './components/MustSeeSection.jsx';
import GameInfoSection from './components/GameInfoSection.jsx';
import useNavigationStore from './store.js';
import './App.css';

import BackgroundVideo from '/assets/LoopNoParticles.webm';

function App() {
  const { currentSection, currentIndex, lastGameTileIndex, activeGameTileIndex, setNavigation } = useNavigationStore();
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getGames().then((loadedGames) => {
        setGames(loadedGames);
      }).catch((err) => {
        console.error('Error fetching games:', err);
      });

      window.electronAPI.onGamesUpdated((updatedGames) => {
        setGames(updatedGames);
      });
    } else {
      console.error('electronAPI not available');
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    let newSection = currentSection;
    let newIndex = currentIndex;
    let newActiveGameTileIndex = activeGameTileIndex;

    if (e.key === 'ArrowRight') {
      if (currentSection === 'header' && currentIndex < 4) newIndex++;
      if (currentSection === 'game-tiles' && currentIndex < 2 + games.length) {
        newIndex++;
        newActiveGameTileIndex = newIndex;
      }
      if (currentSection === 'must-see-tiles' && currentIndex < 5) newIndex++;
      if (currentSection === 'play-button') {
        newSection = 'game-tiles';
        newIndex = activeGameTileIndex;
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentIndex > 0) {
        newIndex--;
        if (currentSection === 'game-tiles') newActiveGameTileIndex = newIndex;
      }
      if (currentSection === 'play-button') {
        newSection = 'game-tiles';
        newIndex = activeGameTileIndex;
      }
    } else if (e.key === 'ArrowDown') {
      if (currentSection === 'header') {
        newSection = 'game-tiles';
        newIndex = lastGameTileIndex;
        newActiveGameTileIndex = lastGameTileIndex;
      } else if (currentSection === 'game-tiles') {
        if (currentIndex === 0 || currentIndex === 1) {
          newSection = 'must-see-tiles';
          newIndex = 0;
        } else if (currentIndex >= 2 && currentIndex < 2 + games.length) {
          newSection = 'play-button';
          newIndex = 0;
        }
      }
    } else if (e.key === 'ArrowUp') {
      if (currentSection === 'must-see-tiles') {
        newSection = 'game-tiles';
        newIndex = activeGameTileIndex;
      } else if (currentSection === 'game-tiles') {
        newSection = 'header';
        newIndex = 0;
        newActiveGameTileIndex = 0;
      } else if (currentSection === 'play-button') {
        newSection = 'game-tiles';
        newIndex = activeGameTileIndex;
      }
    } else if (e.key === 'Enter' && currentSection === 'play-button') {
      const currentGame = games[activeGameTileIndex - 2];
      if (currentGame && currentGame.executable && window.electronAPI) {
        window.electronAPI.launchGame(currentGame.executable);
      }
    }

    if (newSection !== currentSection || newIndex !== currentIndex || newActiveGameTileIndex !== activeGameTileIndex) {
      setNavigation(newSection, newIndex, newActiveGameTileIndex);
    }
  }, [currentSection, currentIndex, lastGameTileIndex, activeGameTileIndex, setNavigation, games]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const showMustSee = activeGameTileIndex === 0 || activeGameTileIndex === 1;
  const isPlayButtonActive = currentSection === 'play-button';

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
        <div className={`main-header ${isPlayButtonActive ? 'hidden' : ''}`}>
          <Header
            currentSection={currentSection}
            currentIndex={currentIndex}
            setNavigation={setNavigation}
          />
        </div>
        <div className={`game-tiles-wrapper ${isPlayButtonActive ? 'hidden' : ''}`}>
          <GameTiles
            currentSection={currentSection}
            currentIndex={currentIndex}
            activeGameTileIndex={activeGameTileIndex}
            setNavigation={setNavigation}
            lastGameTileOffset={useNavigationStore((state) => state.lastGameTileOffset)}
            games={games}
          />
        </div>
        {showMustSee && !isPlayButtonActive && (
          <MustSeeSection
            currentSection={currentSection}
            currentIndex={currentIndex}
            setNavigation={setNavigation}
          />
        )}
        {activeGameTileIndex >= 2 && activeGameTileIndex < 2 + games.length && (
          <GameInfoSection
            currentIndex={activeGameTileIndex}
            isPlayButtonActive={isPlayButtonActive}
            games={games}
          />
        )}
      </div>
    </div>
  );
}

export default App;
