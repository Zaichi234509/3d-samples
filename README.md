# ☕ Velvet Brew

**Velvet-smooth coffee, brewed to order** — a full coffee-shop platform with a separate
**customer website** and an **admin control room**, live 3D animation via **Spline**, and an
interactive **exploded view** of every item. Built for free hosting (Vercel) with a real
database option (Supabase) and **GitHub auto-deploy** (`git push` → live).

> 🧠 Built using the **Chief of Staff** and **Marketing Psychology** skills — see [The Skills](#-the-skills) below.

---

## 📍 Where to go

| Page | URL | What it is |
|---|---|---|
| 🛍 Customer site | `/` | Menu, cart, ordering, 3D hero, exploded-view studio |
| 🔧 Admin control room | `/admin` | Dashboard, orders, menu, inventory, psychology lab (PIN `2345`) |

---

## ✅ What we do (what's built)

**Customer site**
- ☕ Full **46-item menu** — 14 coffee · 10 non-coffee · 12 pastries & desserts · 10 food + **13 add-ons/customisations** (oat/soy/almond milk, syrups, extra shot…)
- 🧾 **Ordering flow** — customise (add-ons + notes) → cart → checkout → live order code (`VB-XXXX`) with status tracker (Received → Brewing → Ready → Picked up)
- 🎨 **Spline 3D hero** — live 3D animation stage (drag to orbit). Swap in your own scene via `src/config.ts`
- 💥 **3D Exploded View Studio** — 6 items (Caramel Macchiato, Iced Latte, Cappuccino, Matcha Latte, Croissant, Club Sandwich) built layer-by-layer in 3D: slide to explode, orbit, hover any part to see what it is
- 🍞 Truthful **scarcity badges** ("Only N left today" from live inventory) + social-proof toasts
- 🔍 Menu search, category filter, responsive design, dark-velvet & cream art direction

**Admin control room** (`/admin`, demo PIN `2345`)
- 📊 **Dashboard** — revenue/AOV/stock KPIs, 7-day revenue chart, live order ticker
- 📋 **Chief of Staff Daily Brief** — auto-generated priorities with **Do / Delegate / Defer / Kill** triage, risk radar, weekly cadence
- 🧾 **Order board** — advance/cancel orders, status filters
- 🍽 **Menu manager** — price edits, "86-it" availability toggle, live margin % per item
- 📦 **Inventory** — 17 supplies vs par levels, reorder radar, one-tap restock to par
- 🧠 **Psychology Lab** — live **Menu Engineering matrix** (Stars · Plowhorses · Puzzles · Dogs) + persuasion checklist + auto-recommended plays

## 🚧 What we're doing (next up)

- [x] Scaffold full app (user + admin, separate pages)
- [x] Spline 3D hero + exploded-view studio
- [x] Chief of Staff + Marketing Psychology wired into the dashboard
- [x] Push to GitHub on `arena/a9e4048a-3d-samples`
- [ ] **Deploy to Vercel** — connect `Zaichi234509/3d-samples` in the Vercel dashboard (or `vercel` CLI) for `git push` auto-deploy
- [ ] **Connect Supabase** — run `supabase/schema.sql` on a project (e.g. `herday`) and add `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` env vars in Vercel
- [ ] Replace the demo Spline scene with a custom Velvet Brew scene (spline.design → Export → Public URL → `src/config.ts`)
- [ ] Real payment (GCash/Maya) + SMS order-ready notifications
- [ ] Staff accounts (roles) instead of the demo PIN

---

## 🧠 The Skills

### 1 · Chief of Staff 📋
*Run the shop like a well-run office — one brief, clear owners, ruthless triage.*

| Principle | Where it lives in the app |
|---|---|
| Daily Brief, not data dumps | Admin Dashboard → auto-generated brief from live orders/revenue/stock |
| Do / Delegate / Defer / Kill | Every brief item is triage-labelled |
| Decision owner + log | Decision cards with suggested defaults |
| Weekly cadence (Mon/Wed/Fri) | Cadence checklist + Friday review metrics |
| Risk radar | Low-stock & stuck-order alerts surfaced automatically |

### 2 · Marketing Psychology 🧠
*Behavioural science that feels like hospitality — never manipulation.*

| Principle | Where it lives in the app |
|---|---|
| Social proof | Live "recently ordered" toasts + bestseller badges from real sales |
| Truthful scarcity | "Only N left today" on pastries, backed by inventory |
| Anchoring & price laddering | Signature tier anchors the menu (₱95 → ₱245) |
| Menu engineering (Stars/Plowhorses/Puzzles/Dogs) | Psychology Lab 2×2 matrix from live order data, one move per quadrant |
| Foot-in-the-door | Low-commitment add-on chips pre-surfaced in item modals |
| Loss aversion | "Order ahead, skip the line" framing |

---

## 🍽 The Menu

- **☕ Coffee** — Espresso · Americano · Cappuccino · Café Latte · Mocha · Caramel Macchiato · Flat White · Spanish Latte · Vanilla Latte · Hazelnut Latte · Cold Brew · Iced Americano · Iced Latte · Iced Mocha
- **🧋 Non-Coffee** — Matcha Latte · Chocolate · Strawberry Milk · Milk Tea · Chai Latte · Taro Latte · Fruit Tea · Lemonade · Iced Tea · Soda
- **🍰 Pastries & Desserts** — Croissant · Chocolate Croissant · Blueberry Muffin · Chocolate Muffin · Cinnamon Roll · Donut · Brownie · Cheesecake · Chocolate Cake · Carrot Cake · Banana Bread · Cookies
- **🥪 Food** — Ham & Cheese · Tuna · Chicken · Club Sandwich · Grilled Cheese · Breakfast Sandwich · Croissant Sandwich · Pasta · French Fries · Chicken Wings
- **➕ Add-ons** — Extra Espresso Shot · Oat/Soy/Almond/Extra Milk · Whipped Cream · Caramel/Vanilla/Hazelnut/Chocolate Syrup · Matcha · Chocolate Chips · Ice
- **📦 Supplies** — Coffee Beans · Ground Coffee · Milk · Oat Milk · Sugar · Syrups · Matcha Powder · Chocolate Powder · Tea Leaves · Ice · Whipped Cream · Paper Cups · Plastic Cups · Cup Lids · Straws · Napkins · Takeout Bags

---

## 🏗 Tech stack

- **React 19 + TypeScript + Vite** — fast SPA, two separate pages (user / admin)
- **Spline** (`@splinetool/runtime`) — hero 3D animation stage
- **React Three Fiber + drei** — interactive exploded-view 3D studio
- **Supabase** (optional) — Postgres orders database, `@supabase/supabase-js`
- **Local store** — runs 100% offline on localStorage if no DB is configured (demo mode)
- **Vercel-ready** — `vercel.json` SPA rewrites included

## 🚀 Deploy (free, GitHub auto-deploy)

1. **Vercel** — import `Zaichi234509/3d-samples` → framework *Vite* → Deploy.
   Every `git push` now auto-deploys. ✅
2. **Database (optional)** — in [Supabase](https://supabase.com): create/open a project →
   SQL Editor → run `supabase/schema.sql`. Then in Vercel → Project → Settings →
   Environment Variables add `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (from `.env.example`).
   Redeploy — orders now persist to Postgres.
3. **Your own Spline scene** — [spline.design](https://spline.design) → build → Export →
   Public URL → paste into `SPLINE_SCENE_URL` in `src/config.ts`.

```bash
npm install
npm run dev      # local: http://localhost:5173
npm run build    # production build → dist/
npm run typecheck
```

## 📁 Structure

```
src/
├── pages/UserSite.tsx        # customer storefront (separate webpage)
├── pages/AdminSite.tsx       # admin control room (separate webpage, /admin)
├── components/user/          # Spline hero · 3D exploded view · cart/checkout modals
├── components/admin/         # dashboard · orders · menu · inventory · psychology lab
├── data/                     # menu (46 items + 13 add-ons) · inventory · 3D models · skills
├── lib/                      # store (cart/orders) · optional Supabase bridge · format
└── config.ts                 # shop info + Spline scene URL
supabase/schema.sql           # optional Postgres schema
```

---
© 2026 Velvet Brew · San Pablo City · Built with the **Chief of Staff** & **Marketing Psychology** skills.
