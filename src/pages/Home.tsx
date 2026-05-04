import { useEffect, useState } from "react";
import type { Recipe } from "../types/Recipe";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import { useFavorites } from "../contexts/FavoritesContext";
import { fetchRecipes } from "../api/recipes";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { favorites, showFavorites } = useFavorites();

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch(() => setError("Failed to load recipes."))
      .finally(() => setLoading(false));
  }, []);

  const listToShow = showFavorites ? favorites : recipes;

  const filtered = listToShow.filter((recipe) => {
    const query = search.toLowerCase().trim();
    const searchable = [
      recipe.name,
      recipe.description,
      ...(recipe.ingredients ?? []),
      ...(recipe.instructions ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return searchable.includes(query);
  });

  return (
    <div className="container">
      <SearchBar value={search} onChange={setSearch} />
      {loading && <p className="empty-text">Loading recipes...</p>}
      {error && <p className="empty-text">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="empty-text">
          {showFavorites ? "No favorites found :(" : "No recipes found :("}
        </p>
      )}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}