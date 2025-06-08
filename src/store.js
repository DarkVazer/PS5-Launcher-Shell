import { create } from 'zustand';

const useNavigationStore = create((set) => ({
  currentSection: 'game-tiles',
  currentIndex: 0,
  lastGameTileIndex: 0,
  lastGameTileOffset: 0,
  activeGameTileIndex: 0,
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
}));

export default useNavigationStore;
