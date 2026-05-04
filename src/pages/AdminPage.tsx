import { useState, useEffect } from "react";
import { api } from "../api";
import type { User, Transaction } from "../types";
import { Card, Btn, Spinner, Toast } from "../components/UI";
import { TxRow } from "../components/TxRow";

const fmt = (n: number) =>
  "₱" +
  n.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const AdminPage = () => {
  const [tab, setTab] = useState<"users" | "txs">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      if (tab === "users") {
        const data = await api(`/api/admin/users?page=${page}&limit=20`);
        setUsers(data.users);
        setPages(data.pages);
        setTotal(data.total);
      } else {
        const data = await api(`/api/admin/transactions?page=${page}&limit=20`);
        setTxs(data.transactions);
        setPages(data.pages);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [tab, page]);

  const toggleStatus = async (u: User) => {
    const next = u.status === "active" ? "suspended" : "active";
    try {
      await api(`/api/admin/users/${u._id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: next }),
      });
      setToast({ msg: `${u.username} ${next}`, type: "ok" });
      load();
    } catch (e: any) {
      setToast({ msg: e.message, type: "err" });
    }
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>
      <h1
        style={{
          margin: "0 0 24px",
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "-0.02em",
        }}
      >
        Admin Panel
      </h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {(["users", "txs"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setPage(1);
            }}
            style={{
              padding: "8px 20px",
              border: "1px solid var(--border)",
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 600,
              background: tab === t ? "var(--green)" : "transparent",
              color: tab === t ? "var(--bg)" : "var(--muted)",
              transition: "all 0.15s",
            }}
          >
            {t === "users" ? "Users" : "Transactions"}
          </button>
        ))}
        <span
          style={{
            marginLeft: "auto",
            fontSize: 13,
            color: "var(--muted)",
            alignSelf: "center",
          }}
        >
          {total} total
        </span>
      </div>

      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: 48 }}>
            <Spinner />
          </div>
        ) : tab === "users" ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 120px 100px 80px",
                gap: 8,
                padding: "0 0 10px",
                borderBottom: "1px solid var(--border)",
                marginBottom: 4,
              }}
            >
              {["Username", "Full Name", "Balance", "Status", ""].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            {users.map((u) => (
              <div
                key={u._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 120px 100px 80px",
                  gap: 8,
                  padding: "12px 0",
                  borderBottom: "1px solid var(--border)",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  @{u.username}
                </span>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>
                  {u.fullName}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontFamily: "var(--mono)",
                    fontWeight: 600,
                  }}
                >
                  {fmt(u.balance)}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: u.status === "active" ? "var(--green)" : "#f87171",
                  }}
                >
                  {u.status}
                </span>
                <button
                  onClick={() => toggleStatus(u)}
                  style={{
                    padding: "4px 10px",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 11,
                    fontWeight: 600,
                    background: "transparent",
                    color: u.status === "active" ? "#f87171" : "var(--green)",
                    transition: "all 0.15s",
                  }}
                >
                  {u.status === "active" ? "Suspend" : "Activate"}
                </button>
              </div>
            ))}
          </>
        ) : (
          txs.map((tx) => <TxRow key={tx._id} tx={tx} />)
        )}

        {pages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid var(--border)",
            }}
          >
            <Btn
              variant="ghost"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              ← Prev
            </Btn>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>
              Page {page} of {pages}
            </span>
            <Btn
              variant="ghost"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === pages}
            >
              Next →
            </Btn>
          </div>
        )}
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
