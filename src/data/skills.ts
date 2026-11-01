// ─── The two "Skills" powering Velvet Brew ──────────────────────────────────
// 1. Chief of Staff — the operating system for running the shop.
// 2. Marketing Psychology — the persuasion science behind the storefront.

export interface SkillPrinciple {
  title: string;
  description: string;
  appliedInApp: string;
}

export interface SkillModule {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  summary: string;
  principles: SkillPrinciple[];
  frameworks: { name: string; how: string }[];
}

export const SKILLS: SkillModule[] = [
  {
    id: "chief-of-staff",
    name: "Chief of Staff",
    icon: "📋",
    tagline: "Run the shop like a well-run office",
    summary:
      "The Chief of Staff skill turns the admin dashboard into an operating system: one daily brief instead of scattered data, clear decision owners, a weekly cadence, and ruthless prioritisation (Do / Delegate / Defer / Kill).",
    principles: [
      {
        title: "Daily Brief, not data dumps",
        description: "Every morning the operator gets one page: what matters today, what's at risk, what needs a decision.",
        appliedInApp: "Admin → Dashboard 'Chief of Staff Daily Brief' — auto-generated from live orders, revenue and stock.",
      },
      {
        title: "Do / Delegate / Defer / Kill",
        description: "Every task is triaged into four buckets. Anything that isn't Do or Delegate loses attention on purpose.",
        appliedInApp: "The brief's 'Priority Queue' labels each action with its triage bucket.",
      },
      {
        title: "Decision log & owner",
        description: "No decision without an owner and a date. History prevents re-litigating settled calls.",
        appliedInApp: "Decision Queue cards in the dashboard brief record pending calls with suggested default actions.",
      },
      {
        title: "Weekly cadence",
        description: "Mon: set priorities. Wed: unblock. Fri: review numbers & celebrate wins. Retrospective beats improvisation.",
        appliedInApp: "The brief shows the cadence checklist and the Friday review metrics (revenue, AOV, top seller, stock risk).",
      },
      {
        title: "Risk radar",
        description: "Spot the fire before it spreads — low stock, stalled orders, falling AOV.",
        appliedInApp: "'Risk Radar' section surfaces low-stock supplies and stuck orders automatically.",
      },
    ],
    frameworks: [
      { name: "OODA Loop", how: "Observe (KPI cards) → Orient (brief) → Decide (decision queue) → Act (one-tap order/stock actions)." },
      { name: "Weekly Business Review", how: "Friday metrics block compares this week vs. menu-engineering quadrants." },
      { name: "Single Source of Truth", how: "Orders, menu & inventory live in one store — the brief is computed, never hand-typed." },
    ],
  },
  {
    id: "marketing-psychology",
    name: "Marketing Psychology",
    icon: "🧠",
    tagline: "Science-backed nudges that feel like hospitality",
    summary:
      "Marketing Psychology applies behavioural science — anchoring, social proof, scarcity, charm pricing, menu engineering — to the menu, the storefront and the admin playbooks, always in the guest's interest.",
    principles: [
      {
        title: "Social Proof",
        description: "People follow people. Show what others love, honestly.",
        appliedInApp: "Live 'recently ordered' toasts on the storefront + 'bestseller' tags driven by real sales data.",
      },
      {
        title: "Scarcity & Freshness",
        description: "Limited daily batches of pastries — truthful urgency, never fake countdowns.",
        appliedInApp: "'Only N left today' badges on pastries, backed by inventory stock.",
      },
      {
        title: "Anchoring & Decoy Pricing",
        description: "A premium item on display makes the mid-tier feel like the smart choice.",
        appliedInApp: "Menu order & the 'Signature' tier (Cheesecake, Caramel Macchiato) anchor the price ladder.",
      },
      {
        title: "Charm Pricing",
        description: "Prices ending in 5 or 0 read as deliberate & fair in ₱; clean menus build trust.",
        appliedInApp: "All prices use clean ₱ endings (₱110, ₱185) — consistent, honest menu engineering.",
      },
      {
        title: "Menu Engineering (Stars · Plowhorses · Puzzles · Dogs)",
        description: "Classify every item by popularity × margin, then act: promote Stars, bundle Plowhorses, re-price Puzzles, retire Dogs.",
        appliedInApp: "Admin → Psychology Lab renders the live 2×2 matrix from real order data with an action per quadrant.",
      },
      {
        title: "Foot-in-the-Door",
        description: "Small yeses lead to big yeses — easy customisation lowers commitment friction.",
        appliedInApp: "One-tap add-ons (oat milk, extra shot) in the item modal with pre-ticked popular pairings.",
      },
    ],
    frameworks: [
      { name: "Menu Engineering Matrix", how: "Plot units sold (popularity) vs. contribution margin; label each quadrant and prescribe an action." },
      { name: "Persuasion Checklist", how: "Every campaign page must show: proof, scarcity, clarity, and an easy next step." },
      { name: "Price Laddering", how: "Good–Better–Best tiers per category so guests self-select upward without pressure." },
    ],
  },
];
