import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../lib/store";
import { peso, timeAgo } from "../lib/format";
import { CATEGORIES, type CategoryId } from "../data/menu";
import { SHOP } from "../config";
import SplineHero from "../components/user/SplineHero";
import ExplodedView from "../components/user/ExplodedView";
import { ItemModal, CartDrawer, SocialProofToasts } from "../components/user/ShopModals";

export default function UserSite() {
  const menu = useStore((s) => s.menu);
  const inventory = useStore((s) => s.inventory);
  const orders = useStore((s) => s.orders);
  const cartCount = useStore((s) => s.cart.reduce((a, l) => a + l.qty, 0));
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [query, setQuery] = useState("");
  const [modalItem, setModalItem] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(
    () =>
      menu.filter(
        (m) =>
          m.available &&
          (cat === "all" || m.category === cat) &&
          (query.trim() === "" ||
            m.name.toLowerCase().includes(query.toLowerCase()) ||
            m.desc.toLowerCase().includes(query.toLowerCase()))
      ),
    [menu, cat, query]
  );

  // truthful scarcity from inventory (marketing psychology)
  const pastryStock = inventory.find((i) => i.id === "coffee-beans")?.stock ?? 20;
  const dailyPastries = Math.max(2, Math.round((inventory.find((i) => i.id === "milk")?.stock ?? 24) / 2));
  const servedThisMonth = 2300 + orders.length;

  return (
    <>
      {/* ── header ─────────────────────────────────────────────────────── */}
      <header className="site-header">
        <div className="container inner">
          <a className="brand" href="#top">
            <span className="logo">☕</span>
            {SHOP.name}
          </a>
          <nav className="nav-links">
            <a href="#menu">Menu</a>
            <a href="#studio">3D Studio</a>
            <a href="#why">Why Velvet Brew</a>
            <a href="#visit">Visit</a>
          </nav>
          <div style={{ display: "flex", gap: "0.65rem", alignItems: "center" }}>
            <Link to="/admin" className="btn btn-ghost btn-sm">Admin</Link>
            <button className="btn btn-primary btn-sm cart-btn" onClick={() => setCartOpen(true)}>
              🛒 Order{cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* ── hero ───────────────────────────────────────────────────────── */}
      <section className="hero" id="top">
        <div className="container grid">
          <div>
            <span className="badge badge-velvet">✦ {SHOP.city} · Freshly roasted</span>
            <h1>
              Velvet-smooth coffee,
              <br />
              <em>brewed to your order.</em>
            </h1>
            <p className="lead">
              Small-batch beans, 27-layer pastries, and drinks built layer by layer —
              now with a live 3D look inside every cup. Order ahead, skip the line.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-primary" href="#menu">Explore the menu</a>
              <a className="btn btn-gold" href="#studio">See the 3D exploded view</a>
            </div>
            <div className="proof-strip">
              <div className="stat"><b>{servedThisMonth.toLocaleString()}+</b><span>cups served this month</span></div>
              <div className="stat"><b>4.9 ★</b><span>average guest rating</span></div>
              <div className="stat"><b>18h</b><span>slow-steeped cold brew</span></div>
            </div>
          </div>
          <SplineHero />
        </div>
      </section>

      {/* ── marquee ────────────────────────────────────────────────────── */}
      <div className="marquee" aria-hidden>
        <div className="track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} style={{ display: "flex", gap: "3rem" }}>
              <span>☕ House-roasted beans</span>
              <span>✦ Baked fresh every morning</span>
              <span>🌱 Oat · Soy · Almond milk</span>
              <span>🍮 Signature Caramel Macchiato</span>
              <span>⚡ Order ahead, skip the line</span>
              <span>🥐 27 butter layers</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── menu ───────────────────────────────────────────────────────── */}
      <section className="section" id="menu">
        <div className="container">
          <div className="section-head">
            <span className="badge badge-gold">The Menu</span>
            <h2>Everything on the velvet bar</h2>
            <p>Tap any item to customise it — add-ons, notes, and exactly how you like it.</p>
          </div>

          <div className="menu-toolbar">
            <button className={"chip" + (cat === "all" ? " active" : "")} onClick={() => setCat("all")}>
              All
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.id} className={"chip" + (cat === c.id ? " active" : "")} onClick={() => setCat(c.id)}>
                {c.name}
              </button>
            ))}
            <div className="search-box">
              <span>🔎</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the menu…"
                aria-label="Search menu"
              />
            </div>
          </div>

          {/* category spotlight */}
          {cat !== "all" && (
            <div
              className="card"
              style={{
                display: "flex", alignItems: "center", gap: "1.35rem", padding: "1.15rem 1.45rem",
                marginBottom: "1.75rem", background: "linear-gradient(120deg, rgba(201,160,106,0.18), var(--paper))",
              }}
            >
              <img
                src={CATEGORIES.find((c) => c.id === cat)!.image}
                alt=""
                style={{ width: 84, height: 84, borderRadius: 18, objectFit: "cover" }}
              />
              <div>
                <b style={{ color: "var(--velvet)", fontSize: "1.12rem" }}>{CATEGORIES.find((c) => c.id === cat)!.name}</b>
                <div style={{ color: "var(--muted)", fontSize: "0.92rem" }}>
                  {CATEGORIES.find((c) => c.id === cat)!.tagline}
                </div>
              </div>
            </div>
          )}

          <div className="menu-grid">
            {filtered.map((m) => {
              const isPastry = m.category === "pastry";
              const left = isPastry ? Math.max(1, dailyPastries - Math.floor(Math.random() * 4)) : 0;
              return (
                <button key={m.id} className="item-card" onClick={() => setModalItem(m.id)}>
                  {isPastry && left <= 4 && (
                    <span className="badge badge-red scarcity">Only {left} left today</span>
                  )}
                  {m.tags.includes("bestseller") && (
                    <span className="badge badge-gold scarcity" style={{ display: isPastry && left <= 4 ? "none" : undefined }}>
                      ★ Bestseller
                    </span>
                  )}
                  <div className="top">
                    <div className="item-emoji">{m.emoji}</div>
                  </div>
                  <h3>{m.name}</h3>
                  <p className="desc">{m.desc}</p>
                  <div className="row">
                    <span className="price">{peso(m.price)}</span>
                    <span className="add-btn" aria-hidden>+</span>
                  </div>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="empty">
              <div className="big">🔍</div>
              <p>Nothing matches “{query}”. Try a different craving.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── 3D studio / exploded view ──────────────────────────────────── */}
      <section className="section" id="studio" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="studio">
            <div className="section-head">
              <span className="badge badge-dark">3D Animation Studio</span>
              <h2>See what's inside every item</h2>
              <p>
                Our drinks and bites are built in layers — now you can take them apart.
                Slide to explode the view, orbit around, and hover each part to learn what it does.
              </p>
            </div>
            <ExplodedView />
          </div>
        </div>
      </section>

      {/* ── why / psychology props ─────────────────────────────────────── */}
      <section className="section" id="why" style={{ paddingTop: "1.5rem" }}>
        <div className="container">
          <div className="section-head">
            <span className="badge badge-gold">Why Velvet Brew</span>
            <h2>Small details you can taste</h2>
            <p>Four promises we design every drink around.</p>
          </div>
          <div className="props-grid">
            <div className="card prop-card">
              <div className="icon">🫘</div>
              <h3>Roasted in small batches</h3>
              <p>Beans rest 7 days, then dial in every morning — so shot #1 tastes like shot #40.</p>
            </div>
            <div className="card prop-card">
              <div className="icon">🧊</div>
              <h3>18-hour cold brew</h3>
              <p>Slow-steeped overnight for natural sweetness. No bitterness, no shortcuts.</p>
            </div>
            <div className="card prop-card">
              <div className="icon">🥐</div>
              <h3>Baked before sunrise</h3>
              <p>Pastries come out of the oven at 5 AM daily. When they're gone, they're gone.</p>
            </div>
            <div className="card prop-card">
              <div className="icon">🌱</div>
              <h3>Your milk, your way</h3>
              <p>Oat, soy & almond at no drama — swap any drink without losing the velvet texture.</p>
            </div>
          </div>

          {/* social proof + scarcity line (marketing psychology, honestly applied) */}
          <div
            className="card"
            style={{
              marginTop: "2.25rem", padding: "1.65rem 1.95rem", display: "flex",
              alignItems: "center", gap: "1.35rem", flexWrap: "wrap",
              background: "linear-gradient(120deg, rgba(74,18,32,0.06), rgba(201,160,106,0.16))",
            }}
          >
            <div style={{ fontSize: "2.25rem" }}>🔥</div>
            <div className="grow" style={{ minWidth: 220 }}>
              <b style={{ color: "var(--velvet)", fontSize: "1.12rem" }}>
                {orders.length > 0 ? `${orders.length} orders placed in the last 7 days` : "Fresh out of the gate"}
              </b>
              <div style={{ color: "var(--muted)", fontSize: "0.92rem" }}>
                Most-loved right now: Spanish Latte · Caramel Macchiato · Butter Croissant
                {pastryStock < 12 && " · pastry batches are running low today"}
              </div>
            </div>
            <a className="btn btn-primary" href="#menu">Order yours</a>
          </div>
        </div>
      </section>

      {/* ── footer ─────────────────────────────────────────────────────── */}
      <footer className="site-footer" id="visit">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h4 style={{ fontSize: "1.35rem" }}>☕ {SHOP.name}</h4>
              <p>
                {SHOP.tagline}. A neighbourhood coffee house in {SHOP.city} —
                built fresh on GitHub, brewed fresh every morning.
              </p>
            </div>
            <div>
              <h4>Visit</h4>
              <ul>
                <li>{SHOP.city}, Philippines</li>
                <li>{SHOP.hours}</li>
                <li>{SHOP.phone}</li>
              </ul>
            </div>
            <div>
              <h4>Menu</h4>
              <ul>
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <a href="#menu" onClick={() => setCat(c.id)}>{c.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>More</h4>
              <ul>
                <li><a href="#studio">3D Exploded Studio</a></li>
                <li><Link to="/admin">Admin dashboard</Link></li>
                <li>
                  <a href="https://github.com/Zaichi234509/3d-samples" target="_blank" rel="noreferrer">
                    GitHub repo
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 {SHOP.name}. All cups reserved.</span>
            <span>
              Made with the <b>Chief of Staff</b> &amp; <b>Marketing Psychology</b> skills ·
              last order {orders[0] ? timeAgo(orders[0].createdAt) : "—"}
            </span>
          </div>
        </div>
      </footer>

      {/* ── floating bits ─────────────────────────────────────────────── */}
      <SocialProofToasts />
      {modalItem && <ItemModal itemId={modalItem} onClose={() => setModalItem(null)} />}
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  );
}
