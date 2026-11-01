// ─── Velvet Brew store ──────────────────────────────────────────────────────
// Single source of truth for cart · orders · menu · inventory · admin session.
// Persisted to localStorage; mirrored to Supabase when env keys are configured
// (see src/lib/db.ts — the app runs 100% fine without a database).

import { useSyncExternalStore } from "react";
import { MENU, ADDONS, type MenuItem, type AddOn } from "../data/menu";
import { INVENTORY, type InventoryItem } from "../data/inventory";

export type OrderStatus = "received" | "preparing" | "ready" | "completed" | "cancelled";

export interface CartLine {
  key: string;
  itemId: string;
  name: string;
  emoji: string;
  unitPrice: number;
  qty: number;
  addons: { id: string; name: string; price: number }[];
  note?: string;
}

export interface Order {
  id: string;
  code: string;
  customer: string;
  phone: string;
  type: "dine-in" | "takeout";
  lines: CartLine[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Toast {
  id: number;
  text: string;
  emoji: string;
}

export interface AppState {
  cart: CartLine[];
  orders: Order[];
  menu: MenuItem[];
  addons: AddOn[];
  inventory: InventoryItem[];
  adminAuthed: boolean;
  toasts: Toast[];
  seeded: boolean;
}

const KEY = "velvet-brew-state-v1";

// ── seed demo orders (last 7 days) so analytics & psychology lab are alive ──
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function seedOrders(): Order[] {
  const rnd = lcg(20261101);
  const names = ["Maria", "Joshua", "Angela", "Miguel", "Bea", "Carlo", "Trisha", "Paolo", "Kim", "Lance", "Joy", "Renz"];
  const pool = [
    "cafe-latte", "spanish-latte", "caramel-macchiato", "iced-latte", "cappuccino", "croissant",
    "cookies", "matcha-latte", "chicken-sandwich", "club-sandwich", "mocha", "cold-brew",
    "cinnamon-roll", "chocolate-croissant", "flat-white", "americano", "pasta", "cheesecake",
  ];
  const weights = [9, 8, 8, 7, 6, 7, 5, 5, 4, 3, 4, 4, 3, 3, 3, 3, 2, 1];
  const orders: Order[] = [];
  let n = 1;
  for (let d = 6; d >= 0; d--) {
    const count = 6 + Math.floor(rnd() * 6);
    for (let i = 0; i < count; i++) {
      const hour = 8 + Math.floor(rnd() * 11);
      const createdAt = new Date(Date.now() - d * 864e5 - (21 - hour) * 36e5).toISOString();
      const lines: CartLine[] = [];
      const lineCount = 1 + Math.floor(rnd() * 2.6);
      for (let l = 0; l < lineCount; l++) {
        const totalW = weights.reduce((a, b) => a + b, 0);
        let pick = rnd() * totalW;
        let idx = 0;
        while (pick > weights[idx]) { pick -= weights[idx]; idx++; }
        const item = MENU.find((m) => m.id === pool[idx])!;
        lines.push({
          key: `${item.id}-${l}`,
          itemId: item.id,
          name: item.name,
          emoji: item.emoji,
          unitPrice: item.price,
          qty: 1 + Math.floor(rnd() * 2),
          addons: [],
        });
      }
      const total = lines.reduce((a, l) => a + l.unitPrice * l.qty, 0);
      orders.push({
        id: `seed-${n}`,
        code: `VB-${String(1000 + n)}`,
        customer: names[Math.floor(rnd() * names.length)],
        phone: "",
        type: rnd() > 0.45 ? "takeout" : "dine-in",
        lines,
        total,
        status: d === 0 && i > count - 3 ? (i === count - 1 ? "received" : "preparing") : "completed",
        createdAt,
      });
      n++;
    }
  }
  return orders;
}

function load(): AppState {
  const base: AppState = {
    cart: [],
    orders: [],
    menu: MENU.map((m) => ({ ...m })),
    addons: ADDONS.map((a) => ({ ...a })),
    inventory: INVENTORY.map((i) => ({ ...i })),
    adminAuthed: false,
    toasts: [],
    seeded: false,
  };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<AppState>;
      return {
        ...base,
        ...saved,
        menu: base.menu.map((m) => ({ ...m, ...(saved.menu?.find((s) => s.id === m.id) ?? {}) })),
        inventory: base.inventory.map((i) => ({ ...i, ...(saved.inventory?.find((s) => s.id === i.id) ?? {}) })),
        toasts: [],
        seeded: true,
      };
    }
  } catch { /* corrupt storage → fresh seed */ }
  return { ...base, orders: seedOrders(), seeded: true };
}

let state: AppState = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, toasts: [], adminAuthed: false }));
  } catch { /* storage full/blocked — keep running in memory */ }
}

function set(patch: Partial<AppState>) {
  state = { ...state, ...patch };
  persist();
  listeners.forEach((l) => l());
}

export const store = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  get: () => state,

  // ── cart ──────────────────────────────────────────────────────────────────
  addToCart(itemId: string, qty: number, addonIds: string[], note?: string) {
    const item = state.menu.find((m) => m.id === itemId);
    if (!item) return;
    const addons = addonIds
      .map((id) => state.addons.find((a) => a.id === id))
      .filter((a): a is AddOn => !!a)
      .map((a) => ({ id: a.id, name: a.name, price: a.price }));
    const key = itemId + "|" + addonIds.slice().sort().join(",");
    const existing = state.cart.find((l) => l.key === key);
    const cart = existing
      ? state.cart.map((l) => (l.key === key ? { ...l, qty: l.qty + qty, note: note ?? l.note } : l))
      : [
          ...state.cart,
          {
            key,
            itemId,
            name: item.name,
            emoji: item.emoji,
            unitPrice: item.price + addons.reduce((a, x) => a + x.price, 0),
            qty,
            addons,
            note,
          },
        ];
    set({ cart });
  },
  setQty(key: string, qty: number) {
    set({
      cart: qty <= 0
        ? state.cart.filter((l) => l.key !== key)
        : state.cart.map((l) => (l.key === key ? { ...l, qty } : l)),
    });
  },
  clearCart() { set({ cart: [] }); },

  // ── orders ────────────────────────────────────────────────────────────────
  placeOrder(customer: string, phone: string, type: Order["type"]): Order {
    const seq = state.orders.length + 1;
    const order: Order = {
      id: `o-${Date.now()}`,
      code: `VB-${String(1000 + seq)}`,
      customer: customer.trim() || "Guest",
      phone,
      type,
      lines: state.cart,
      total: state.cart.reduce((a, l) => a + l.unitPrice * l.qty, 0),
      status: "received",
      createdAt: new Date().toISOString(),
    };
    set({ orders: [order, ...state.orders], cart: [] });
    return order;
  },
  setOrderStatus(id: string, status: OrderStatus) {
    set({ orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)) });
  },

  // ── menu ──────────────────────────────────────────────────────────────────
  toggleAvailability(id: string) {
    set({ menu: state.menu.map((m) => (m.id === id ? { ...m, available: !m.available } : m)) });
  },
  setPrice(id: string, price: number) {
    if (price <= 0) return;
    set({ menu: state.menu.map((m) => (m.id === id ? { ...m, price } : m)) });
  },

  // ── inventory ─────────────────────────────────────────────────────────────
  adjustStock(id: string, delta: number) {
    set({
      inventory: state.inventory.map((i) =>
        i.id === id ? { ...i, stock: Math.max(0, Math.round((i.stock + delta) * 10) / 10) } : i
      ),
    });
  },

  // ── admin session ─────────────────────────────────────────────────────────
  login() { set({ adminAuthed: true }); },
  logout() { set({ adminAuthed: false }); },

  // ── toasts ────────────────────────────────────────────────────────────────
  pushToast(text: string, emoji = "☕") {
    const t: Toast = { id: Date.now() + Math.random(), text, emoji };
    set({ toasts: [...state.toasts, t] });
    setTimeout(() => {
      set({ toasts: store.get().toasts.filter((x) => x.id !== t.id) });
    }, 5200);
  },
};

export function useStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(store.get())
  );
}
