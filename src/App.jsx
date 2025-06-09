import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Header from './components/Header.jsx';
import GameTiles from './components/GameTiles.jsx';
import MustSeeSection from './components/MustSeeSection.jsx';
import GameInfoSection from './components/GameInfoSection.jsx';
import IntroVideo from './components/IntroVideo.jsx';
import MoreGamesSection from './components/MoreGamesSection.jsx';
import useNavigationStore from './store.js';
import useGamepad from './hooks/useGamepad.js';
import './App.css';

import BackgroundVideo from '/assets/LoopNoParticles.webm';

// Memoized components for better performance
const MemoizedHeader = memo(Header);
const MemoizedGameTiles = memo(GameTiles);
const MemoizedMustSeeSection = memo(MustSeeSection);
const MemoizedGameInfoSection = memo(GameInfoSection);
const MemoizedMoreGamesSection = memo(MoreGamesSection);

function App() {
  const { currentSection, currentIndex, lastGameTileIndex, activeGameTileIndex, setNavigation, showMoreGames, moreGamesIndex, setMoreGames } = useNavigationStore();
  const lastGameTileOffset = useNavigationStore((state) => state.lastGameTileOffset);
  const [games, setGames] = useState([]);
  const [showIntro, setShowIntro] = useState(() => {
    // Check if intro should be skipped (for development or user preference)
    const skipIntro = localStorage.getItem('skipIntro') === 'true';
    return !skipIntro;
  });
  const [currentGameBackground, setCurrentGameBackground] = useState('');

  // Memoized calculations for performance
  const gameCalculations = useMemo(() => {
    const visibleGamesInTiles = games.slice(0, 8);
    const hasMoreGamesInTiles = games.length > 8;
    const maxGameIndexInTiles = 2 + visibleGamesInTiles.length - 1;
    const visibleGamesForDisplay = games.slice(0, 8);
    const maxGameIndexForDisplay = 2 + visibleGamesForDisplay.length - 1;
    const isOnRealGame = activeGameTileIndex >= 2 && activeGameTileIndex <= maxGameIndexForDisplay;
    const showMustSee = activeGameTileIndex === 0 || activeGameTileIndex === 1;
    const isPlayButtonActive = currentSection === 'play-button';
    
    return {
      visibleGamesInTiles,
      hasMoreGamesInTiles,
      maxGameIndexInTiles,
      visibleGamesForDisplay,
      maxGameIndexForDisplay,
      isOnRealGame,
      showMustSee,
      isPlayButtonActive
    };
  }, [games, activeGameTileIndex, currentSection]);

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
    // Handle More Games section navigation
    if (showMoreGames) {
      const moreGames = games; // Show ALL games in More Games section
      const GAMES_PER_ROW = 5;
      const totalRows = Math.ceil(moreGames.length / GAMES_PER_ROW);
      const currentRow = Math.floor(moreGamesIndex / GAMES_PER_ROW);
      const currentCol = moreGamesIndex % GAMES_PER_ROW;

      if (e.key === 'ArrowRight') {
        if (currentCol < GAMES_PER_ROW - 1 && moreGamesIndex < moreGames.length - 1) {
          setMoreGames(true, moreGamesIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentCol > 0) {
          setMoreGames(true, moreGamesIndex - 1);
        }
      } else if (e.key === 'ArrowDown') {
        if (currentRow < totalRows - 1) {
          const newIndex = Math.min(moreGamesIndex + GAMES_PER_ROW, moreGames.length - 1);
          setMoreGames(true, newIndex);
        }
      } else if (e.key === 'ArrowUp') {
        if (currentRow > 0) {
          setMoreGames(true, moreGamesIndex - GAMES_PER_ROW);
        }
      } else if (e.key === 'Enter') {
        const selectedGame = moreGames[moreGamesIndex];
        if (selectedGame && selectedGame.executable && window.electronAPI) {
          window.electronAPI.launchGame(selectedGame.executable);
        }
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        setMoreGames(false, 0, games);
      }
      return;
    }

    let newSection = currentSection;
    let newIndex = currentIndex;
    let newActiveGameTileIndex = activeGameTileIndex;
    
    if (e.key === 'ArrowRight') {
      if (currentSection === 'header' && currentIndex < 4) newIndex++;
      if (currentSection === 'game-tiles') {
        const maxTileIndex = 2 + gameCalculations.visibleGamesInTiles.length + (gameCalculations.hasMoreGamesInTiles ? 1 : 0) - 1;
        
        if (currentIndex < maxTileIndex) {
          newIndex++;
          newActiveGameTileIndex = newIndex;
        }
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
        } else if (currentIndex >= 2 && currentIndex <= gameCalculations.maxGameIndexInTiles) {
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
    } else if (e.key === 'Enter') {
      if (currentSection === 'play-button') {
        const currentGame = games[activeGameTileIndex - 2];
        if (currentGame && currentGame.executable && window.electronAPI) {
          window.electronAPI.launchGame(currentGame.executable);
        }
      } else if (currentSection === 'game-tiles') {
        const moreGamesTileIndex = 2 + gameCalculations.visibleGamesInTiles.length;
        
        if (gameCalculations.hasMoreGamesInTiles && activeGameTileIndex === moreGamesTileIndex) {
          // Clicked on More Games tile
          setMoreGames(true, 0);
          return;
        }
      }
    }

    if (newSection !== currentSection || newIndex !== currentIndex || newActiveGameTileIndex !== activeGameTileIndex) {
      setNavigation(newSection, newIndex, newActiveGameTileIndex);
    }
  }, [currentSection, currentIndex, lastGameTileIndex, activeGameTileIndex, setNavigation, games, showMoreGames, moreGamesIndex, setMoreGames, gameCalculations]);

  // Gamepad input handler
  const handleGamepadInput = useCallback((input) => {
    if (showIntro) {
      // During intro, any button skips it
      if (input.type === 'action') {
        setShowIntro(false);
      }
      return;
    }

    if (input.type === 'direction') {
      // Convert gamepad direction to keyboard event
      const keyMap = {
        'up': 'ArrowUp',
        'down': 'ArrowDown',
        'left': 'ArrowLeft',
        'right': 'ArrowRight'
      };
      
      const key = keyMap[input.direction];
      if (key) {
        handleKeyDown({ key });
      }
    } else if (input.type === 'action') {
      if (input.action === 'confirm') {
        // A button acts as Enter
        handleKeyDown({ key: 'Enter' });
      } else if (input.action === 'back') {
        // B button acts as Escape or back action
        if (showMoreGames) {
          setMoreGames(false, 0, games);
        } else {
          handleKeyDown({ key: 'Escape' });
        }
      } else if (input.action === 'shoulder_left') {
        // LB/L1 - quick navigation to header left
        if (currentSection === 'header') {
          setNavigation('header', Math.max(0, currentIndex - 1));
        } else {
          setNavigation('header', 0);
        }
      } else if (input.action === 'shoulder_right') {
        // RB/R1 - quick navigation to header right
        if (currentSection === 'header') {
          setNavigation('header', Math.min(4, currentIndex + 1));
        } else {
          setNavigation('header', 1);
        }
      }
    }
  }, [showIntro, handleKeyDown, currentSection, currentIndex, setNavigation, showMoreGames, setMoreGames]);

  // Initialize gamepad
  const { gamepad, isConnected } = useGamepad(handleGamepadInput);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Update background when active game changes
  useEffect(() => {
    const updateBackground = () => {
      if (gameCalculations.isOnRealGame) {
        const currentGame = gameCalculations.visibleGamesForDisplay[activeGameTileIndex - 2];
        if (currentGame && currentGame.background) {
          setCurrentGameBackground(currentGame.background);
        } else {
          setCurrentGameBackground('');
        }
      } else {
        setCurrentGameBackground('');
      }
    };

    const timeoutId = setTimeout(updateBackground, 50); // Debounce background updates
    return () => clearTimeout(timeoutId);
  }, [activeGameTileIndex, gameCalculations]);

  // Memoized background component
  const BackgroundComponent = useMemo(() => {
    if (currentGameBackground) {
      return (
        <img
          src={currentGameBackground}
          alt="Game Background"
          className="video-background"
          style={{ objectFit: 'cover' }}
          loading="eager"
        />
      );
    }
    
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        className="video-background"
        preload="auto"
      >
        <source src={BackgroundVideo} type="video/webm" />
      </video>
    );
  }, [currentGameBackground]);

  if (showIntro) {
    return <IntroVideo onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="app-root">
      {/* Gamepad status indicator */}
      {isConnected && (
        <div className="gamepad-indicator fixed top-4 right-4 z-40 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
          🎮 Геймпад подключен
        </div>
      )}
      
      <div className="video-container">
        {BackgroundComponent}
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
        <div className={`main-header ${gameCalculations.isPlayButtonActive ? 'hidden' : ''}`}>
          <MemoizedHeader
            currentSection={currentSection}
            currentIndex={currentIndex}
            setNavigation={setNavigation}
          />
        </div>
        <div className={`game-tiles-wrapper ${gameCalculations.isPlayButtonActive || showMoreGames ? 'hidden' : ''}`}>
          <MemoizedGameTiles
            currentSection={currentSection}
            currentIndex={currentIndex}
            activeGameTileIndex={activeGameTileIndex}
            setNavigation={setNavigation}
            lastGameTileOffset={lastGameTileOffset}
            games={games}
            setMoreGames={setMoreGames}
          />
        </div>
        {gameCalculations.showMustSee && !gameCalculations.isPlayButtonActive && !showMoreGames && (
          <MemoizedMustSeeSection
            currentSection={currentSection}
            currentIndex={currentIndex}
            setNavigation={setNavigation}
          />
        )}
        {gameCalculations.isOnRealGame && !showMoreGames && (
          <MemoizedGameInfoSection
            currentIndex={activeGameTileIndex}
            isPlayButtonActive={gameCalculations.isPlayButtonActive}
            games={gameCalculations.visibleGamesForDisplay}
          />
        )}
        {showMoreGames && (
          <MemoizedMoreGamesSection
            currentSection={currentSection}
            currentIndex={currentIndex}
            setNavigation={setNavigation}
            setMoreGames={setMoreGames}
            games={games}
            moreGamesIndex={moreGamesIndex}
          />
        )}
      </div>
    </div>
  );
}

export default App;
