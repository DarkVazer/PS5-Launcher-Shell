import { useEffect, useState } from 'react';

function Launcher() {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({ name: '', cover: '', executable: '' });

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

  return (
    <div className="launcher-root p-6 bg-gray-900 text-white h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Game Launcher</h1>
      <div className="mb-6">
        <button
          onClick={handleLaunchShell}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Launch PS5 Shell
        </button>
      </div>
      <div className="add-game mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New Game</h2>
        <input
          type="text"
          placeholder="Game Name"
          value={newGame.name}
          onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
          className="bg-gray-800 text-white p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Cover Image Path"
          value={newGame.cover}
          onChange={(e) => setNewGame({ ...newGame, cover: e.target.value })}
          className="bg-gray-800 text-white p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Executable Path"
          value={newGame.executable}
          onChange={(e) => setNewGame({ ...newGame, executable: e.target.value })}
          className="bg-gray-800 text-white p-2 rounded mr-2"
        />
        <button
          onClick={handleAddGame}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add Game
        </button>
      </div>
      <div className="games-grid grid grid-cols-3 gap-4">
        {games.map((game, index) => (
          <div key={index} className="game-card bg-gray-800 p-4 rounded flex flex-col items-center">
            <img src={game.cover} alt={game.name} className="w-32 h-32 object-cover mb-2" />
            <h3 className="text-lg font-semibold">{game.name}</h3>
            <button
              onClick={() => handleLaunchGame(game.executable)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded mt-2"
            >
              Launch
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Launcher;