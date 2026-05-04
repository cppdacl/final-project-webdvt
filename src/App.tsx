import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import RecipeDetail from "./pages/Recipe";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import "./index.css";

export default function App() {
  return (
    <FavoritesProvider>
      <Router basename="/pinoy-recipe-finder/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </Router>
    </FavoritesProvider>
  );
}
