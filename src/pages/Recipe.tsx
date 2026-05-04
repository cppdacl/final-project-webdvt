import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Recipe } from "../types/Recipe";
import { useFavorites } from "../contexts/FavoritesContext";
import { fetchRecipe } from "../api/recipes";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (!id) return;
    fetchRecipe(id)
      .then(setRecipe)
      .catch(() => setRecipe(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="container empty-text">Loading...</p>;
  if (!recipe) return <p className="container empty-text">Recipe not found.</p>;

  return (
    <div className="container recipe-page-container">
      <div className="recipe-title-wrapper">
        <h2>{recipe.name}</h2>
        <button
          className="recipe-back-button"
          onClick={() => navigate(-1)}
          title="Go Back"
        >
          {"<"}
        </button>
      </div>
      <img
        src={recipe.image || "https://placehold.co/600x400"}
        alt={recipe.name}
        onError={(e) =>
          ((e.currentTarget as HTMLImageElement).src = "https://placehold.co/600x400")
        }
      />
      <p>{recipe.description}</p>
      <h3>Ingredients</h3>
      <ul>
        {(recipe.ingredients ?? []).map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>
      <h3>Instructions</h3>
      <ol>
        {(recipe.instructions ?? []).map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      <div style={{ display: "flex", gap: "12px", marginTop: "1.5rem" }}>
        <button
          className="recipe-page-button"
          onClick={() => toggleFavorite(recipe)}
        >
          {isFavorite(recipe._id) ? "Remove from Favorites" : "Add to Favorites"}
        </button>
        <button
          className="recipe-page-button"
          onClick={() => navigate(`/manage/${recipe._id}`)}
        >
          Edit Recipe
        </button>
      </div>
    </div>
  );
}