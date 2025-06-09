import { memo, useCallback } from 'react';
import TileWaveEffect from './TileWaveEffect.jsx';

import StoreIcon from '/assets/Store.svg';
import ExplorerIcon from '/assets/Explorer.svg';
import MoreGamesIcon from '/assets/More_games.svg';

function GameTiles({ currentSection, currentIndex, activeGameTileIndex, setNavigation, lastGameTileOffset, games, setMoreGames }) {
  // Show only first 8 games, then add More Games tile if there are more
  const visibleGames = games.slice(0, 8);
  const hasMoreGames = games.length > 8;
  
  const tiles = [
    { type: 'store', img: StoreIcon, className: 'tile-store w-[2.45vw] h-[3.13vw]' },
    { type: 'explorer', img: ExplorerIcon, className: 'tile-explorer w-[2.4vw] h-[2.4vw]' },
    ...visibleGames.map((game) => ({ type: 'game', background: game.cover, name: game.name, game: game })),
    ...(hasMoreGames ? [{ type: 'more_games', img: MoreGamesIcon, className: 'tile-more-games w-[2.55vw] h-[2.6vw]' }] : [])
  ];

  const handleClick = useCallback((index) => {
    // Check if clicking on More Games tile (last tile)
    if (index === tiles.length - 1 && tiles[index].type === 'more_games') {
      setMoreGames(true, 0);
    } else {
      setNavigation('game-tiles', index, index);
    }
  }, [setNavigation, setMoreGames, tiles]);

  const renderBorderSvg = (isActive) => {
    if (!isActive) return null;
    const rx = isActive ? '1.71vw' : '1.03vw';
    const ry = isActive ? '1.71vw' : '1.03vw';

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
          rx={rx}
          ry={ry}
        />
      </svg>
    );
  };

  return (
    <div className="game-tiles-wrapper w-full mt-[3vw]">
      <div
        className="game-tiles flex flex-row items-start gap-[0.52vw] pl-[9.7vw] pr-[23.96vw] whitespace-nowrap transition-transform duration-300"
        style={{ transform: `translateX(-${currentSection === 'game-tiles' ? currentIndex * (5.2 + 0.5) : lastGameTileOffset}vw)` }}
      >
        {tiles.map((tile, index) => {
          const isActive = currentSection === 'game-tiles' && activeGameTileIndex === index;
          return (
            <div
              key={index}
              className={`game-tile w-[5.52vw] h-[5.52vw] min-w-[5.52vw] min-h-[5.52vw] max-w-[5.52vw] max-h-[5.52vw] rounded-[0.83vw] bg-[rgba(0,0,0,0.7)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center relative bg-cover bg-center bg-no-repeat transition-all duration-300 ${
                isActive
                  ? 'active w-[9.43vw] h-[9.43vw] min-w-[9.43vw] min-h-[9.43vw] max-w-[9.43vw] max-h-[9.43vw] rounded-[1.51vw] shadow-[0_4px_12px_rgba(0,0,0,0.2)] z-10 animate-[tile-glow_5s_ease-in-out_infinite]'
                  : ''
              }`}
              style={tile.background ? { backgroundImage: `url(${tile.background || '/assets/placeholder.png'})` } : {}}
              data-nav={`game-tile-${index}`}
              data-section="game-tiles"
              onClick={() => handleClick(index)}
            >
              {tile.img && <img src={tile.img} alt={tile.type} className={`tile-svg block mx-auto ${tile.className}`} />}
              {isActive && <TileWaveEffect />}
              {renderBorderSvg(isActive)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(GameTiles);
