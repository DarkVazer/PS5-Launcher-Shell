import { memo, useCallback } from 'react';
import TileWaveEffect from './TileWaveEffect.jsx';

function MustSeeSection({ currentSection, currentIndex, setNavigation }) {
  const handleClick = useCallback((index) => {
    setNavigation('must-see-tiles', index);
  }, [setNavigation]);

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
          rx="0.2vw"
          ry="0.2vw"
        />
      </svg>
    );
  };

  return (
    <div className="must-see-section w-full max-w-[1920px] mx-auto mb-[3.44vw] absolute left-0 right-0 bottom-0">
      <div className="must-see-title font-sans text-[2vw] font-semibold text-white ml-[9.48vw] mb-[1.25vw]">
        Must see
      </div>
      <div className="must-see-tiles-wrapper w-full">
        <div className="must-see-tiles flex flex-row items-start gap-[1.25vw] pl-[9.48vw] pr-[3.96vw] whitespace-nowrap">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`must-see-tile w-[13.39vw] h-[6.67vw] min-w-[13.39vw] min-h-[6.67vw] max-w-[13.39vw] max-h-[6.67vw] bg-[rgba(0,0,0,0.7)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center relative transition-shadow duration-300 ${
                currentSection === 'must-see-tiles' && currentIndex === index
                  ? 'active shadow-[0_4px_12px_rgba(0,0,0,0.2)] animate-[tile-glow_5s_ease-in-out_infinite]'
                  : ''
              }`}
              data-nav={`must-see-tile-${index}`}
              data-section="must-see-tiles"
              onClick={() => handleClick(index)}
            >
              {currentSection === 'must-see-tiles' && currentIndex === index && <TileWaveEffect />}
              {renderBorderSvg(currentSection === 'must-see-tiles' && currentIndex === index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(MustSeeSection);