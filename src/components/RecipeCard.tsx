import { useNavigate } from "react-router-dom";
import type { Recipe } from "../types/Recipe";
import "./RecipeCard.css";

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  const navigate = useNavigate();
  return (
    <div className="card">
      <img
        className="card-image"
        src={
          (recipe as any).image
            ? import.meta.env.BASE_URL +
              (recipe as any).image.replace(/^\/+/, "")
            : "https://placehold.co/600x400"
        }
        alt={recipe.name}
        onError={(e) =>
          ((e.currentTarget as HTMLImageElement).src =
            "https://placehold.co/600x400")
        }
      />
      <div className="card-content">
        <h3>{recipe.name}</h3>
        <p>{recipe.description}</p>
        <button
          className="button"
          onClick={() => navigate(`/recipe/${recipe.id}`)}
        >
          View Recipe
        </button>
      </div>
    </div>
  );
}
