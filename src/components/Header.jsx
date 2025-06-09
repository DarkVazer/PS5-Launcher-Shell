import { useEffect, useState, memo } from 'react';
import TileWaveEffect from './TileWaveEffect.jsx';

// Импортируем ассеты
import SearchIcon from '/assets/Search.svg';
import SettingsIcon from '/assets/settings.svg';
import AvatarIcon from '/assets/avatar.svg';

function Header({ currentSection, currentIndex, setNavigation }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (index) => {
    setNavigation('header', index);
  };

  const renderBorderSvg = (isActive, isIconOrAvatar) => {
    if (!isActive) return null;
    const size = isIconOrAvatar ? 'calc(100% + 0.9vw)' : 'calc(100% + 0.7vw)';
    const offset = isIconOrAvatar ? '-0.45vw' : '-0.35vw';
    const rx = isIconOrAvatar ? '50%' : '0.4vw';
    const ry = isIconOrAvatar ? '50%' : '0.4vw';

    return (
      <svg
        className="border-svg absolute pointer-events-none transition-all duration-300"
        style={{
          width: size,
          height: size,
          top: offset,
          left: offset,
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
    <header className="main-header mt-[2vw]">
      <div className="header-content flex justify-between items-center w-full max-w-[1920px] mx-auto px-[4.7vw]">
        <div className="header-buttons flex items-center gap-[4vw]">
          <button
            className={`header-btn flex items-center justify-center font-sans text-[1.875vw] font-semibold text-[#FBFBFB] h-[2.55vw] px-[0.5vw] border-none bg-none cursor-pointer relative ${
              currentSection === 'header' && currentIndex === 0 ? 'active animate-[tile-glow_5s_ease-in-out_infinite]' : ''
            }`}
            data-nav="header-btn-0"
            data-section="header"
            onClick={() => handleClick(0)}
          >
            Игры
            {currentSection === 'header' && currentIndex === 0 && <TileWaveEffect />}
            {renderBorderSvg(currentSection === 'header' && currentIndex === 0, false)}
          </button>
          <button
            className={`header-btn flex items-center justify-center font-sans text-[1.875vw] font-light text-[#BFBFBF] h-[2.55vw] px-[0.5vw] border-none bg-none cursor-pointer relative ${
              currentSection === 'header' && currentIndex === 1 ? 'active animate-[tile-glow_5s_ease-in-out_infinite]' : ''
            }`}
            data-nav="header-btn-1"
            data-section="header"
            onClick={() => handleClick(1)}
          >
            Мультимедиа
            {currentSection === 'header' && currentIndex === 1 && <TileWaveEffect />}
            {renderBorderSvg(currentSection === 'header' && currentIndex === 1, false)}
          </button>
        </div>
        <div className="header-right flex items-center">
          <button
            className={`header-icon search w-[1.77vw] h-[1.77vw] bg-none border-none cursor-pointer flex items-center justify-center relative mr-[3.44vw] ${
              currentSection === 'header' && currentIndex === 2 ? 'active animate-[tile-glow_5s_ease-in-out_infinite]' : ''
            }`}
            title="Поиск"
            data-nav="header-icon-0"
            data-section="header"
            onClick={() => handleClick(2)}
          >
            <img src={SearchIcon} alt="Поиск" className="w-full h-full object-contain" />
            {currentSection === 'header' && currentIndex === 2 && <TileWaveEffect />}
            {renderBorderSvg(currentSection === 'header' && currentIndex === 2, true)}
          </button>
          <button
            className={`header-icon settings w-[1.77vw] h-[1.77vw] bg-none border-none cursor-pointer flex items-center justify-center relative mr-[3.44vw] ${
              currentSection === 'header' && currentIndex === 3 ? 'active animate-[tile-glow_5s_ease-in-out_infinite]' : ''
            }`}
            title="Настройки"
            data-nav="header-icon-1"
            data-section="header"
            onClick={() => handleClick(3)}
          >
            <img src={SettingsIcon} alt="Настройки" className="w-full h-full object-contain" />
            {currentSection === 'header' && currentIndex === 3 && <TileWaveEffect />}
            {renderBorderSvg(currentSection === 'header' && currentIndex === 3, true)}
          </button>
          <div
            className={`header-avatar w-[2.76vw] h-[2.76vw] rounded-full bg-[#232323] flex items-center justify-center relative mr-[4.95vw] shadow-[0_0_0_2px_#BFBFBF] ${
              currentSection === 'header' && currentIndex === 4 ? 'active animate-[tile-glow_5s_ease-in-out_infinite]' : ''
            }`}
            data-nav="header-avatar"
            data-section="header"
            onClick={() => handleClick(4)}
          >
            <img src={AvatarIcon} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            <span className="avatar-status absolute right-0 bottom-0 w-[0.73vw] h-[0.73vw] bg-[#3FCF4A] border-2 border-[#BFBFBF] rounded-full"></span>
            {currentSection === 'header' && currentIndex === 4 && <TileWaveEffect />}
            {renderBorderSvg(currentSection === 'header' && currentIndex === 4, true)}
          </div>
          <span className="header-time font-sans text-[1.875vw] text-white font-light mr-[3.44vw]">{time}</span>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
