import { useState, useEffect } from "react";
import { api } from "../api";
import type { Transaction } from "../types";
import { Card, Btn, Spinner } from "../components/UI";
import { TxRow } from "../components/Txrow";

export const HistoryPage = () => {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api(`/api/account/history?page=${page}&limit=20`)
      .then((data) => {
        setTxs(data.transactions);
        setPages(data.pages);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div style={{ maxWidth: 740, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          Transaction History
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted)" }}>
          {total} total transaction{total !== 1 ? "s" : ""}
        </p>
      </div>

      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: 48 }}>
            <Spinner />
          </div>
        ) : txs.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14, padding: "16px 0" }}>
            No transactions yet.
          </p>
        ) : (
          <>
            {txs.map((tx) => (
              <TxRow key={tx._id} tx={tx} />
            ))}
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
          </>
        )}
      </Card>
    </div>
  );
};
