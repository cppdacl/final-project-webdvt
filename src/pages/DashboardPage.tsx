import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import type { Transaction } from "../types";
import {
  Card,
  Modal,
  Input,
  Btn,
  Toast,
  UserSearch,
  Spinner,
} from "../components/UI";
import { TxRow } from "../components/TxRow";

const fmt = (n: number) =>
  "₱" +
  n.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

type ModalType = "deposit" | "withdraw" | "transfer" | null;

export const DashboardPage = () => {
  const { user, refresh } = useAuth();
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loadingTxs, setLoadingTxs] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [toUsername, setToUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);

  const loadTxs = useCallback(async () => {
    setLoadingTxs(true);
    try {
      const data = await api("/api/account/history?limit=5");
      setTxs(data.transactions);
    } catch {
    } finally {
      setLoadingTxs(false);
    }
  }, []);

  useEffect(() => {
    loadTxs();
  }, []);

  const closeModal = () => {
    setModal(null);
    setAmount("");
    setNote("");
    setToUsername("");
    setError("");
  };

  const submit = async () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      if (modal === "deposit")
        await api("/api/account/deposit", {
          method: "POST",
          body: JSON.stringify({ amount: amt, note }),
        });
      else if (modal === "withdraw")
        await api("/api/account/withdraw", {
          method: "POST",
          body: JSON.stringify({ amount: amt, note }),
        });
      else if (modal === "transfer") {
        if (!toUsername) {
          setError("Select a recipient");
          setSubmitting(false);
          return;
        }
        await api("/api/account/transfer", {
          method: "POST",
          body: JSON.stringify({ toUsername, amount: amt, note }),
        });
      }
      await refresh();
      await loadTxs();
      closeModal();
      setToast({
        msg: `${modal === "deposit" ? "Deposit" : modal === "withdraw" ? "Withdrawal" : "Transfer"} successful`,
        type: "ok",
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle: Record<NonNullable<ModalType>, string> = {
    deposit: "Deposit Funds",
    withdraw: "Withdraw Funds",
    transfer: "Send Money",
  };

  return (
    <div style={{ maxWidth: 740, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 8 }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Welcome back
        </p>
        <h1
          style={{
            margin: "4px 0 0",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          {user?.fullName}
        </h1>
      </div>

      <Card
        style={{
          marginBottom: 24,
          marginTop: 20,
          background: "var(--green)",
          border: "none",
        }}
      >
        <p
          style={{
            margin: "0 0 4px",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.5)",
          }}
        >
          Available Balance
        </p>
        <p
          style={{
            margin: "0 0 20px",
            fontSize: 38,
            fontWeight: 800,
            fontFamily: "var(--mono)",
            letterSpacing: "-0.02em",
            color: "var(--bg)",
          }}
        >
          {fmt(user?.balance ?? 0)}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          {(["deposit", "withdraw", "transfer"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setModal(a)}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "capitalize",
                background: "rgba(0,0,0,0.12)",
                color: "var(--bg)",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(0,0,0,0.22)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(0,0,0,0.12)")
              }
            >
              {a === "transfer"
                ? "Send"
                : a.charAt(0).toUpperCase() + a.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700 }}>
          Recent Activity
        </h2>
        <p style={{ margin: "0 0 16px", fontSize: 12, color: "var(--muted)" }}>
          Last 5 transactions
        </p>
        {loadingTxs ? (
          <div style={{ textAlign: "center", padding: 32 }}>
            <Spinner />
          </div>
        ) : txs.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14, padding: "16px 0" }}>
            No transactions yet.
          </p>
        ) : (
          txs.map((tx) => <TxRow key={tx._id} tx={tx} />)
        )}
      </Card>

      {modal && (
        <Modal title={modalTitle[modal]} onClose={closeModal}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {modal === "transfer" && (
              <UserSearch
                exclude={user?.username}
                onSelect={(u) => setToUsername(u)}
              />
            )}
            <Input
              label="Amount (₱)"
              type="number"
              value={amount}
              onChange={setAmount}
              placeholder="0.00"
              min="0.01"
              step="0.01"
            />
            <Input
              label="Note (optional)"
              value={note}
              onChange={setNote}
              placeholder="What's this for?"
            />
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
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <Btn variant="ghost" onClick={closeModal} full>
                Cancel
              </Btn>
              <Btn onClick={submit} disabled={submitting} full>
                {submitting ? "Processing…" : "Confirm"}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

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
