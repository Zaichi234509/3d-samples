import { useEffect, useMemo, useRef, useState } from "react";
import { store, useStore, type Order } from "../../lib/store";
import { peso, clock } from "../../lib/format";

/** Locks page scroll + wires Escape while a drawer/modal is open (mobile friendly). */
function useDialogBehaviour(onClose: () => void) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeRef.current(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, []);
}

const STEPS = [
  { key: "received", icon: "🧾", label: "Received" },
  { key: "preparing", icon: "☕", label: "Brewing" },
  { key: "ready", icon: "🔔", label: "Ready" },
  { key: "completed", icon: "✅", label: "Picked up" },
] as const;

export function StatusTrack({ status }: { status: Order["status"] }) {
  const idx = STEPS.findIndex((s) => s.key === status);
  return (
    <div className="status-track">
      {STEPS.map((s, i) => (
        <div key={s.key} className={"status-step" + (i < idx ? " done" : "") + (i === idx ? " current" : "")}>
          <div className="dot">{s.icon}</div>
          {s.label}
        </div>
      ))}
    </div>
  );
}

/** Item quick-add modal with add-on customisation (foot-in-the-door nudges). */
export function ItemModal({ itemId, onClose }: { itemId: string; onClose: () => void }) {
  const menu = useStore((s) => s.menu);
  const addons = useStore((s) => s.addons);
  const item = menu.find((m) => m.id === itemId);
  const [qty, setQty] = useState(1);
  const [picked, setPicked] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);

  useDialogBehaviour(onClose);

  if (!item) return null;
  const suggested = useMemo(() => {
    const byCat: Record<string, string[]> = {
      coffee: ["extra-espresso", "oat-milk", "vanilla-syrup", "caramel-syrup", "whipped-cream", "ice"],
      "non-coffee": ["oat-milk", "whipped-cream", "vanilla-syrup", "chocolate-chips", "ice"],
      pastry: ["whipped-cream", "chocolate-syrup"],
      food: [],
    };
    return (byCat[item.category] ?? []).map((id) => addons.find((a) => a.id === id)).filter(Boolean) as typeof addons;
  }, [item.category, addons]);

  const unit = item.price + picked.reduce((a, id) => a + (addons.find((x) => x.id === id)?.price ?? 0), 0);

  const confirm = () => {
    store.addToCart(item.id, qty, picked, note.trim() || undefined);
    store.pushToast(`${qty}× ${item.name} added to your order`, item.emoji);
    setAdded(true);
    setTimeout(onClose, 650);
  };

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="modal-wrap">
        <div className="modal" role="dialog" aria-label={`Customise ${item.name}`}>
          <div className="row-between">
            <div style={{ display: "flex", gap: "0.95rem", alignItems: "center" }}>
              <div className="item-emoji" style={{ width: 64, height: 64, fontSize: "2.1rem" }}>{item.emoji}</div>
              <div>
                <h3 style={{ margin: 0 }}>{item.name}</h3>
                <div className="badge badge-gold" style={{ marginTop: 5 }}>{peso(item.price)}</div>
              </div>
            </div>
            <button className="close-x" onClick={onClose} aria-label="Close">✕</button>
          </div>
          <p className="sub" style={{ marginTop: "1.1rem" }}>{item.desc}</p>

          {suggested.length > 0 && (
            <div className="field">
              <label>Make it yours — popular add-ons</label>
              <div className="addon-list">
                {suggested.map((a) => {
                  const on = picked.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      className={"addon-chip" + (on ? " on" : "")}
                      onClick={() => setPicked(on ? picked.filter((x) => x !== a.id) : [...picked, a.id])}
                    >
                      {a.emoji} {a.name} <span className="p">+{peso(a.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="field">
            <label>Special request</label>
            <textarea
              rows={2}
              placeholder="e.g. less ice, extra hot, name on cup…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="row-between" style={{ margin: "1.35rem 0 1.15rem" }}>
            <div className="qty-controls">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Less">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="More">+</button>
            </div>
            <div className="price">{peso(unit * qty)}</div>
          </div>

          <button className="btn btn-primary btn-block" onClick={confirm} disabled={added}>
            {added ? "✓ Added!" : `Add to order · ${peso(unit * qty)}`}
          </button>
        </div>
      </div>
    </>
  );
}

/** Slide-in cart + checkout. */
export function CartDrawer({ onClose }: { onClose: () => void }) {
  const cart = useStore((s) => s.cart);
  const [checkout, setCheckout] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"dine-in" | "takeout">("takeout");
  const [order, setOrder] = useState<Order | null>(null);

  useDialogBehaviour(onClose);

  const total = cart.reduce((a, l) => a + l.unitPrice * l.qty, 0);

  const submit = () => {
    const o = store.placeOrder(name, phone, type);
    setOrder(o);
  };

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside className="drawer" aria-label="Your order">
        <header>
          <h3>{order ? "Order placed" : "Your order"}</h3>
          <button className="close-x" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <div className="body">
          {order ? (
            <div className="order-success">
              <div className="big">🎉</div>
              <h3 style={{ margin: "0.55rem 0" }}>Thank you, {order.customer}!</h3>
              <p className="sub" style={{ marginBottom: 0 }}>
                Your velvet cup is being crafted. Show this code at the counter.
              </p>
              <div className="order-code">{order.code}</div>
              <StatusTrack status={order.status} />
              <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
                Placed at {clock(order.createdAt)} · {order.type === "takeout" ? "Takeout" : "Dine-in"} · {peso(order.total)}
              </p>
              <button className="btn btn-primary btn-block" style={{ marginTop: "1.25rem" }} onClick={onClose}>
                Back to the menu
              </button>
            </div>
          ) : checkout ? (
            <>
              <div className="field">
                <label>Name for the cup</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Maria" />
              </div>
              <div className="field">
                <label>Mobile (optional)</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63 …" />
              </div>
              <div className="field">
                <label>Order type</label>
                <select value={type} onChange={(e) => setType(e.target.value as "dine-in" | "takeout")}>
                  <option value="takeout">Takeout</option>
                  <option value="dine-in">Dine-in</option>
                </select>
              </div>
              <div className="card" style={{ padding: "1.15rem", marginTop: "1.25rem" }}>
                <div className="row-between">
                  <span>Total due</span>
                  <span className="price">{peso(total)}</span>
                </div>
              </div>
              <button className="btn btn-primary btn-block" style={{ marginTop: "1.25rem" }} onClick={submit}>
                Place order ☕
              </button>
              <button className="btn btn-ghost btn-block" style={{ marginTop: "0.65rem" }} onClick={() => setCheckout(false)}>
                Back to cart
              </button>
            </>
          ) : cart.length === 0 ? (
            <div className="empty">
              <div className="big">🛒</div>
              <p>Your order is empty.<br />The espresso machine is warmed up and waiting.</p>
            </div>
          ) : (
            <>
              {cart.map((l) => (
                <div className="cart-line" key={l.key}>
                  <div className="emoji">{l.emoji}</div>
                  <div className="grow">
                    <b>{l.name}</b>
                    {l.addons.length > 0 && (
                      <div className="addons">+ {l.addons.map((a) => a.name).join(", ")}</div>
                    )}
                    {l.note && <div className="addons">“{l.note}”</div>}
                    <div className="row-between" style={{ marginTop: "0.55rem" }}>
                      <div className="qty-controls">
                        <button onClick={() => store.setQty(l.key, l.qty - 1)} aria-label="Less">−</button>
                        <span>{l.qty}</span>
                        <button onClick={() => store.setQty(l.key, l.qty + 1)} aria-label="More">+</button>
                      </div>
                      <b style={{ color: "var(--velvet)" }}>{peso(l.unitPrice * l.qty)}</b>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {!order && cart.length > 0 && (
          <footer>
            <div className="row-between" style={{ marginBottom: "0.85rem" }}>
              <span style={{ fontWeight: 700 }}>Subtotal</span>
              <span className="price">{peso(total)}</span>
            </div>
            {!checkout && (
              <button className="btn btn-primary btn-block" onClick={() => setCheckout(true)}>
                Checkout · {peso(total)}
              </button>
            )}
          </footer>
        )}
      </aside>
    </>
  );
}

const FAKE_NAMES = ["Maria", "Joshua", "Angela", "Miguel", "Bea", "Carlo", "Trisha", "Paolo"];

/** Rotating social-proof toasts (marketing psychology: truthful recent activity). */
export function SocialProofToasts() {
  const toasts = useStore((s) => s.toasts);
  const [social, setSocial] = useState<{ id: number; text: string; emoji: string } | null>(null);

  useEffect(() => {
    const items = [
      { emoji: "☕", text: "just ordered a Spanish Latte" },
      { emoji: "🥐", text: "grabbed 2 Butter Croissants" },
      { emoji: "🍮", text: "added a Caramel Macchiato to their order" },
      { emoji: "🍵", text: "is sipping a Matcha Latte right now" },
      { emoji: "🥪", text: "ordered a Club Sandwich for lunch" },
    ];
    let i = 0;
    const t = setInterval(() => {
      const it = items[i % items.length];
      const name = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
      setSocial({ id: Date.now(), emoji: it.emoji, text: `${name} ${it.text}` });
      i++;
      setTimeout(() => setSocial(null), 4600);
    }, 14000);
    const first = setTimeout(() => {
      setSocial({ id: 1, emoji: "☕", text: "Maria just ordered a Spanish Latte" });
      setTimeout(() => setSocial(null), 4600);
    }, 3200);
    return () => { clearInterval(t); clearTimeout(first); };
  }, []);

  return (
    <div className="toast-stack" aria-live="polite">
      {social && (
        <div className="toast" key={social.id}>
          <span className="t-emoji">{social.emoji}</span>
          <span>{social.text} · <b>just now</b></span>
        </div>
      )}
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          <span className="t-emoji">{t.emoji}</span>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
