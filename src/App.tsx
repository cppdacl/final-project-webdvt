import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RecipeDetail from "./pages/Recipe";
import Manage from "./pages/Manage"
import { FavoritesProvider } from "./contexts/FavoritesContext";
import "./index.css";

export default function App() {
  return (
    <Router basename="/">
      <FavoritesProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/manage/:id" element={<Manage />} />
        </Routes>
      </FavoritesProvider>
    </Router>
  );
}