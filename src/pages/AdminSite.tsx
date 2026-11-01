import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { store, useStore } from "../lib/store";
import { pushOrder, dbMode } from "../lib/db";
import { SHOP } from "../config";
import { Dashboard, OrdersPanel, MenuPanel, InventoryPanel, PsychologyPanel, SkillsPanel } from "../components/admin/panels";

const TABS = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "orders", icon: "🧾", label: "Orders" },
  { id: "menu", icon: "🍽", label: "Menu" },
  { id: "inventory", icon: "📦", label: "Inventory" },
  { id: "psychology", icon: "🧠", label: "Psychology Lab" },
  { id: "skills", icon: "✦", label: "Skills" },
];

function LoginGate() {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === SHOP.demoPin) {
      store.login();
    } else {
      setErr(true);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="brand"><span className="logo">☕</span>{SHOP.name}</div>
        <h1>Admin control room</h1>
        <p className="sub">Chief of Staff brief · orders · menu · inventory · psychology lab</p>
        <div className="field">
          <label>Access PIN</label>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setErr(false); }}
            placeholder="••••"
            autoFocus
          />
        </div>
        {err && <div className="err">Wrong PIN — try again.</div>}
        <button className="btn btn-gold btn-block" type="submit">Enter the control room</button>
        <p className="hint">
          Demo PIN: <b>{SHOP.demoPin}</b> · <Link to="/" style={{ color: "var(--gold-2)" }}>← back to storefront</Link>
        </p>
      </form>
    </div>
  );
}

export default function AdminSite() {
  const authed = useStore((s) => s.adminAuthed);
  const orders = useStore((s) => s.orders);
  const [tab, setTab] = useState("dashboard");

  // mirror new orders to Supabase when configured
  useEffect(() => {
    if (dbMode === "supabase") {
      const latest = orders[0];
      if (latest && latest.id.startsWith("o-")) pushOrder(latest);
    }
  }, [orders]);

  if (!authed) return <LoginGate />;

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="brand"><span className="logo">☕</span>{SHOP.name} · Admin</div>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={"side-link" + (tab === t.id ? " active" : "")}
            onClick={() => setTab(t.id)}
          >
            <span className="ico">{t.icon}</span>
            {t.label}
          </button>
        ))}
        <div className="side-foot">
          <Link to="/" style={{ color: "var(--gold-2)" }}>← View storefront</Link>
          <br />
          <button
            className="mini-btn"
            style={{ marginTop: "0.85rem" }}
            onClick={() => store.logout()}
          >
            Sign out
          </button>
          <p style={{ marginTop: "0.9rem", lineHeight: 1.6 }}>
            DB: {dbMode === "supabase" ? "Supabase" : "local demo"}
            <br />Skills: Chief of Staff + Marketing Psychology
          </p>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-head">
          <div>
            <h1>
              {tab === "dashboard" && "Good day, Chef ☕"}
              {tab === "orders" && "Order board"}
              {tab === "menu" && "Menu manager"}
              {tab === "inventory" && "Supplies & inventory"}
              {tab === "psychology" && "Marketing Psychology Lab"}
              {tab === "skills" && "Installed skills"}
            </h1>
            <p>
              {tab === "dashboard" && "Your Chief of Staff brief — what matters today, nothing else."}
              {tab === "orders" && "Advance, complete or cancel every order in one place."}
              {tab === "menu" && "Prices, availability & margins for all 46 items."}
              {tab === "inventory" && "17 supplies tracked against par levels."}
              {tab === "psychology" && "Menu engineering & persuasion plays from live data."}
              {tab === "skills" && "The operating system behind this dashboard."}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.65rem" }}>
            <span className="badge badge-dark">Hobby plan · GitHub auto-deploy</span>
            <span className="tag-live">live</span>
          </div>
        </div>

        {tab === "dashboard" && <Dashboard go={setTab} />}
        {tab === "orders" && <OrdersPanel />}
        {tab === "menu" && <MenuPanel />}
        {tab === "inventory" && <InventoryPanel />}
        {tab === "psychology" && <PsychologyPanel />}
        {tab === "skills" && <SkillsPanel />}
      </main>
    </div>
  );
}
