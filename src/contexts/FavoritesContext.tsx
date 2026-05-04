import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Recipe } from "../types/Recipe";
import { fetchFavorites, setFavorite } from "../api/recipes";
import { useNavigate } from "react-router-dom";

interface FavoritesContextType {
  favorites: Recipe[];
  toggleFavorite: (recipe: Recipe) => void;
  isFavorite: (id: string) => boolean;
  showFavorites: boolean;
  toggleShowFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [showFavorites, setShowFavorites] = useState(
    () => window.location.pathname === '/favorites'
  );

  useEffect(() => {
    fetchFavorites().then(setFavorites).catch(() => { });
  }, []);

  const toggleFavorite = (recipe: Recipe) => {
    const shouldFavorite = !recipe.favorite;
    setFavorite(recipe._id, shouldFavorite)
      .then((updated: Recipe) => {
        if (shouldFavorite)
          setFavorites((prev) => [...prev, updated]);
        else
          setFavorites((prev) => prev.filter((r) => r._id !== recipe._id));
      })
      .catch(() => { });
  };

  const isFavorite = (id: string) => favorites.some((r) => r._id === id);

  const toggleShowFavorites = () => {
    setShowFavorites((prev) => {
      const next = !prev;
      if (next) navigate('/favorites');
      else navigate('/');
      return next;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, showFavorites, toggleShowFavorites }}>
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