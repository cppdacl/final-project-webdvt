import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const Navbar = ({
  page,
  setPage,
}: {
  page: string;
  setPage: (p: string) => void;
}) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItem = (label: string, key: string) => (
    <button
      onClick={() => {
        setPage(key);
        setMenuOpen(false);
      }}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: page === key ? "var(--green)" : "var(--muted)",
        padding: "6px 0",
        transition: "color 0.15s",
      }}
    >
      {label}
    </button>
  );

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 90,
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 28,
            height: 28,
            background: "var(--green)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 900,
            color: "var(--bg)",
          }}
        >
          G
        </span>
        <span
          style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}
        >
          GreenBank
        </span>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {navItem("Dashboard", "dashboard")}
        {navItem("History", "history")}
        {user?.role === "admin" && navItem("Admin", "admin")}
        <div style={{ width: 1, height: 20, background: "var(--border)" }} />
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 4,
              cursor: "pointer",
              padding: "6px 12px",
              fontFamily: "inherit",
              fontSize: 13,
              color: "var(--fg)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontWeight: 600 }}>{user?.username}</span>
            <span style={{ color: "var(--muted)", fontSize: 10 }}>▾</span>
          </button>
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: 8,
                minWidth: 160,
                zIndex: 100,
                animation: "slideUp 0.15s ease",
              }}
            >
              <div
                style={{
                  padding: "6px 10px",
                  fontSize: 12,
                  color: "var(--muted)",
                  borderBottom: "1px solid var(--border)",
                  marginBottom: 6,
                }}
              >
                {user?.fullName}
              </div>
              <button
                onClick={() => {
                  setPage("profile");
                  setMenuOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 10px",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  color: "var(--fg)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--border)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 10px",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  color: "#e05252",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--border)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
