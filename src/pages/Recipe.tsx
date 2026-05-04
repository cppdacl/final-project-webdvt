import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Recipe } from "../types/Recipe";
import { useFavorites } from "../contexts/FavoritesContext";

export default function Recipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}recipes.json`)
      .then((res) => res.json())
      .then((data: Recipe[]) => {
        const found = data.find((r) => r.id.toString() === id);
        if (found) setRecipe(found);
      });
  }, [id]);

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
        src={
          (recipe as any).image
            ? import.meta.env.BASE_URL +
              (recipe as any).image.replace(/^\/+/, "")
            : "https://placehold.co/600x400"
        }
        alt={recipe.name}
      />
      <p>{recipe.description}</p>
      <h3>Ingredients</h3>
      <ul>
        {(recipe.ingredients || []).map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>
      <h3>Instructions</h3>
      <p>{recipe.instructions}</p>
      <button
        className="recipe-page-button"
        onClick={() => toggleFavorite(recipe)}
      >
        {isFavorite(recipe.id) ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
}
