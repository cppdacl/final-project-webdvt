import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Recipe } from "../types/Recipe";

interface FavoritesContextType {
  favorites: Recipe[];
  toggleFavorite: (recipe: Recipe) => void;
  isFavorite: (id: number | string) => boolean;
  showFavorites: boolean;
  toggleShowFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites((prev) => {
      const exists = prev.some((r) => r.id === recipe.id);
      if (exists) return prev.filter((r) => r.id !== recipe.id);
      return [...prev, recipe];
    });
  };

  const isFavorite = (id: number | string) =>
    favorites.some((r) => r.id === id);

  const toggleShowFavorites = () => setShowFavorites((prev) => !prev);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        showFavorites,
        toggleShowFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
};
