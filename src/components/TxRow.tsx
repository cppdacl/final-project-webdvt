import type { Transaction } from "../types";

const fmt = (n: number) =>
  "₱" +
  n.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtDate = (d: string) => {
  const date = new Date(d);
  return (
    date.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " · " +
    date.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })
  );
};

const typeLabel: Record<Transaction["type"], string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer_out: "Sent",
  transfer_in: "Received",
};

const typeIcon: Record<Transaction["type"], string> = {
  deposit: "↓",
  withdrawal: "↑",
  transfer_out: "→",
  transfer_in: "←",
};

const typeColor: Record<Transaction["type"], string> = {
  deposit: "#4ade80",
  withdrawal: "#f87171",
  transfer_out: "#f87171",
  transfer_in: "#4ade80",
};

export const TxRow = ({ tx }: { tx: Transaction }) => {
  const isCredit = tx.type === "deposit" || tx.type === "transfer_in";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          flexShrink: 0,
          background: isCredit
            ? "rgba(74,222,128,0.1)"
            : "rgba(248,113,113,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          color: typeColor[tx.type],
          fontWeight: 700,
        }}
      >
        {typeIcon[tx.type]}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
          {typeLabel[tx.type]}
          {tx.counterpartyUsername && (
            <span style={{ color: "var(--muted)", fontWeight: 400 }}>
              {" "}
              {tx.type === "transfer_out" ? "to" : "from"} @
              {tx.counterpartyUsername}
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--muted)",
            display: "flex",
            gap: 8,
          }}
        >
          <span>{fmtDate(tx.createdAt)}</span>
          {tx.note && <span>· {tx.note}</span>}
        </div>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "var(--mono)",
            color: isCredit ? "#4ade80" : "#f87171",
          }}
        >
          {isCredit ? "+" : "−"}
          {fmt(tx.amount)}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--muted)",
            fontFamily: "var(--mono)",
          }}
        >
          {fmt(tx.balanceAfter)}
        </div>
      </div>
    </div>
  );
};
