import { create } from 'zustand';

const useNavigationStore = create((set) => ({
  currentSection: 'game-tiles',
  currentIndex: 0,
  lastGameTileIndex: 0,
  lastGameTileOffset: 0,
  setNavigation: (section, index) =>
    set((state) => {
      const newState = { currentSection: section, currentIndex: index };
      if (state.currentSection === 'game-tiles') {
        newState.lastGameTileIndex = state.currentIndex;
        newState.lastGameTileOffset = state.currentIndex * (5.2 + 0.5);
      }
      return newState;
    }),
}));

export default useNavigationStore;