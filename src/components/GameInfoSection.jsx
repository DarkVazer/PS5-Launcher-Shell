import { memo } from 'react';

function GameInfoSection({ currentIndex, isPlayButtonActive, games }) {
  const currentGame = games[currentIndex - 2];

  const handleLaunchGame = () => {
    if (window.electronAPI && currentGame?.executable) {
      window.electronAPI.launchGame(currentGame.executable);
    } else {
      console.error('electronAPI not available or executable path missing');
    }
  };

  return (
    <>
      {isPlayButtonActive && currentGame && (
        <div className="game-tile-container flex items-center absolute top-[25px] left-[71px]">
          <div
            className="game-tile-moved w-[5.52vw] h-[5.52vw] rounded-[0.83vw] bg-[rgba(0,0,0,0.7)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out"
            style={{ backgroundImage: `url(${currentGame.cover || '/assets/placeholder.png'})` }}
          />
          <span className="game-title ml-[25px] text-white font-sans text-[36px] font-semibold leading-normal tracking-[0.18px]">
            {currentGame.name}
          </span>
        </div>
      )}

      {currentGame && (
        <div className={`game-info-section w-full max-w-[1920px] mx-auto absolute left-0 right-0 flex flex-col items-start pl-[204px] ${isPlayButtonActive ? 'active' : ''}`}>
          <img
            src={currentGame.titleLogo || currentGame.cover || '/assets/placeholder.png'}
            alt="Game Title Logo"
            className="game-logo max-w-[200px] max-h-[100px] object-contain"
            onError={(e) => { e.target.src = '/assets/placeholder.png'; }}
          />

          {currentGame.description && (
            <p
              className="game-description mt-[48px] text-white font-sans text-[36px] font-light leading-normal tracking-[0.18px]"
            >
              {currentGame.description}
            </p>
          )}

          <div
            className={`button-container flex items-center gap-[15px] mt-${
              currentGame.description ? '[48px]' : '[56px]'
            }`}
          >
            <button
              onClick={handleLaunchGame}
              className={`play-button w-[371px] h-[78px] bg-[rgba(0,0,0,0.14)] text-white font-sans text-[36px] font-semibold leading-normal tracking-[0.18px] flex items-center justify-center rounded-[61px] ${
                isPlayButtonActive ? 'active shadow-[0_0_10px_rgba(255,255,255,0.5)]' : ''
              }`}
            >
              Играть
            </button>
            <button
              className="more-button w-[78px] h-[78px] rounded-full bg-[rgba(0,0,0,0.14)] flex items-center justify-center"
            >
              <div className="dots flex flex-col items-center justify-center gap-[5px]">
                <div className="dot w-[6px] h-[6px] rounded-full bg-white"></div>
                <div className="dot w-[6px] h-[6px] rounded-full bg-white"></div>
                <div className="dot w-[6px] h-[6px] rounded-full bg-white"></div>
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(GameInfoSection);