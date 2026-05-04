import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import { Card, Input, Btn, Toast } from "../components/UI";

export const ProfilePage = () => {
  const { user, refresh } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);

  const submit = async () => {
    setError("");
    const body: any = {};

    if (fullName.trim() !== user?.fullName) body.fullName = fullName.trim();

    if (newPin) {
      if (newPin !== confirmPin) {
        setError("New PINs do not match");
        return;
      }
      body.currentPin = currentPin;
      body.newPin = newPin;
    }

    if (!Object.keys(body).length) {
      setError("No changes to save");
      return;
    }

    setLoading(true);
    try {
      await api("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      await refresh();
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
      setToast({ msg: "Profile updated", type: "ok" });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 24px" }}>
      <h1
        style={{
          margin: "0 0 24px",
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "-0.02em",
        }}
      >
        Profile Settings
      </h1>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Username
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 600 }}>
            @{user?.username}
          </p>
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Role
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 15 }}>
            <span
              style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: 4,
                background:
                  user?.role === "admin"
                    ? "rgba(74,222,128,0.15)"
                    : "var(--border)",
                color: user?.role === "admin" ? "var(--green)" : "var(--muted)",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {user?.role}
            </span>
          </p>
        </div>
      </Card>

      <Card>
        <h2 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700 }}>
          Edit Info
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Full Name" value={fullName} onChange={setFullName} />

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
            <p
              style={{
                margin: "0 0 14px",
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              Leave PIN fields blank to keep current PIN
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Input
                label="Current PIN"
                type="password"
                value={currentPin}
                onChange={setCurrentPin}
                placeholder="••••"
              />
              <Input
                label="New PIN"
                type="password"
                value={newPin}
                onChange={setNewPin}
                placeholder="4–6 digits"
              />
              <Input
                label="Confirm New PIN"
                type="password"
                value={confirmPin}
                onChange={setConfirmPin}
                placeholder="Repeat new PIN"
              />
            </div>
          </div>

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
          <Btn onClick={submit} disabled={loading} full>
            {loading ? "Saving…" : "Save Changes"}
          </Btn>
        </div>
      </Card>

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  );
};
