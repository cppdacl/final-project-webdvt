import "./SearchBar.css";
import { useFavorites } from "../contexts/FavoritesContext";
import { useNavigate } from "react-router-dom";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  const { showFavorites, toggleShowFavorites, favorites } = useFavorites();
  const navigate = useNavigate();

  return (
    <div className="search-wrapper">
      <input
        className="search-input"
        type="text"
        placeholder="Search Filipino recipes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="favorites-btn-wrapper">
        <div className="favorites-count">
          <h5>{favorites.length}</h5>
        </div>
        <button
          className="favorites-btn"
          onClick={() => {
            toggleShowFavorites();
            if (!showFavorites) navigate('/favorites');
            else navigate('/');
          }}
          title="View Favorites"
          style={{ backgroundColor: showFavorites ? "#4a13af" : undefined }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={showFavorites ? "#fff" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            width="20"
            height="20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 0 1 6.364 0L12 7.636l1.318-1.318a4.5 4.5 0 1 1 6.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 0 1 0-6.364z"
            />
          </svg>
        </button>
      </div>
      <button
        className="favorites-btn"
        onClick={() => navigate('/manage')}
        title="Manage Recipes"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          width="20"
          height="20"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}