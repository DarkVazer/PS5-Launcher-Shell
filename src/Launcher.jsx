import { useEffect, useState } from 'react';
import TileWaveEffect from './components/TileWaveEffect.jsx';

function Launcher() {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({ name: '', cover: '', titleLogo: '', executable: '', description: '', background: '' });
  const [editGame, setEditGame] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);

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

  const handleSelectCover = async (isEdit = false) => {
    if (window.electronAPI) {
      try {
        const filePath = await window.electronAPI.selectFile({
          filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }],
        });
        if (filePath) {
          if (isEdit) {
            setEditGame({ ...editGame, cover: filePath });
          } else {
            setNewGame({ ...newGame, cover: filePath });
          }
        }
      } catch (err) {
        console.error('Error selecting cover:', err);
      }
    }
  };

  const handleSelectTitleLogo = async (isEdit = false) => {
    if (window.electronAPI) {
      try {
        const filePath = await window.electronAPI.selectFile({
          filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }],
        });
        if (filePath) {
          if (isEdit) {
            setEditGame({ ...editGame, titleLogo: filePath });
          } else {
            setNewGame({ ...newGame, titleLogo: filePath });
          }
        }
      } catch (err) {
        console.error('Error selecting title logo:', err);
      }
    }
  };

  const handleSelectExecutable = async (isEdit = false) => {
    if (window.electronAPI) {
      try {
        const filePath = await window.electronAPI.selectFile({
          filters: [{ name: 'Executables', extensions: ['exe'] }, { name: 'All Files', extensions: ['*'] }],
        });
        if (filePath) {
          if (isEdit) {
            setEditGame({ ...editGame, executable: filePath });
          } else {
            setNewGame({ ...newGame, executable: filePath });
          }
        }
      } catch (err) {
        console.error('Error selecting executable:', err);
      }
    }
  };

  const handleSelectBackground = async (isEdit = false) => {
    if (window.electronAPI) {
      try {
        const filePath = await window.electronAPI.selectFile({
          filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }],
        });
        if (filePath) {
          if (isEdit) {
            setEditGame({ ...editGame, background: filePath });
          } else {
            setNewGame({ ...newGame, background: filePath });
          }
        }
      } catch (err) {
        console.error('Error selecting background:', err);
      }
    }
  };

  const handleAddGame = async () => {
    if (newGame.name && window.electronAPI) {
      try {
        const updatedGames = await window.electronAPI.addGame(newGame);
        setGames(updatedGames);
        setNewGame({ name: '', cover: '', titleLogo: '', executable: '', description: '', background: '' });
      } catch (err) {
        console.error('Error adding game:', err);
      }
    }
  };

  const handleEditGame = async () => {
    if (editGame && window.electronAPI) {
      try {
        const updatedGames = await window.electronAPI.updateGame({ index: editGame.index, game: editGame });
        setGames(updatedGames);
        setEditGame(null);
      } catch (err) {
        console.error('Error updating game:', err);
      }
    }
  };

  const handleDeleteGame = async (index) => {
    if (window.electronAPI) {
      try {
        const updatedGames = await window.electronAPI.deleteGame(index);
        setGames(updatedGames);
      } catch (err) {
        console.error('Error deleting game:', err);
      }
    }
  };

  const handleScanDirectory = async () => {
    if (window.electronAPI) {
      try {
        const scannedGames = await window.electronAPI.scanDirectory();
        if (scannedGames && scannedGames.length > 0) {
          const updatedGames = await window.electronAPI.addGames(scannedGames);
          setGames(updatedGames);
        }
      } catch (err) {
        console.error('Error scanning directory:', err);
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
    if (window.electronAPI && executable) {
      window.electronAPI.launchGame(executable);
    } else {
      console.error('electronAPI not available or executable path missing');
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

  const renderForm = (gameData, isEdit = false, onSubmit, onCancel = null) => (
    <div className="flex flex-col gap-[1vw]">
      <input
        type="text"
        placeholder="Game Name"
        value={gameData.name}
        onChange={(e) => isEdit
          ? setEditGame({ ...gameData, name: e.target.value })
          : setNewGame({ ...gameData, name: e.target.value })}
        className="bg-[rgba(0,0,0,0.7)] text-white p-[0.8vw] rounded-[0.5vw] border border-white/20 focus:outline-none focus:border-blue-500 transition-all duration-300"
      />
      <div className="flex gap-[1vw]">
        <input
          type="text"
          placeholder="Cover Image Path"
          value={gameData.cover}
          readOnly
          className="bg-[rgba(0,0,0,0.7)] text-white p-[0.8vw] rounded-[0.5vw] border border-white/20 flex-1"
        />
        <button
          onClick={() => handleSelectCover(isEdit)}
          className="bg-[rgba(0,0,0,0.7)] text-white p-[0.8vw] rounded-[0.5vw] border border-white/20 hover:border-blue-500 transition-all duration-300"
        >
          Select Cover
        </button>
      </div>
      <div className="flex gap-[1vw]">
        <input
          type="text"
          placeholder="Title Logo Path"
          value={gameData.titleLogo}
          readOnly
          className="bg-[rgba(0,0,0,0.7)] text-white p-[0.8vw] rounded-[0.5vw] border border-white/20 flex-1"
        />
        <button
          onClick={() => handleSelectTitleLogo(isEdit)}
          className="bg-[rgba(0,0,0,0.7)] text-white p-[0.8vw] rounded-[0.5vw] border border-white/20 hover:border-blue-500 transition-all duration-300"
        >
          Select Title Logo
        </button>
      </div>
      <div className="flex gap-[1vw]">
        <input
          type="text"
          placeholder="Executable Path"
          value={gameData.executable}
          readOnly
          className="bg-[rgba(0,0,0,0.7)] text-white p-[0.8vw] rounded-[0.5vw] border border-white/20 flex-1"
        />
        <button
          onClick={() => handleSelectExecutable(isEdit)}
          className="bg-[rgba(0,0,0,0.7)] text-white p-[0.8vw] rounded-[0.5vw] border border-white/20 hover:border-blue-500 transition-all duration-300"
        >
          Select Executable
        </button>
      </div>
      <textarea
        placeholder="Game Description"
        value={gameData.description}
        onChange={(e) => isEdit
          ? setEditGame({ ...gameData, description: e.target.value })
          : setNewGame({ ...gameData, description: e.target.value })}
        className="bg-[rgba(0,0,0,0.7)] text-white p-[0.8vw] rounded-[0.5vw] border border-white/20 focus:outline-none focus:border-blue-500 transition-all duration-300 h-[5vw]"
      />
      <div className="flex gap-[1vw]">
        <input
          type="text"
          placeholder="Background Image Path"
          value={gameData.background}
          readOnly
          className="bg-[rgba(0,0,0,0.7)] text-white p-[0.8vw] rounded-[0.5vw] border border-white/20 flex-1"
        />
        <button
          onClick={() => handleSelectBackground(isEdit)}
          className="bg-[rgba(0,0,0,0.7)] text-white p-[0.8vw] rounded-[0.5vw] border border-white/20 hover:border-blue-500 transition-all duration-300"
        >
          Select Background
        </button>
      </div>
      <div className="flex gap-[1vw]">
        <button
          onClick={onSubmit}
          className="header-btn flex items-center justify-center font-sans text-[1.875vw] font-semibold text-[#FBFBFB] h-[2.55vw] px-[0.5vw] border-none bg-none cursor-pointer relative hover:animate-[tile-glow_5s_ease-in-out_infinite]"
        >
          {isEdit ? 'Save Changes' : 'Add Game'}
          {renderBorderSvg(activeIndex === (isEdit ? editGame?.index : -1))}
          {activeIndex === (isEdit ? editGame?.index : -1) && <TileWaveEffect />}
        </button>
        {isEdit && (
          <button
            onClick={onCancel}
            className="header-btn flex items-center justify-center font-sans text-[1.875vw] font-semibold text-[#FBFBFB] h-[2.55vw] px-[0.5vw] border-none bg-none cursor-pointer relative hover:animate-[tile-glow_5s_ease-in-out_infinite]"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );

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
          onClick={() => { handleLaunchShell(); setActiveIndex(-2); }}
          className="header-btn flex items-center justify-center font-sans text-[1.875vw] font-semibold text-[#FBFBFB] h-[2.55vw] px-[0.5vw] border-none bg-none cursor-pointer relative hover:animate-[tile-glow_5s_ease-in-out_infinite]"
        >
          Launch PS5 Shell
          {renderBorderSvg(activeIndex === -2)}
          {activeIndex === -2 && <TileWaveEffect />}
        </button>
      </div>
      <div className="add-game mb-[3vw] w-full max-w-[80vw]">
        <h2 className="text-[2vw] font-semibold text-white/80 mb-[1.25vw]">
          {editGame ? 'Edit Game' : 'Add New Game'}
        </h2>
        {editGame
          ? renderForm(editGame, true, handleEditGame, () => setEditGame(null))
          : renderForm(newGame, false, handleAddGame)}
      </div>
      <div className="scan-directory mb-[3vw] w-full max-w-[80vw]">
        <button
          onClick={handleScanDirectory}
          className="header-btn flex items-center justify-center font-sans text-[1.875vw] font-semibold text-[#FBFBFB] h-[2.55vw] px-[0.5vw] border-none bg-none cursor-pointer relative hover:animate-[tile-glow_5s_ease-in-out_infinite]"
        >
          Scan Directory
          {renderBorderSvg(activeIndex === -3)}
          {activeIndex === -3 && <TileWaveEffect />}
        </button>
      </div>
      <div className="games-grid flex flex-row gap-[1.25vw] w-full max-w-[80vw] flex-wrap">
        {games.map((game, index) => (
          <div
            key={index}
            className={`game-tile w-[13.39vw] h-[13.39vw] min-w-[13.39vw] min-h-[13.39vw] max-w-[13.39vw] max-h-[13.39vw] rounded-[0.83vw] bg-[rgba(0,0,0,0.7)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex flex-col items-center justify-between p-[1vw] relative bg-cover bg-center bg-no-repeat transition-all duration-300 ${
              activeIndex === index ? 'active w-[15vw] h-[15vw] min-w-[15vw] min-h-[15vw] max-w-[15vw] max-h-[15vw] rounded-[1.51vw] shadow-[0_4px_12px_rgba(0,0,0,0.2)] animate-[tile-glow_5s_ease-in-out_infinite]' : ''
            }`}
            style={game.cover ? { backgroundImage: `url(${game.cover || '/assets/placeholder.png'})` } : {}}
            onClick={() => setActiveIndex(index)}
          >
            <div className="flex flex-col items-center">
              <img
                src={game.cover || '/assets/placeholder.png'}
                alt={game.name}
                className="w-[8vw] h-[8vw] object-cover rounded-[0.5vw] mb-[0.5vw]"
                onError={(e) => { e.target.src = '/assets/placeholder.png'; }}
              />
              <h3 className="text-[1.2vw] font-semibold text-white/90">{game.name}</h3>
            </div>
            <div className="flex gap-[0.5vw]">
              <button
                onClick={() => handleLaunchGame(game.executable)}
                className="header-btn flex items-center justify-center font-sans text-[1vw] font-semibold text-[#FBFBFB] h-[2vw] px-[0.5vw] border-none bg-none cursor-pointer relative hover:animate-[tile-glow_5s_ease-in-out_infinite]"
              >
                Launch
                {renderBorderSvg(activeIndex === index)}
                {activeIndex === index && <TileWaveEffect />}
              </button>
              <button
                onClick={() => handleDeleteGame(index)}
                className="header-btn flex items-center justify-center font-sans text-[1vw] font-semibold text-[#FBFBFB] h-[2vw] px-[0.5vw] border-none bg-none cursor-pointer relative hover:animate-[tile-glow_5s_ease-in-out_infinite]"
              >
                Delete
              </button>
              <button
                onClick={() => setEditGame({ ...game, index })}
                className="header-btn flex items-center justify-center font-sans text-[1vw] font-semibold text-[#FBFBFB] h-[2vw] px-[0.5vw] border-none bg-none cursor-pointer relative hover:animate-[tile-glow_5s_ease-in-out_infinite]"
              >
                Edit
              </button>
            </div>
            {renderBorderSvg(activeIndex === index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Launcher;
