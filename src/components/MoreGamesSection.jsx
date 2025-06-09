import { memo, useCallback } from 'react';
import TileWaveEffect from './TileWaveEffect.jsx';

// Import More Games icon as asset
import MoreGamesIcon from '/assets/More_games.svg';

const MoreGamesSection = memo(({ 
  currentSection, 
  currentIndex, 
  setNavigation, 
  setMoreGames, 
  games, 
  moreGamesIndex 
}) => {
  // Show ALL games in More Games section
  const moreGames = games;
  const GAMES_PER_ROW = 5;
  
  const handleClick = useCallback((index) => {
    setMoreGames(true, index);
  }, [setMoreGames]);

  const handleBack = useCallback(() => {
    setMoreGames(false, 0, games);
  }, [setMoreGames, games]);

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
          rx="1.71vw"
          ry="1.71vw"
        />
      </svg>
    );
  };

  if (moreGames.length === 0) {
    return (
      <div className="more-games-section fixed inset-0 z-30 bg-black/80 flex items-center justify-center">
        <div className="text-white text-[2vw] text-center">
          <div className="mb-4">Нет дополнительных игр</div>
          <button
            onClick={handleBack}
            className="text-[1.5vw] bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="more-games-section fixed inset-0 z-30 bg-black/90">
      {/* More Games tile moved to top-left corner */}
      <div className="more-games-tile-moved absolute top-[25px] left-[71px] w-[5.52vw] h-[5.52vw] rounded-[0.83vw] bg-[rgba(0,0,0,0.7)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center">
        <img 
          src={MoreGamesIcon} 
          alt="More Games" 
          className="w-[2.55vw] h-[2.6vw]" 
        />
      </div>

      {/* Title */}
      <div className="absolute top-[25px] left-[200px]">
        <span className="text-white font-sans text-[36px] font-semibold leading-normal tracking-[0.18px]">
          Все игры
        </span>
      </div>

      {/* Games grid */}
      <div className="games-grid absolute top-[120px] left-[150px] right-[100px]">
        <div 
          className="grid gap-[1.25vw]"
          style={{ 
            gridTemplateColumns: `repeat(${GAMES_PER_ROW}, 1fr)`,
            maxWidth: '70vw'
          }}
        >
          {moreGames.map((game, index) => {
            const isActive = currentSection === 'more-games' && moreGamesIndex === index;
            return (
              <div
                key={index}
                className={`more-game-tile w-[13.39vw] h-[13.39vw] min-w-[13.39vw] min-h-[13.39vw] max-w-[13.39vw] max-h-[13.39vw] rounded-[0.83vw] bg-[rgba(0,0,0,0.7)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex flex-col items-center justify-between p-[1vw] relative bg-cover bg-center bg-no-repeat transition-all duration-300 cursor-pointer ${
                  isActive ? 'active shadow-[0_4px_12px_rgba(0,0,0,0.2)] animate-[tile-glow_5s_ease-in-out_infinite]' : ''
                }`}
                style={game.cover ? { backgroundImage: `url(${game.cover})` } : {}}
                onClick={() => handleClick(index)}
              >
                <div className="flex flex-col items-center flex-1 justify-center">
                  {game.cover && (
                    <img
                      src={game.cover}
                      alt={game.name}
                      className="w-[8vw] h-[8vw] object-cover rounded-[0.5vw] mb-[0.5vw]"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <h3 className="text-[1.2vw] font-semibold text-white/90 text-center">
                    {game.name}
                  </h3>
                </div>
                
                {isActive && <TileWaveEffect />}
                {renderBorderSvg(isActive)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Back button hint */}
      <div className="absolute bottom-[50px] left-[150px] text-white/70 text-[1.2vw]">
        Нажмите B или Escape для возврата
      </div>
    </div>
  );
});

MoreGamesSection.displayName = 'MoreGamesSection';

export default MoreGamesSection; 