import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Recipe } from "../types/Recipe";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import { useFavorites } from "../contexts/FavoritesContext";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const { favorites, showFavorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}recipes.json`)
      .then((res) => res.json())
      .then((data: Recipe[]) => setRecipes(data));
  }, []);

  useEffect(() => {
    if (showFavorites && location.pathname !== "/favorites") {
      navigate("/favorites", { replace: true });
    } else if (!showFavorites && location.pathname === "/favorites") {
      navigate("/", { replace: true });
    }
  }, [showFavorites]);

  const listToShow = showFavorites ? favorites : recipes;

  const filtered = listToShow.filter((recipe) => {
    const query = search.toLowerCase().trim();
    const searchable = [
      recipe.name,
      recipe.description,
      recipe.instructions,
      ...(recipe.ingredients || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return searchable.includes(query);
  });

  return (
    <div className="container">
      <SearchBar value={search} onChange={setSearch} />
      {filtered.length === 0 ? (
        <p className="empty-text">
          {showFavorites ? "No favorites found :(" : "No recipes found :("}
        </p>
      ) : (
        <div className="grid">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
