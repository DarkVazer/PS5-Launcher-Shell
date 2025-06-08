import { useEffect, useState } from 'react';
import TileWaveEffect from './components/TileWaveEffect.jsx';

function Launcher() {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({ name: '', cover: '', executable: '' });
  const [activeIndex, setActiveIndex] = useState(-1); // Для активной карточки

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getGames().then((loadedGames) => {
        setGames(loadedGames);
      }).catch((err) => {
        console.error('Error fetching games:', err);
      });
    } else {
      console.error('electronAPI not available');
    }
  }, []);

  const handleAddGame = async () => {
    if (newGame.name && newGame.cover && newGame.executable && window.electronAPI) {
      try {
        const updatedGames = await window.electronAPI.addGame(newGame);
        setGames(updatedGames);
        setNewGame({ name: '', cover: '', executable: '' });
      } catch (err) {
        console.error('Error adding game:', err);
      }
    }
  };

  const handleLaunchShell = () => {
    if (window.electronAPI) {
      window.electronAPI.launchShell();
    } else {
      console.error('electronAPI not available');
    }
  };

  const handleLaunchGame = (executable) => {
    if (window.electronAPI) {
      window.electronAPI.launchGame(executable);
    } else {
      console.error('electronAPI not available');
    }
  };

  const renderBorderSvg = (isActive) => {
    if (!isActive) return null;
    return (
      <svg
        className="border-svg absolute pointer-events-none transition-all duration-300"
        style={{
          width: 'calc(100% + 0.9vw)',
          height: 'calc(100% + 0.9vw)',
          top: '-0.45vw',
          left: '-0.45vw',
          display: 'block',
          overflow: 'visible',
        }}
      >
        <rect
          x="4"
          y="4"
          width="calc(100% - 8px)"
          height="calc(100% - 8px)"
          fill="none"
          stroke="url(#borderGradient)"
          strokeWidth="3"
          rx="0.83vw"
          ry="0.83vw"
        />
      </svg>
    );
  };

  return (
    <div className="launcher-root min-h-screen bg-black/90 text-white font-sans flex flex-col items-center relative">
      <div className="video-container absolute top-0 left-0 w-full h-full z-[-1]">
        <video autoPlay loop muted playsInline className="video-background w-full h-full object-cover">
          <source src="/assets/LoopNoParticles.webm" type="video/webm" />
        </video>
      </div>
      <h1 className="text-[2.5vw] font-semibold text-white/90 mt-[3vw] mb-[2vw]">Game Launcher</h1>
      <div className="mb-[3vw] w-full max-w-[80vw]">
        <button
          onClick={handleLaunchShell}
          className="header-btn flex items-center justify-center font-sans text-[1.875vw] font-semibold text-[#FBFBFB] h-[2.55vw] px-[0.5vw] border-none bg-none cursor-pointer relative hover:animate-[tile-glow_5s_ease-in-out_infinite]"
        >
          Launch PS5 Shell
          {renderBorderSvg(activeIndex === -2)} {/* Активная рамка для кнопки */}
          {activeIndex === -2 && <TileWaveEffect />}
        </button>
      </div>
      <div className="add-game mb-[3vw] w-full max-w-[80vw]">
        <h2 className="text-[2vw] font-semibold text-white/80 mb-[1.25vw]">Add New Game</h2>
        <div className="flex gap-[1vw]">
          <input
            type="text"
            placeholder="Game Name"
            value={newGame.name}
            onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
            className="bg-[rgba(0,0,0,0.7)] text-white p-[0.8vw] rounded-[0.5vw] border border-white/20 focus:outline-none focus:border-blue-500 transition-all duration-300 flex-1"
          />
          <input
            type="text"
            placeholder="Cover Image Path"
            value={newGame.cover}
            onChange={(e) => setNewGame({ ...newGame, cover: e.target.value })}
            className="bg-[rgba(0,0,0,0.7)] text-white p-[0.8vw] rounded-[0.5vw] border border-white/20 focus:outline-none focus:border-blue-500 transition-all duration-300 flex-1"
          />
          <input
            type="text"
            placeholder="Executable Path"
            value={newGame.executable}
            onChange={(e) => setNewGame({ ...newGame, executable: e.target.value })}
            className="bg-[rgba(0,0,0,0.7)] text-white p-[0.8vw] rounded-[0.5vw] border border-white/20 focus:outline-none focus:border-blue-500 transition-all duration-300 flex-1"
          />
          <button
            onClick={handleAddGame}
            className="header-btn flex items-center justify-center font-sans text-[1.875vw] font-semibold text-[#FBFBFB] h-[2.55vw] px-[0.5vw] border-none bg-none cursor-pointer relative hover:animate-[tile-glow_5s_ease-in-out_infinite]"
          >
            Add Game
            {renderBorderSvg(activeIndex === -1)} {/* Активная рамка для кнопки */}
            {activeIndex === -1 && <TileWaveEffect />}
          </button>
        </div>
      </div>
      <div className="games-grid flex flex-row gap-[1.25vw] w-full max-w-[80vw] flex-wrap">
        {games.map((game, index) => (
          <div
            key={index}
            className={`game-tile w-[13.39vw] h-[13.39vw] min-w-[13.39vw] min-h-[13.39vw] max-w-[13.39vw] max-h-[13.39vw] rounded-[0.83vw] bg-[rgba(0,0,0,0.7)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex flex-col items-center justify-between p-[1vw] relative bg-cover bg-center bg-no-repeat transition-all duration-300 ${
              activeIndex === index ? 'active w-[15vw] h-[15vw] min-w-[15vw] min-h-[15vw] max-w-[15vw] max-h-[15vw] rounded-[1.51vw] shadow-[0_4px_12px_rgba(0,0,0,0.2)] animate-[tile-glow_5s_ease-in-out_infinite]' : ''
            }`}
            style={game.cover ? { backgroundImage: `url(${game.cover})` } : {}}
            onClick={() => setActiveIndex(index)}
          >
            <div className="flex flex-col items-center">
              <img
                src={game.cover}
                alt={game.name}
                className="w-[8vw] h-[8vw] object-cover rounded-[0.5vw] mb-[0.5vw]"
              />
              <h3 className="text-[1.2vw] font-semibold text-white/90">{game.name}</h3>
            </div>
            <button
              onClick={() => handleLaunchGame(game.executable)}
              className="header-btn flex items-center justify-center font-sans text-[1vw] font-semibold text-[#FBFBFB] h-[2vw] px-[0.5vw] border-none bg-none cursor-pointer relative hover:animate-[tile-glow_5s_ease-in-out_infinite]"
            >
              Launch
              {renderBorderSvg(activeIndex === index)} {/* Активная рамка для кнопки */}
              {activeIndex === index && <TileWaveEffect />}
            </button>
            {renderBorderSvg(activeIndex === index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Launcher;
