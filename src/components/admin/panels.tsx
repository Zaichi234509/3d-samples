// ─── Admin panels: Dashboard · Orders · Menu · Inventory · Psychology · Skills
import { useMemo, useState } from "react";
import { store, useStore, type Order } from "../../lib/store";
import { peso, timeAgo, clock, dayKey } from "../../lib/format";
import { SKILLS } from "../../data/skills";
import { MENU } from "../../data/menu";
import { dbMode } from "../../lib/db";
import { StatusTrack } from "../user/ShopModals";

const STATUS_FLOW: Record<string, Order["status"]> = {
  received: "preparing",
  preparing: "ready",
  ready: "completed",
};

/* ══════════════════════════ analytics helpers ══════════════════════════ */

function useAnalytics() {
  const orders = useStore((s) => s.orders);
  return useMemo(() => {
    const today = dayKey();
    const todayOrders = orders.filter((o) => dayKey(o.createdAt) === today && o.status !== "cancelled");
    const todayRevenue = todayOrders.reduce((a, o) => a + o.total, 0);
    const weekOrders = orders.filter((o) => o.status !== "cancelled");
    const weekRevenue = weekOrders.reduce((a, o) => a + o.total, 0);
    const aov = todayOrders.length ? todayRevenue / todayOrders.length : 0;

    // last 7 days revenue
    const days: { key: string; label: string; revenue: number }[] = [];
    for (let d = 6; d >= 0; d--) {
      const k = dayKey(new Date(Date.now() - d * 864e5));
      days.push({
        key: k,
        label: new Date(k).toLocaleDateString("en-PH", { weekday: "short" }),
        revenue: weekOrders.filter((o) => dayKey(o.createdAt) === k).reduce((a, o) => a + o.total, 0),
      });
    }

    // per-item stats for menu engineering
    const stats = new Map<string, { units: number; revenue: number }>();
    for (const o of weekOrders) {
      for (const l of o.lines) {
        const s = stats.get(l.itemId) ?? { units: 0, revenue: 0 };
        s.units += l.qty;
        s.revenue += l.unitPrice * l.qty;
        stats.set(l.itemId, s);
      }
    }
    const items = MENU.map((m) => {
      const s = stats.get(m.id) ?? { units: 0, revenue: 0 };
      const margin = m.price - m.cost;
      return { ...m, units: s.units, revenue: s.revenue, margin };
    });
    const avgUnits = items.reduce((a, i) => a + i.units, 0) / (items.length || 1);
    const avgMargin = items.reduce((a, i) => a + i.margin, 0) / (items.length || 1);

    const quadrant = (i: (typeof items)[number]) => {
      const popular = i.units >= avgUnits;
      const highMargin = i.margin >= avgMargin;
      if (popular && highMargin) return "star";
      if (popular && !highMargin) return "plow";
      if (!popular && highMargin) return "puzzle";
      return "dog";
    };
    const buckets: Record<string, (typeof items)[number][]> = { star: [], plow: [], puzzle: [], dog: [] };
    items.forEach((i) => buckets[quadrant(i)].push(i));

    const topSeller = [...items].sort((a, b) => b.units - a.units)[0];
    return { orders, todayOrders, todayRevenue, weekRevenue, aov, days, buckets, topSeller, weekCount: weekOrders.length };
  }, [orders]);
}

/* ══════════════════════════════ DASHBOARD ═════════════════════════════ */

export function Dashboard({ go }: { go: (tab: string) => void }) {
  const inventory = useStore((s) => s.inventory);
  const a = useAnalytics();
  const lowStock = inventory.filter((i) => i.stock <= i.reorderAt);
  const activeOrders = a.orders.filter((o) => o.status === "received" || o.status === "preparing");
  const maxRev = Math.max(...a.days.map((d) => d.revenue), 1);
  const dow = new Date().toLocaleDateString("en-PH", { weekday: "long" });

  const brief = [
    {
      icon: "🎯",
      triage: "do" as const,
      title: `Push the ${a.topSeller?.name ?? "Spanish Latte"} — it's your #1 with ${a.topSeller?.units ?? 0} sold this week`,
      text: "Feature it in the hero slot and pair it with a pastry for an easy bundle lift (Marketing Psychology: social proof + pairing).",
    },
    {
      icon: "📦",
      triage: lowStock.length ? ("do" as const) : ("defer" as const),
      title: lowStock.length
        ? `Reorder ${lowStock.length} suppl${lowStock.length > 1 ? "ies" : "y"} below par`
        : "All supplies above reorder point",
      text: lowStock.length
        ? lowStock.map((i) => `${i.emoji} ${i.name} (${i.stock} ${i.unit})`).join(" · ")
        : "Stock risk is low — defer purchasing to the next delivery window.",
    },
    {
      icon: "⚡",
      triage: activeOrders.length > 3 ? ("delegate" as const) : ("defer" as const),
      title: `${activeOrders.length} order${activeOrders.length === 1 ? "" : "s"} in flight right now`,
      text: activeOrders.length > 3
        ? "Queue is building — delegate expediting to the floor lead and protect ticket times."
        : "Queue is healthy. Keep the current bar flow.",
    },
    {
      icon: "💸",
      triage: "kill" as const,
      title: "Kill the dead weight on the menu",
      text: `${a.buckets.dog.length} items sit in the Dog quadrant (low popularity × low margin). Retire, re-price or re-name them this week.`,
    },
    {
      icon: "📅",
      triage: "defer" as const,
      title: `${dow} cadence — ${dow === "Monday" ? "set weekly priorities" : dow === "Friday" ? "run the weekly business review" : "mid-week: unblock & adjust"}`,
      text: "Chief of Staff rhythm: Mon priorities → Wed unblock → Fri review & celebrate wins.",
    },
  ];

  return (
    <>
      <div className="kpi-grid">
        <div className="kpi">
          <div className="label">Today's revenue</div>
          <div className="value">{peso(a.todayRevenue)}</div>
          <div className="delta">{a.todayOrders.length} orders today</div>
        </div>
        <div className="kpi">
          <div className="label">7-day revenue</div>
          <div className="value">{peso(a.weekRevenue)}</div>
          <div className="delta">▲ {a.weekCount} total orders</div>
        </div>
        <div className="kpi">
          <div className="label">Average order value</div>
          <div className="value">{peso(Math.round(a.aov))}</div>
          <div className="delta">basket health</div>
        </div>
        <div className="kpi">
          <div className="label">Stock risks</div>
          <div className="value">{lowStock.length}</div>
          <div className={"delta" + (lowStock.length ? " down" : "")}>
            {lowStock.length ? "needs reordering" : "all above par"}
          </div>
        </div>
      </div>

      <div className="panel-grid">
        <div className="panel">
          <div className="row-between">
            <div>
              <h2>📋 Chief of Staff · Daily Brief</h2>
              <p className="panel-sub">
                One page that matters — auto-generated from live orders, revenue & stock.
                Triage every item: Do / Delegate / Defer / Kill.
              </p>
            </div>
            <span className="tag-live">live</span>
          </div>
          {brief.map((b) => (
            <div className="brief-item" key={b.title}>
              <div className="b-icon">{b.icon}</div>
              <div className="grow">
                <b>{b.title}</b>
                <p>{b.text}</p>
              </div>
              <span className={"triage " + b.triage}>{b.triage}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}>
          <div className="panel">
            <h2>📈 Revenue · last 7 days</h2>
            <p className="panel-sub">Friday review metric — watch the trend, not single days.</p>
            <div className="spark-bars">
              {a.days.map((d) => (
                <div
                  key={d.key}
                  className="bar"
                  style={{ height: `${Math.max(6, (d.revenue / maxRev) * 100)}%` }}
                  title={`${d.label}: ${peso(d.revenue)}`}
                >
                  <span>{d.revenue > 0 ? Math.round(d.revenue / 100) / 10 + "k" : ""}</span>
                </div>
              ))}
            </div>
            <div className="spark-labels">
              {a.days.map((d) => <span key={d.key}>{d.label}</span>)}
            </div>
          </div>

          <div className="panel">
            <h2>🔥 Right now</h2>
            <p className="panel-sub">Live order ticker — the floor's single source of truth.</p>
            {a.orders.filter((o) => o.status === "received" || o.status === "preparing").slice(0, 4).map((o) => (
              <div className="brief-item" key={o.id}>
                <div className="b-icon">{o.status === "received" ? "🧾" : "☕"}</div>
                <div className="grow">
                  <b>{o.code} · {o.customer}</b>
                  <p>{o.lines.map((l) => `${l.qty}× ${l.name}`).join(", ")} · {peso(o.total)} · {timeAgo(o.createdAt)}</p>
                </div>
                <button className="mini-btn gold" onClick={() => store.setOrderStatus(o.id, STATUS_FLOW[o.status] ?? "completed")}>
                  Advance →
                </button>
              </div>
            ))}
            {a.orders.every((o) => o.status !== "received" && o.status !== "preparing") && (
              <p className="muted-d">No live orders — the bar is clear. ☕</p>
            )}
            <button className="mini-btn" style={{ marginTop: "0.85rem" }} onClick={() => go("orders")}>
              Open order board
            </button>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>🧠 Psychology snapshot</h2>
        <p className="panel-sub">
          Menu engineering classifies every item by popularity × margin. Visit the Psychology Lab for the full matrix.
        </p>
        <div className="matrix">
          <div className="quad star">
            <h3>⭐ Stars</h3>
            <p className="q-sub">High popularity × high margin — protect & feature them.</p>
            <div className="q-items">
              {a.buckets.star.slice(0, 8).map((i) => <span className="q-item" key={i.id}>{i.name}</span>)}
              {a.buckets.star.length === 0 && <span className="q-item">—</span>}
            </div>
          </div>
          <div className="quad plow">
            <h3>🐴 Plowhorses</h3>
            <p className="q-sub">Popular but thin margin — bundle, don't discount.</p>
            <div className="q-items">
              {a.buckets.plow.slice(0, 8).map((i) => <span className="q-item" key={i.id}>{i.name}</span>)}
              {a.buckets.plow.length === 0 && <span className="q-item">—</span>}
            </div>
          </div>
          <div className="quad puzzle">
            <h3>🧩 Puzzles</h3>
            <p className="q-sub">High margin, low popularity — reposition & rename.</p>
            <div className="q-items">
              {a.buckets.puzzle.slice(0, 8).map((i) => <span className="q-item" key={i.id}>{i.name}</span>)}
              {a.buckets.puzzle.length === 0 && <span className="q-item">—</span>}
            </div>
          </div>
          <div className="quad dog">
            <h3>🐕 Dogs</h3>
            <p className="q-sub">Low × low — retire or reinvent this week.</p>
            <div className="q-items">
              {a.buckets.dog.slice(0, 8).map((i) => <span className="q-item" key={i.id}>{i.name}</span>)}
              {a.buckets.dog.length === 0 && <span className="q-item">—</span>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════ ORDERS ═══════════════════════════════ */

export function OrdersPanel() {
  const orders = useStore((s) => s.orders);
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const shown = orders.filter((o) => filter === "all" || o.status === filter);

  return (
    <div className="panel">
      <div className="row-between" style={{ marginBottom: "1.15rem", flexWrap: "wrap" }}>
        <div>
          <h2>🧾 Order board</h2>
          <p className="panel-sub" style={{ margin: 0 }}>
            {orders.length} orders total · {orders.filter((o) => o.status === "received" || o.status === "preparing").length} live
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap" }}>
          {(["all", "received", "preparing", "ready", "completed"] as const).map((f) => (
            <button key={f} className={"mini-btn" + (filter === f ? " gold" : "")} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th><th>Guest</th><th>Items</th><th>Type</th><th>Total</th><th>Status</th><th>Placed</th><th></th>
            </tr>
          </thead>
          <tbody>
            {shown.slice(0, 40).map((o) => (
              <tr key={o.id}>
                <td><b>{o.code}</b></td>
                <td>{o.customer}</td>
                <td style={{ maxWidth: 260 }}>
                  {o.lines.map((l) => `${l.qty}× ${l.name}`).join(", ")}
                </td>
                <td>{o.type}</td>
                <td><b>{peso(o.total)}</b></td>
                <td><span className={"status-pill status-" + o.status}>{o.status}</span></td>
                <td className="muted-d">{timeAgo(o.createdAt)} · {clock(o.createdAt)}</td>
                <td>
                  {STATUS_FLOW[o.status] && (
                    <button
                      className="mini-btn gold"
                      onClick={() => store.setOrderStatus(o.id, STATUS_FLOW[o.status])}
                    >
                      {o.status === "received" ? "Start brewing" : o.status === "preparing" ? "Mark ready" : "Complete"}
                    </button>
                  )}
                  {o.status !== "cancelled" && o.status !== "completed" && (
                    <button
                      className="mini-btn danger"
                      style={{ marginLeft: 6 }}
                      onClick={() => store.setOrderStatus(o.id, "cancelled")}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {shown.length === 0 && (
        <div className="empty">
          <div className="big">🗒️</div>
          <p>No {filter === "all" ? "" : filter + " "}orders yet.</p>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════ MENU ════════════════════════════════ */

export function MenuPanel() {
  const menu = useStore((s) => s.menu);
  const [editPrice, setEditPrice] = useState<{ id: string; value: string } | null>(null);

  return (
    <div className="panel">
      <h2>🍽 Menu manager</h2>
      <p className="panel-sub">
        Toggle availability (86 an item), adjust pricing, watch margins. Changes apply instantly on the storefront.
      </p>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Item</th><th>Category</th><th>Price</th><th>Est. cost</th><th>Margin</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((m) => {
              const marginPct = Math.round(((m.price - m.cost) / m.price) * 100);
              return (
                <tr key={m.id}>
                  <td>{m.emoji} <b>{m.name}</b></td>
                  <td className="muted-d">{m.category}</td>
                  <td>
                    {editPrice?.id === m.id ? (
                      <span style={{ display: "flex", gap: 6 }}>
                        <input
                          type="number"
                          value={editPrice.value}
                          onChange={(e) => setEditPrice({ id: m.id, value: e.target.value })}
                          style={{ width: 84, padding: "0.35rem 0.55rem", borderRadius: 8, border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.08)", color: "#fff" }}
                        />
                        <button className="mini-btn gold" onClick={() => { store.setPrice(m.id, Number(editPrice.value)); setEditPrice(null); }}>
                          Save
                        </button>
                      </span>
                    ) : (
                      <b>{peso(m.price)}</b>
                    )}
                  </td>
                  <td className="muted-d">{peso(m.cost)}</td>
                  <td>
                    <span className={"status-pill " + (marginPct >= 65 ? "status-ready" : marginPct >= 55 ? "status-preparing" : "status-cancelled")}>
                      {marginPct}%
                    </span>
                  </td>
                  <td>
                    <span className={"status-pill " + (m.available ? "status-ready" : "status-cancelled")}>
                      {m.available ? "live" : "86'd"}
                    </span>
                  </td>
                  <td>
                    <button className="mini-btn" onClick={() => setEditPrice({ id: m.id, value: String(m.price) })}>
                      Price
                    </button>
                    <button
                      className={"mini-btn" + (m.available ? " danger" : " gold")}
                      style={{ marginLeft: 6 }}
                      onClick={() => store.toggleAvailability(m.id)}
                    >
                      {m.available ? "86 it" : "Restore"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════ INVENTORY ═════════════════════════════ */

export function InventoryPanel() {
  const inventory = useStore((s) => s.inventory);
  const low = inventory.filter((i) => i.stock <= i.reorderAt);

  return (
    <>
      {low.length > 0 && (
        <div className="panel" style={{ marginBottom: "1.35rem", borderColor: "rgba(224,144,112,0.4)" }}>
          <h2>⚠️ Reorder radar</h2>
          <p className="panel-sub">
            Chief of Staff · Risk Radar — {low.length} suppl{low.length > 1 ? "ies are" : "y is"} at or below the reorder point.
          </p>
          <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
            {low.map((i) => (
              <span key={i.id} className="badge badge-red" style={{ fontSize: "0.82rem", textTransform: "none", letterSpacing: 0, padding: "0.55rem 0.95rem" }}>
                {i.emoji} {i.name} — {i.stock} {i.unit} left (reorder at {i.reorderAt})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="panel">
        <h2>📦 Supplies & inventory</h2>
        <p className="panel-sub">
          Track par levels for every supply in the shop. Bars go amber below par, red at the reorder point.
        </p>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Supply</th><th>Stock level</th><th>On hand</th><th>Par</th><th>Reorder at</th><th>Unit cost</th><th>Adjust</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((i) => {
                const pct = Math.min(100, Math.round((i.stock / i.par) * 100));
                const level = i.stock <= i.reorderAt ? "low" : i.stock < i.par * 0.6 ? "warn" : "";
                return (
                  <tr key={i.id}>
                    <td>{i.emoji} <b>{i.name}</b></td>
                    <td>
                      <div className={"stock-bar " + level}><i style={{ width: `${pct}%` }} /></div>
                    </td>
                    <td><b>{i.stock}</b> {i.unit}</td>
                    <td className="muted-d">{i.par} {i.unit}</td>
                    <td className="muted-d">{i.reorderAt} {i.unit}</td>
                    <td className="muted-d">{peso(i.costPerUnit)}/{i.unit}</td>
                    <td>
                      <button className="mini-btn" onClick={() => store.adjustStock(i.id, -1)}>−1</button>
                      <button className="mini-btn" style={{ marginLeft: 5 }} onClick={() => store.adjustStock(i.id, 1)}>+1</button>
                      <button className="mini-btn gold" style={{ marginLeft: 5 }} onClick={() => store.adjustStock(i.id, i.par - i.stock)}>
                        Restock to par
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════ PSYCHOLOGY LAB ═══════════════════════════ */

export function PsychologyPanel() {
  const a = useAnalytics();
  const totalUnits = a.buckets.star.concat(a.buckets.plow, a.buckets.puzzle, a.buckets.dog).reduce((x, i) => x + i.units, 0) || 1;

  return (
    <>
      <div className="panel" style={{ marginBottom: "1.35rem" }}>
        <h2>🧠 Menu Engineering Matrix</h2>
        <p className="panel-sub">
          Classic hospitality psychology (Kasavana & Smith): plot popularity (units sold) against contribution
          margin (price − cost). Each quadrant gets exactly one strategic move.
        </p>
        <div className="matrix">
          <div className="quad star">
            <h3>⭐ Stars · high popularity × high margin</h3>
            <p className="q-sub"><b>Move:</b> protect quality, feature in the hero, never discount.</p>
            <div className="q-items">
              {a.buckets.star.map((i) => (
                <span className="q-item" key={i.id} title={`${i.units} sold · ${peso(i.margin)} margin`}>
                  {i.name} · {i.units}
                </span>
              ))}
            </div>
          </div>
          <div className="quad plow">
            <h3>🐴 Plowhorses · popular × thin margin</h3>
            <p className="q-sub"><b>Move:</b> bundle with high-margin sides, re-engineer the recipe, slight price lift.</p>
            <div className="q-items">
              {a.buckets.plow.map((i) => (
                <span className="q-item" key={i.id} title={`${i.units} sold · ${peso(i.margin)} margin`}>
                  {i.name} · {i.units}
                </span>
              ))}
            </div>
          </div>
          <div className="quad puzzle">
            <h3>🧩 Puzzles · quiet × high margin</h3>
            <p className="q-sub"><b>Move:</b> rename, re-plate, staff-recommend; add photos & descriptions.</p>
            <div className="q-items">
              {a.buckets.puzzle.map((i) => (
                <span className="q-item" key={i.id} title={`${i.units} sold · ${peso(i.margin)} margin`}>
                  {i.name} · {i.units}
                </span>
              ))}
            </div>
          </div>
          <div className="quad dog">
            <h3>🐕 Dogs · quiet × thin margin</h3>
            <p className="q-sub"><b>Move:</b> retire, or give one reinvention cycle (new name + story).</p>
            <div className="q-items">
              {a.buckets.dog.map((i) => (
                <span className="q-item" key={i.id} title={`${i.units} sold · ${peso(i.margin)} margin`}>
                  {i.name} · {i.units}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="panel-sub" style={{ marginTop: "1.15rem", marginBottom: 0 }}>
          Popularity threshold: items above the weekly average of{" "}
          <b>{Math.round(totalUnits / 46)} units</b>. Margin threshold: average contribution margin.
        </p>
      </div>

      <div className="panel-grid">
        <div className="panel">
          <h2>🪄 Persuasion checklist (storefront audit)</h2>
          <p className="panel-sub">Marketing Psychology principles — live status of each nudge on the user site.</p>
          {[
            { ok: true, t: "Social proof", d: "Live 'recently ordered' toasts + bestseller badges from real data." },
            { ok: true, t: "Truthful scarcity", d: "'Only N left today' on pastries, backed by inventory levels." },
            { ok: true, t: "Anchoring", d: "Signature tier (Caramel Macchiato ₱185, Cheesecake ₱195) anchors the ladder." },
            { ok: true, t: "Foot-in-the-door", d: "Low-commitment add-on chips pre-surfaced in every item modal." },
            { ok: true, t: "Loss aversion", d: "'Skip the line' framing — the cost of waiting, made visible." },
            { ok: true, t: "Charm pricing", d: "Clean, consistent ₱ endings build trust (no .99 noise)." },
          ].map((x) => (
            <div className="brief-item" key={x.t}>
              <div className="b-icon">{x.ok ? "✅" : "⬜"}</div>
              <div className="grow">
                <b>{x.t}</b>
                <p>{x.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>💡 Recommended plays</h2>
          <p className="panel-sub">Auto-generated from this week's numbers.</p>
          {[
            {
              icon: "🎁",
              t: `Bundle ${a.buckets.plow[0]?.name ?? "the top Plowhorse"} with a high-margin add-on`,
              d: "Example: 'Latte + Butter Croissant for ₱255' lifts AOV while protecting margin.",
            },
            {
              icon: "📸",
              t: `Rescue ${a.buckets.puzzle[0]?.name ?? "a Puzzle item"} with a rename & story`,
              d: "Puzzles are profitable but quiet — a menu photo and a one-line origin story fix that.",
            },
            {
              icon: "⭐",
              t: `Feature ${a.topSeller?.name ?? "the Star"} in the hero slot today`,
              d: "Stars sell themselves — give them the space and let social proof compound.",
            },
            {
              icon: "🌙",
              t: "After-3PM 'sunset' pricing on pastries",
              d: "Loss-aversion + scarcity done honestly: discount the remaining batch before close, zero waste.",
            },
          ].map((p) => (
            <div className="brief-item" key={p.t}>
              <div className="b-icon">{p.icon}</div>
              <div className="grow">
                <b>{p.t}</b>
                <p>{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════ SKILLS ═══════════════════════════════ */

export function SkillsPanel() {
  return (
    <>
      {SKILLS.map((skill) => (
        <div className="panel" key={skill.id} style={{ marginBottom: "1.35rem" }}>
          <div className="row-between" style={{ flexWrap: "wrap" }}>
            <div>
              <h2>{skill.icon} {skill.name}</h2>
              <p className="panel-sub" style={{ marginBottom: 0 }}>{skill.tagline}</p>
            </div>
            <span className="badge badge-dark">installed skill</span>
          </div>
          <p className="panel-sub" style={{ marginTop: "1.05rem" }}>{skill.summary}</p>

          <div className="skill-card">
            {skill.principles.map((p, idx) => (
              <div className="principle-row" key={p.title}>
                <div className="num">{String(idx + 1).padStart(2, "0")}</div>
                <div>
                  <b>{p.title}</b>
                  <p>{p.description}</p>
                  <div className="applied">▸ {p.appliedInApp}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", marginTop: "1.15rem" }}>
            {skill.frameworks.map((f) => (
              <span key={f.name} className="badge badge-dark" title={f.how} style={{ textTransform: "none", letterSpacing: 0, padding: "0.55rem 0.95rem", fontSize: "0.82rem" }}>
                ⚙ {f.name}
              </span>
            ))}
          </div>
        </div>
      ))}

      <div className="panel">
        <h2>🔌 Data layer</h2>
        <p className="panel-sub" style={{ marginBottom: "0.75rem" }}>
          Current mode: <b style={{ color: "var(--gold-2)" }}>{dbMode === "supabase" ? "Supabase Postgres" : "Local demo store (localStorage)"}</b>.
          {" "}Set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (see supabase/schema.sql) to persist orders to a real database.
        </p>
        <StatusTrack status="preparing" />
      </div>
    </>
  );
}
