import { create } from 'zustand';

const useNavigationStore = create((set, get) => ({
  currentSection: 'game-tiles',
  currentIndex: 0,
  lastGameTileIndex: 0,
  lastGameTileOffset: 0,
  activeGameTileIndex: 0,
  showMoreGames: false,
  moreGamesIndex: 0,
  setNavigation: (section, index, activeGameTileIndex) =>
    set((state) => {
      const newState = { 
        currentSection: section, 
        currentIndex: index,
        activeGameTileIndex: activeGameTileIndex !== undefined ? activeGameTileIndex : state.activeGameTileIndex 
      };
      if (state.currentSection === 'game-tiles' && section === 'game-tiles') {
        newState.lastGameTileIndex = index;
        newState.lastGameTileOffset = index * (5.2 + 0.5);
      }
      return newState;
    }),
  setMoreGames: (show, index = 0, gamesArray = null) =>
    set((state) => {
      if (show) {
        // Entering More Games
        return {
          showMoreGames: true,
          moreGamesIndex: index,
          currentSection: 'more-games',
          currentIndex: index
        };
      } else {
        // Exiting More Games - return to More Games tile
        // Use provided gamesArray or try to get from localStorage as fallback
        const games = gamesArray || JSON.parse(localStorage.getItem('games') || '[]');
        const visibleGames = games.slice(0, 8);
        const hasMoreGames = games.length > 8;
        
        if (hasMoreGames) {
          const moreGamesTileIndex = 2 + visibleGames.length;
          return {
            showMoreGames: false,
            moreGamesIndex: 0,
            currentSection: 'game-tiles',
            currentIndex: moreGamesTileIndex,
            activeGameTileIndex: moreGamesTileIndex
          };
        } else {
          // No More Games tile exists, return to last position
          return {
            showMoreGames: false,
            moreGamesIndex: 0,
            currentSection: state.currentSection,
            currentIndex: state.currentIndex
          };
        }
      }
    }),
}));

export default useNavigationStore;
