// ─── Supplies / Inventory Items ─────────────────────────────────────────────

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  stock: number;
  par: number; // target stock level
  reorderAt: number;
  costPerUnit: number;
  emoji: string;
}

export const INVENTORY: InventoryItem[] = [
  { id: "coffee-beans", name: "Coffee Beans", unit: "kg", stock: 18, par: 25, reorderAt: 8, costPerUnit: 720, emoji: "🫘" },
  { id: "ground-coffee", name: "Ground Coffee", unit: "kg", stock: 12, par: 18, reorderAt: 6, costPerUnit: 680, emoji: "☕" },
  { id: "milk", name: "Milk", unit: "L", stock: 24, par: 36, reorderAt: 12, costPerUnit: 95, emoji: "🥛" },
  { id: "oat-milk", name: "Oat Milk", unit: "L", stock: 9, par: 20, reorderAt: 8, costPerUnit: 145, emoji: "🌾" },
  { id: "sugar", name: "Sugar", unit: "kg", stock: 15, par: 20, reorderAt: 6, costPerUnit: 75, emoji: "🧂" },
  { id: "syrups", name: "Syrups", unit: "bottle", stock: 11, par: 16, reorderAt: 5, costPerUnit: 320, emoji: "🍯" },
  { id: "matcha-powder", name: "Matcha Powder", unit: "g", stock: 850, par: 1200, reorderAt: 400, costPerUnit: 2.4, emoji: "🍵" },
  { id: "chocolate-powder", name: "Chocolate Powder", unit: "g", stock: 1100, par: 1500, reorderAt: 500, costPerUnit: 1.2, emoji: "🍫" },
  { id: "tea-leaves", name: "Tea Leaves", unit: "g", stock: 700, par: 1000, reorderAt: 350, costPerUnit: 1.8, emoji: "🍃" },
  { id: "ice", name: "Ice", unit: "kg", stock: 30, par: 45, reorderAt: 15, costPerUnit: 25, emoji: "🧊" },
  { id: "whipped-cream", name: "Whipped Cream", unit: "can", stock: 14, par: 20, reorderAt: 7, costPerUnit: 210, emoji: "🍦" },
  { id: "paper-cups", name: "Paper Cups", unit: "sleeve", stock: 22, par: 40, reorderAt: 15, costPerUnit: 165, emoji: "☕" },
  { id: "plastic-cups", name: "Plastic Cups", unit: "sleeve", stock: 17, par: 35, reorderAt: 12, costPerUnit: 140, emoji: "🥤" },
  { id: "cup-lids", name: "Cup Lids", unit: "sleeve", stock: 19, par: 35, reorderAt: 12, costPerUnit: 95, emoji: "⭕" },
  { id: "straws", name: "Straws", unit: "box", stock: 8, par: 15, reorderAt: 5, costPerUnit: 130, emoji: "🥖" },
  { id: "napkins", name: "Napkins", unit: "pack", stock: 26, par: 30, reorderAt: 10, costPerUnit: 85, emoji: "🧻" },
  { id: "takeout-bags", name: "Takeout Bags", unit: "pack", stock: 13, par: 25, reorderAt: 9, costPerUnit: 190, emoji: "🛍️" },
];
