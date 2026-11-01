// ─── Velvet Brew · Full menu ────────────────────────────────────────────────
// Prices in PHP (₱). `cost` is estimated unit cost used for margin analytics.

export type CategoryId = "coffee" | "non-coffee" | "pastry" | "food";

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  cost: number;
  desc: string;
  emoji: string;
  tags: string[];
  available: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  emoji: string;
}

export const CATEGORIES: { id: CategoryId; name: string; tagline: string; image: string }[] = [
  { id: "coffee", name: "Coffee", tagline: "Velvet-smooth, house-roasted", image: "/images/cat-coffee.jpg" },
  { id: "non-coffee", name: "Non-Coffee Drinks", tagline: "Matcha, tea & sweet sips", image: "/images/cat-noncoffee.jpg" },
  { id: "pastry", name: "Pastries & Desserts", tagline: "Baked fresh every morning", image: "/images/cat-pastry.jpg" },
  { id: "food", name: "Food", tagline: "Hearty plates & quick bites", image: "/images/cat-food.jpg" },
];

export const MENU: MenuItem[] = [
  // ☕ Coffee
  { id: "espresso", name: "Espresso", category: "coffee", price: 110, cost: 28, desc: "Pure, intense double shot — the heart of every velvet cup.", emoji: "☕", tags: ["classic"], available: true },
  { id: "americano", name: "Americano", category: "coffee", price: 130, cost: 30, desc: "Smooth espresso lengthened with hot water. Bold & clean.", emoji: "☕", tags: ["classic"], available: true },
  { id: "cappuccino", name: "Cappuccino", category: "coffee", price: 150, cost: 38, desc: "Equal thirds espresso, steamed milk & cloud foam.", emoji: "☕", tags: ["popular"], available: true },
  { id: "cafe-latte", name: "Café Latte", category: "coffee", price: 160, cost: 40, desc: "Silky steamed milk over a rich espresso base.", emoji: "☕", tags: ["bestseller"], available: true },
  { id: "mocha", name: "Mocha", category: "coffee", price: 175, cost: 46, desc: "Espresso, dark chocolate & velvet milk — dessert in a cup.", emoji: "☕", tags: ["popular"], available: true },
  { id: "caramel-macchiato", name: "Caramel Macchiato", category: "coffee", price: 185, cost: 50, desc: "Vanilla, milk, espresso & a golden caramel drizzle.", emoji: "🍮", tags: ["bestseller", "signature"], available: true },
  { id: "flat-white", name: "Flat White", category: "coffee", price: 165, cost: 42, desc: "Ristretto shots with velvety micro-foam. Strong & smooth.", emoji: "☕", tags: ["classic"], available: true },
  { id: "spanish-latte", name: "Spanish Latte", category: "coffee", price: 175, cost: 44, desc: "Creamy condensed-milk sweetness balanced with espresso.", emoji: "🧉", tags: ["bestseller", "signature"], available: true },
  { id: "vanilla-latte", name: "Vanilla Latte", category: "coffee", price: 175, cost: 45, desc: "Madagascar vanilla swirled into a classic latte.", emoji: "🌼", tags: ["popular"], available: true },
  { id: "hazelnut-latte", name: "Hazelnut Latte", category: "coffee", price: 175, cost: 45, desc: "Toasty hazelnut praline notes over espresso & milk.", emoji: "🌰", tags: ["popular"], available: true },
  { id: "cold-brew", name: "Cold Brew", category: "coffee", price: 165, cost: 38, desc: "Slow-steeped 18 hours. Naturally sweet, zero bitterness.", emoji: "🧊", tags: ["smooth"], available: true },
  { id: "iced-americano", name: "Iced Americano", category: "coffee", price: 145, cost: 32, desc: "Chilled espresso over ice — bold & refreshing.", emoji: "🧊", tags: ["classic"], available: true },
  { id: "iced-latte", name: "Iced Latte", category: "coffee", price: 175, cost: 44, desc: "Cold milk, ice & a double shot poured over the top.", emoji: "🧊", tags: ["bestseller"], available: true },
  { id: "iced-mocha", name: "Iced Mocha", category: "coffee", price: 185, cost: 48, desc: "Chocolate, cold milk & espresso over ice, whipped top.", emoji: "🍫", tags: ["popular"], available: true },

  // 🧋 Non-Coffee Drinks
  { id: "matcha-latte", name: "Matcha Latte", category: "non-coffee", price: 180, cost: 52, desc: "Ceremonial-grade matcha whisked with velvet milk.", emoji: "🍵", tags: ["bestseller"], available: true },
  { id: "chocolate", name: "Chocolate", category: "non-coffee", price: 155, cost: 40, desc: "Deep 65% cocoa melted into steamed milk.", emoji: "🍫", tags: ["classic"], available: true },
  { id: "strawberry-milk", name: "Strawberry Milk", category: "non-coffee", price: 165, cost: 42, desc: "Real strawberry purée folded into cold milk.", emoji: "🍓", tags: ["popular"], available: true },
  { id: "milk-tea", name: "Milk Tea", category: "non-coffee", price: 155, cost: 36, desc: "Assam black tea, creamy milk & chewy pearls.", emoji: "🧋", tags: ["popular"], available: true },
  { id: "chai-latte", name: "Chai Latte", category: "non-coffee", price: 175, cost: 42, desc: "Spiced chai concentrate with steamed milk.", emoji: "🫖", tags: ["cozy"], available: true },
  { id: "taro-latte", name: "Taro Latte", category: "non-coffee", price: 170, cost: 44, desc: "Naturally purple, nutty-sweet taro with milk.", emoji: "💜", tags: ["popular"], available: true },
  { id: "fruit-tea", name: "Fruit Tea", category: "non-coffee", price: 145, cost: 32, desc: "Bright tea shaken with real fruit slices.", emoji: "🍑", tags: ["refreshing"], available: true },
  { id: "lemonade", name: "Lemonade", category: "non-coffee", price: 135, cost: 26, desc: "Fresh-squeezed lemons, a kiss of honey, plenty of ice.", emoji: "🍋", tags: ["refreshing"], available: true },
  { id: "iced-tea", name: "Iced Tea", category: "non-coffee", price: 120, cost: 22, desc: "Classic house-brewed black tea over ice.", emoji: "🧊", tags: ["classic"], available: true },
  { id: "soda", name: "Soda", category: "non-coffee", price: 95, cost: 22, desc: "Ice-cold sparkling soda in your favourite flavour.", emoji: "🥤", tags: ["classic"], available: true },

  // 🍰 Pastries & Desserts
  { id: "croissant", name: "Croissant", category: "pastry", price: 115, cost: 34, desc: "27 flaky butter layers, baked golden each morning.", emoji: "🥐", tags: ["bestseller", "fresh-daily"], available: true },
  { id: "chocolate-croissant", name: "Chocolate Croissant", category: "pastry", price: 130, cost: 40, desc: "Buttery pain au chocolat with two dark chocolate batons.", emoji: "🥐", tags: ["popular", "fresh-daily"], available: true },
  { id: "blueberry-muffin", name: "Blueberry Muffin", category: "pastry", price: 120, cost: 34, desc: "Loaded with wild blueberries & a sugar-crackle top.", emoji: "🫐", tags: ["fresh-daily"], available: true },
  { id: "chocolate-muffin", name: "Chocolate Muffin", category: "pastry", price: 125, cost: 36, desc: "Double-chocolate with molten chips in the centre.", emoji: "🍫", tags: ["fresh-daily"], available: true },
  { id: "cinnamon-roll", name: "Cinnamon Roll", category: "pastry", price: 135, cost: 38, desc: "Soft brioche swirl, cream-cheese glaze, warm spice.", emoji: "🌀", tags: ["popular", "fresh-daily"], available: true },
  { id: "donut", name: "Donut", category: "pastry", price: 85, cost: 22, desc: "Pillowy ring glazed or filled — pick your favourite.", emoji: "🍩", tags: ["classic"], available: true },
  { id: "brownie", name: "Brownie", category: "pastry", price: 115, cost: 32, desc: "Fudgy centre, crackly top, sea-salt finish.", emoji: "🍫", tags: ["popular"], available: true },
  { id: "cheesecake", name: "Cheesecake", category: "pastry", price: 195, cost: 62, desc: "New-York style, vanilla bean, buttery crust.", emoji: "🍰", tags: ["premium"], available: true },
  { id: "chocolate-cake", name: "Chocolate Cake", category: "pastry", price: 185, cost: 56, desc: "Three layers of devil's-food cake & ganache.", emoji: "🎂", tags: ["premium"], available: true },
  { id: "carrot-cake", name: "Carrot Cake", category: "pastry", price: 175, cost: 52, desc: "Spiced sponge, walnuts, cream-cheese frosting.", emoji: "🥕", tags: ["premium"], available: true },
  { id: "banana-bread", name: "Banana Bread", category: "pastry", price: 115, cost: 30, desc: "Slow-baked, extra moist, caramelised edges.", emoji: "🍌", tags: ["fresh-daily"], available: true },
  { id: "cookies", name: "Cookies", category: "pastry", price: 75, cost: 18, desc: "Chewy chocolate-chunk, baked in small batches.", emoji: "🍪", tags: ["classic", "fresh-daily"], available: true },

  // 🥪 Food
  { id: "ham-cheese-sandwich", name: "Ham & Cheese Sandwich", category: "food", price: 185, cost: 58, desc: "Smoked ham, melted cheddar, sourdough toastie.", emoji: "🥪", tags: ["classic"], available: true },
  { id: "tuna-sandwich", name: "Tuna Sandwich", category: "food", price: 175, cost: 54, desc: "Herbed tuna salad with crisp lettuce on wheat.", emoji: "🥪", tags: ["classic"], available: true },
  { id: "chicken-sandwich", name: "Chicken Sandwich", category: "food", price: 195, cost: 62, desc: "Buttermilk chicken fillet, pickles, house sauce.", emoji: "🍗", tags: ["popular"], available: true },
  { id: "club-sandwich", name: "Club Sandwich", category: "food", price: 245, cost: 82, desc: "Triple-decker chicken, bacon, egg, tomato & lettuce.", emoji: "🥪", tags: ["bestseller", "hearty"], available: true },
  { id: "grilled-cheese", name: "Grilled Cheese", category: "food", price: 175, cost: 52, desc: "Three cheeses pull-apart in golden buttered bread.", emoji: "🧀", tags: ["comfort"], available: true },
  { id: "breakfast-sandwich", name: "Breakfast Sandwich", category: "food", price: 195, cost: 60, desc: "Egg, cheese & your choice of ham or bacon on brioche.", emoji: "🍳", tags: ["popular", "morning"], available: true },
  { id: "croissant-sandwich", name: "Croissant Sandwich", category: "food", price: 215, cost: 68, desc: "Flaky croissant, egg, cheese & smoked ham.", emoji: "🥐", tags: ["popular", "morning"], available: true },
  { id: "pasta", name: "Pasta", category: "food", price: 245, cost: 78, desc: "Chef's daily sauce over al dente pasta.", emoji: "🍝", tags: ["hearty"], available: true },
  { id: "french-fries", name: "French Fries", category: "food", price: 135, cost: 34, desc: "Hand-cut, double-fried, sea salt & dips.", emoji: "🍟", tags: ["classic"], available: true },
  { id: "chicken-wings", name: "Chicken Wings", category: "food", price: 245, cost: 84, desc: "Crispy wings tossed in your glaze of choice.", emoji: "🍗", tags: ["hearty"], available: true },
];

export const ADDONS: AddOn[] = [
  { id: "extra-espresso", name: "Extra Espresso Shot", price: 40, emoji: "☕" },
  { id: "oat-milk", name: "Oat Milk", price: 35, emoji: "🌾" },
  { id: "soy-milk", name: "Soy Milk", price: 35, emoji: "🫘" },
  { id: "almond-milk", name: "Almond Milk", price: 35, emoji: "🌰" },
  { id: "extra-milk", name: "Extra Milk", price: 25, emoji: "🥛" },
  { id: "whipped-cream", name: "Whipped Cream", price: 25, emoji: "🍦" },
  { id: "caramel-syrup", name: "Caramel Syrup", price: 25, emoji: "🍯" },
  { id: "vanilla-syrup", name: "Vanilla Syrup", price: 25, emoji: "🌼" },
  { id: "hazelnut-syrup", name: "Hazelnut Syrup", price: 25, emoji: "🌰" },
  { id: "chocolate-syrup", name: "Chocolate Syrup", price: 25, emoji: "🍫" },
  { id: "matcha", name: "Matcha", price: 35, emoji: "🍵" },
  { id: "chocolate-chips", name: "Chocolate Chips", price: 25, emoji: "🍫" },
  { id: "ice", name: "Ice", price: 10, emoji: "🧊" },
];

/** Which add-on groups make sense per category (used to pre-filter the modal). */
export const ADDON_SUGGESTIONS: Record<CategoryId, string[]> = {
  coffee: ["extra-espresso", "oat-milk", "soy-milk", "almond-milk", "extra-milk", "whipped-cream", "caramel-syrup", "vanilla-syrup", "hazelnut-syrup", "chocolate-syrup", "chocolate-chips", "ice"],
  "non-coffee": ["oat-milk", "soy-milk", "almond-milk", "extra-milk", "whipped-cream", "caramel-syrup", "vanilla-syrup", "chocolate-syrup", "matcha", "chocolate-chips", "ice"],
  pastry: ["whipped-cream", "chocolate-syrup", "caramel-syrup", "chocolate-chips"],
  food: ["ketchup", "cheese", "egg"].filter((x) => x === "ketchup") /* no add-ons mapped yet */,
};
