import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input, Btn } from "../components/UI";

export const AuthPage = () => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    if (tab === "register" && pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }
    setLoading(true);
    try {
      if (tab === "login") await login(username, pin);
      else await register(username, fullName, pin);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 24,
      }}
    >
      <div
        style={{
          marginBottom: 40,
          textAlign: "center",
          animation: "fadeIn 0.4s ease",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            background: "var(--green)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            fontWeight: 900,
            color: "var(--bg)",
            margin: "0 auto 16px",
          }}
        >
          G
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          GreenBank
        </h1>
        <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 14 }}>
          Your digital wallet
        </p>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 32,
          animation: "slideUp 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            marginBottom: 28,
            background: "var(--bg)",
            borderRadius: 6,
            padding: 4,
          }}
        >
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setError("");
              }}
              style={{
                flex: 1,
                padding: "8px 0",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "capitalize",
                transition: "all 0.15s",
                background: tab === t ? "var(--green)" : "transparent",
                color: tab === t ? "var(--bg)" : "var(--muted)",
              }}
            >
              {t === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input
            label="Username"
            value={username}
            onChange={setUsername}
            placeholder="your_username"
            autoComplete="username"
          />
          {tab === "register" && (
            <Input
              label="Full Name"
              value={fullName}
              onChange={setFullName}
              placeholder="Juan Dela Cruz"
            />
          )}
          <Input
            label="PIN"
            type="password"
            value={pin}
            onChange={setPin}
            placeholder="4–6 digits"
            autoComplete={tab === "login" ? "current-password" : "new-password"}
          />
          {tab === "register" && (
            <Input
              label="Confirm PIN"
              type="password"
              value={confirmPin}
              onChange={setConfirmPin}
              placeholder="Repeat PIN"
            />
          )}

          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(224,82,82,0.1)",
                border: "1px solid rgba(224,82,82,0.3)",
                borderRadius: 4,
                fontSize: 13,
                color: "#e05252",
              }}
            >
              {error}
            </div>
          )}

          <Btn full onClick={submit} disabled={loading}>
            {loading
              ? "Please wait…"
              : tab === "login"
                ? "Sign In"
                : "Create Account"}
          </Btn>
        </div>
      </div>
    </div>
  );
};
