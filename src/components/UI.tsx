import { type ReactNode, useState, useRef, useEffect } from "react";
import { api } from "../api";

const css = {
  btn: (
    variant: "primary" | "ghost" | "danger" = "primary",
    full = false,
  ): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 24px",
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "0.04em",
    transition: "all 0.15s",
    width: full ? "100%" : undefined,
    ...(variant === "primary"
      ? {
          background: "var(--green)",
          color: "var(--bg)",
        }
      : variant === "ghost"
        ? {
            background: "transparent",
            color: "var(--muted)",
            border: "1px solid var(--border)",
          }
        : {
            background: "transparent",
            color: "#e05252",
            border: "1px solid #e05252",
          }),
  }),
  input: (): React.CSSProperties => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 4,
    boxSizing: "border-box",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--fg)",
    fontFamily: "inherit",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.15s",
  }),
};

export const Btn = ({
  children,
  onClick,
  variant = "primary",
  full = false,
  disabled = false,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  full?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    style={{ ...css.btn(variant, full), opacity: disabled ? 0.5 : 1 }}
    onMouseEnter={(e) => {
      if (!disabled)
        (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLButtonElement).style.opacity = disabled
        ? "0.5"
        : "1";
    }}
  >
    {children}
  </button>
);

export const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  step,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: string;
  step?: string;
  autoComplete?: string;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.08em",
        color: "var(--muted)",
        textTransform: "uppercase",
      }}
    >
      {label}
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      min={min}
      step={step}
      autoComplete={autoComplete}
      onChange={(e) => onChange(e.target.value)}
      style={css.input()}
      onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
    />
  </div>
);

export const Card = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      padding: 24,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Modal = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      padding: 16,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: 32,
        width: "100%",
        maxWidth: 440,
        animation: "slideUp 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h2>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--muted)",
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
            padding: 4,
          }}
        >
          ×
        </button>
      </div>
      {children}
    </div>
  </div>
);

export const Toast = ({
  message,
  type,
  onDone,
}: {
  message: string;
  type: "ok" | "err";
  onDone: () => void;
}) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 999,
        background: type === "ok" ? "var(--green)" : "#e05252",
        color: type === "ok" ? "var(--bg)" : "#fff",
        padding: "12px 20px",
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 500,
        animation: "slideUp 0.2s ease",
        maxWidth: 320,
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
      }}
    >
      {message}
    </div>
  );
};

export const UserSearch = ({
  onSelect,
  exclude,
}: {
  onSelect: (username: string, name: string) => void;
  exclude?: string;
}) => {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<
    { _id: string; username: string; fullName: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    timer.current = setTimeout(async () => {
      try {
        const data = await api(`/api/users/search?q=${encodeURIComponent(q)}`);
        setResults(data.filter((u: any) => u.username !== exclude));
        setOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);
  }, [q]);

  return (
    <div style={{ position: "relative" }}>
      <Input
        label="Recipient Username"
        value={q}
        onChange={(v) => {
          setQ(v);
        }}
        placeholder="Start typing..."
      />
      {open && results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 50,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            marginTop: 4,
            overflow: "hidden",
          }}
        >
          {results.map((u) => (
            <div
              key={u._id}
              onClick={() => {
                onSelect(u.username, u.fullName);
                setQ(u.username);
                setOpen(false);
              }}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--border)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                {u.username}
              </span>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>
                {u.fullName}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Spinner = () => (
  <div
    style={{
      width: 20,
      height: 20,
      border: "2px solid var(--border)",
      borderTop: "2px solid var(--green)",
      borderRadius: "50%",
      animation: "spin 0.6s linear infinite",
      display: "inline-block",
    }}
  />
);
