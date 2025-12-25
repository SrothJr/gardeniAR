// // mobile/constants/cart.js
// import AsyncStorage from "@react-native-async-storage/async-storage";

// let CART = [];

// // Load cart once when app starts
// (async () => {
//   try {
//     const raw = await AsyncStorage.getItem("cart");
//     CART = raw ? JSON.parse(raw) : [];
//   } catch (e) {
//     CART = [];
//   }
// })();

// /* ===== EXPORTED FUNCTIONS (IMPORTANT) ===== */

// export function getCart() {
//   return CART;
// }

// export function addToCart(item) {
//   const existing = CART.find(p => p._id === item._id);

//   if (existing) {
//     existing.quantity += 1;
//   } else {
//     CART.push({
//       ...item,
//       quantity: 1,
//     });
//   }

//   AsyncStorage.setItem("cart", JSON.stringify(CART));
// }

// export function clearCart() {
//   CART = [];
//   AsyncStorage.removeItem("cart");
// }


// mobile/constants/cart.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "CART_ITEMS";

/* ===== HELPERS ===== */

async function load() {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

async function save(cart) {
  await AsyncStorage.setItem(KEY, JSON.stringify(cart));
}

/* ===== API ===== */

export async function getCart() {
  return await load();
}

export async function addToCart(item) {
  const cart = await load();

  const existing = cart.find(p => p._id === item._id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  await save(cart);
}

export async function clearCart() {
  await AsyncStorage.removeItem(KEY);
}
