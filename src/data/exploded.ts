// ─── Exploded-view 3D models ────────────────────────────────────────────────
// Each item is a stack of parts. `y` is the assembled position; `dy` is how far
// the part travels (in scene units) when the explode slider goes 0 → 1.

export type PartShape = "cylinder" | "box" | "sphere" | "torus" | "cone" | "disc";

export interface ModelPart {
  id: string;
  label: string;
  shape: PartShape;
  color: string;
  y: number;
  dy: number;
  /** cylinder/cone: [radiusTop, radiusBottom, height] · box: [w, h, d] · sphere: [r] · torus: [r, tube] */
  size: [number, number, number?];
  transparent?: boolean;
  opacity?: number;
  metalness?: number;
  roughness?: number;
  note: string;
}

export interface ExplodedModel {
  id: string;
  name: string;
  emoji: string;
  caption: string;
  parts: ModelPart[];
}

export const MODELS: ExplodedModel[] = [
  {
    id: "caramel-macchiato",
    name: "Caramel Macchiato",
    emoji: "🍮",
    caption: "Our signature build — five layers poured in order.",
    parts: [
      { id: "lid", label: "Dome Lid", shape: "cylinder", color: "#2b1a12", y: 1.28, dy: 0.85, size: [0.62, 0.58, 0.1], note: "Sip-lid, sized for the caramel drizzle dome." },
      { id: "drizzle", label: "Caramel Drizzle", shape: "torus", color: "#c98a2e", y: 1.12, dy: 0.55, size: [0.34, 0.055], note: "The golden cross-hatch finish." },
      { id: "foam", label: "Milk Foam", shape: "cylinder", color: "#fdf6e8", y: 0.98, dy: 0.38, size: [0.56, 0.58, 0.16], note: "1 cm of airy micro-foam." },
      { id: "espresso", label: "Espresso Layer", shape: "cylinder", color: "#5b3016", y: 0.72, dy: 0.18, size: [0.57, 0.58, 0.3], note: "Double shot poured through the foam." },
      { id: "milk", label: "Steamed Milk", shape: "cylinder", color: "#f6ead2", y: 0.28, dy: -0.18, size: [0.58, 0.55, 0.6], note: "70% of the cup — the velvet body." },
      { id: "vanilla", label: "Vanilla Syrup", shape: "cylinder", color: "#e8c87c", y: -0.1, dy: -0.42, size: [0.5, 0.5, 0.12], note: "Pumps of vanilla settle first." },
      { id: "cup", label: "Clear Cup", shape: "cylinder", color: "#dfe9f0", y: 0.45, dy: -0.72, size: [0.62, 0.52, 1.5], transparent: true, opacity: 0.28, note: "Shows off the layers." },
      { id: "sleeve", label: "Cup Sleeve", shape: "cylinder", color: "#6f4e37", y: 0.32, dy: -0.95, size: [0.645, 0.6, 0.5], note: "Velvet Brew signature sleeve." },
    ],
  },
  {
    id: "iced-latte",
    name: "Iced Latte",
    emoji: "🧊",
    caption: "Built cold, layered light-to-dark.",
    parts: [
      { id: "straw", label: "Paper Straw", shape: "cylinder", color: "#c9a06a", y: 1.15, dy: 0.95, size: [0.055, 0.055, 1.5], note: "Compostable, 100% paper." },
      { id: "flatlid", label: "Flat Lid", shape: "cylinder", color: "#2b1a12", y: 1.3, dy: 0.72, size: [0.62, 0.58, 0.09], note: "Snaps tight for takeout." },
      { id: "espresso", label: "Espresso", shape: "cylinder", color: "#4e2a12", y: 1.02, dy: 0.42, size: [0.5, 0.5, 0.28], note: "Poured last so it cascades down." },
      { id: "ice", label: "Ice Cubes", shape: "box", color: "#cfe8f5", y: 0.62, dy: 0.18, size: [0.55, 0.45, 0.55], transparent: true, opacity: 0.75, note: "Slow-melt filtered ice." },
      { id: "milk", label: "Cold Milk", shape: "cylinder", color: "#f4ecda", y: 0.18, dy: -0.18, size: [0.57, 0.55, 0.85], note: "Fill to the ridge line." },
      { id: "cup", label: "Clear Cup", shape: "cylinder", color: "#dfe9f0", y: 0.55, dy: -0.62, size: [0.62, 0.52, 1.6], transparent: true, opacity: 0.28, note: "16 oz clear cup." },
    ],
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    emoji: "☕",
    caption: "The classic thirds — espresso, milk, foam.",
    parts: [
      { id: "spoon", label: "Serving Spoon", shape: "box", color: "#c7c7c7", y: 0.1, dy: 1.15, size: [0.09, 0.045, 0.9], metalness: 0.85, roughness: 0.25, note: "Plated on the saucer." },
      { id: "cocoa", label: "Cocoa Dust", shape: "disc", color: "#6b4423", y: 1.06, dy: 0.78, size: [0.42, 0.42, 0.02], note: "Velvet-brew signature stencil." },
      { id: "foam", label: "Thick Foam", shape: "cylinder", color: "#fbf3e4", y: 0.92, dy: 0.55, size: [0.52, 0.5, 0.22], note: "2 cm of dense foam." },
      { id: "milk", label: "Steamed Milk", shape: "cylinder", color: "#f0e4c8", y: 0.66, dy: 0.25, size: [0.5, 0.46, 0.34], note: "Velvet micro-foam pour." },
      { id: "espresso", label: "Espresso", shape: "cylinder", color: "#4e2a12", y: 0.42, dy: -0.08, size: [0.47, 0.44, 0.2], note: "Double ristretto base." },
      { id: "cup", label: "Ceramic Cup", shape: "cylinder", color: "#f7f2ea", y: 0.66, dy: -0.55, size: [0.56, 0.42, 0.95], note: "Pre-heated porcelain." },
      { id: "saucer", label: "Saucer", shape: "cylinder", color: "#f7f2ea", y: 0.13, dy: -0.85, size: [0.95, 0.95, 0.07], note: "Wide-rim saucer." },
    ],
  },
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    emoji: "🍵",
    caption: "Ceremonial matcha, whisked to order.",
    parts: [
      { id: "matchadust", label: "Matcha Dust", shape: "disc", color: "#7fae4b", y: 1.12, dy: 0.85, size: [0.34, 0.34, 0.02], note: "Final flourish." },
      { id: "foam", label: "Milk Foam", shape: "cylinder", color: "#f7f4e2", y: 0.98, dy: 0.58, size: [0.55, 0.56, 0.18], note: "Light, silky cap." },
      { id: "milk", label: "Velvet Milk", shape: "cylinder", color: "#f2edd4", y: 0.5, dy: 0.12, size: [0.57, 0.57, 0.72], note: "Steamed to 65°C." },
      { id: "matcha", label: "Matcha Concentrate", shape: "cylinder", color: "#84b04c", y: 0.06, dy: -0.32, size: [0.55, 0.53, 0.24], note: "2 g ceremonial-grade, whisked." },
      { id: "cup", label: "Glass Cup", shape: "cylinder", color: "#e6efe2", y: 0.55, dy: -0.72, size: [0.62, 0.52, 1.45], transparent: true, opacity: 0.3, note: "Straight glass to show the green." },
    ],
  },
  {
    id: "croissant",
    name: "Butter Croissant",
    emoji: "🥐",
    caption: "27 layers of laminated butter dough.",
    parts: [
      { id: "glaze", label: "Honey Glaze", shape: "box", color: "#e8b45c", y: 0.52, dy: 0.75, size: [1.15, 0.05, 0.72], note: "Brushed while warm." },
      { id: "layer1", label: "Top Lamination", shape: "box", color: "#d9974a", y: 0.38, dy: 0.5, size: [1.1, 0.12, 0.68], note: "Golden, shattering crust." },
      { id: "butter", label: "Butter Layer", shape: "box", color: "#f2d98c", y: 0.22, dy: 0.22, size: [1.05, 0.1, 0.64], note: "82% French butter." },
      { id: "layer2", label: "Middle Lamination", shape: "box", color: "#d9974a", y: 0.06, dy: -0.05, size: [1.06, 0.11, 0.65], note: "Folded 3×3." },
      { id: "butter2", label: "Butter Layer", shape: "box", color: "#f2d98c", y: -0.1, dy: -0.3, size: [1.02, 0.09, 0.62], note: "Lamination block." },
      { id: "layer3", label: "Base Lamination", shape: "box", color: "#c98237", y: -0.28, dy: -0.55, size: [1.0, 0.14, 0.6], note: "Slow-proofed base." },
    ],
  },
  {
    id: "club-sandwich",
    name: "Club Sandwich",
    emoji: "🥪",
    caption: "Triple-decker, stacked to order.",
    parts: [
      { id: "pick", label: "Cocktail Picks", shape: "cylinder", color: "#c9a06a", y: 1.05, dy: 1.05, size: [0.035, 0.035, 1.0], note: "Hold the stack together." },
      { id: "top", label: "Top Toast", shape: "box", color: "#d9a45b", y: 0.85, dy: 0.8, size: [1.5, 0.16, 1.5], note: "Golden sourdough." },
      { id: "lettuce2", label: "Lettuce", shape: "box", color: "#7cb342", y: 0.7, dy: 0.62, size: [1.45, 0.07, 1.45], note: "Iceberg crunch." },
      { id: "tomato", label: "Tomato", shape: "box", color: "#d8452f", y: 0.58, dy: 0.45, size: [1.4, 0.08, 1.4], note: "Vine-ripened slices." },
      { id: "bacon", label: "Bacon", shape: "box", color: "#a94f2e", y: 0.46, dy: 0.28, size: [1.42, 0.07, 1.42], note: "Crispy smoked streaky." },
      { id: "mid", label: "Middle Toast", shape: "box", color: "#d9a45b", y: 0.32, dy: 0.1, size: [1.48, 0.14, 1.48], note: "The second decker." },
      { id: "cheese", label: "Cheddar", shape: "box", color: "#eda93c", y: 0.18, dy: -0.08, size: [1.42, 0.07, 1.42], note: "Melted sharp cheddar." },
      { id: "chicken", label: "Chicken Fillet", shape: "box", color: "#c98c4e", y: 0.04, dy: -0.25, size: [1.4, 0.12, 1.4], note: "Grilled, herb-marinated." },
      { id: "lettuce1", label: "Lettuce", shape: "box", color: "#7cb342", y: -0.1, dy: -0.42, size: [1.45, 0.07, 1.45], note: "Bottom crunch layer." },
      { id: "bottom", label: "Bottom Toast", shape: "box", color: "#d9a45b", y: -0.26, dy: -0.6, size: [1.5, 0.16, 1.5], note: "Foundation decker." },
    ],
  },
];
