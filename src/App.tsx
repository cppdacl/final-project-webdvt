import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HistoryPage } from "./pages/HistoryPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminPage } from "./pages/AdminPage";
import { Spinner } from "./components/UI";

const Inner = () => {
  const { user, loading } = useAuth();
  const [page, setPage] = useState("dashboard");

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Spinner />
      </div>
    );

  if (!user) return <AuthPage />;

  const renderPage = () => {
    switch (page) {
      case "history":
        return <HistoryPage />;
      case "profile":
        return <ProfilePage />;
      case "admin":
        return user.role === "admin" ? <AdminPage /> : <DashboardPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar page={page} setPage={setPage} />
      <main style={{ animation: "fadeIn 0.2s ease" }}>{renderPage()}</main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
}
