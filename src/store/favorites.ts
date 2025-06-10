import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Recipe } from '@/types/recipe';

interface FavoritesState {
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string, recipe?: Recipe) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (recipe) =>
        set((state) => {
          // Prevent duplicates
          if (state.favorites.some((fav) => fav.idMeal === recipe.idMeal)) {
            return state;
          }
          return {
            favorites: [...state.favorites, recipe],
          };
        }),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((recipe) => recipe.idMeal !== id),
        })),
      toggleFavorite: (id, recipe) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(id)) {
          removeFavorite(id);
        } else if (recipe) {
          addFavorite(recipe);
        }
      },
      isFavorite: (id) =>
        get().favorites.some((recipe) => recipe.idMeal === id),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
