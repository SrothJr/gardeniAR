import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { BACKEND } from "../config";
import { useRouter } from "expo-router";

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState([]);

  // Load cart from backend
  const loadCart = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/cart`);
      const data = await res.json();
      setCart(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error(err);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Update quantity
  const updateQty = async (item, delta) => {
    const updated = cart
      .map(i =>
        i._id === item._id
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      )
      .filter(i => i.quantity > 0);

    await fetch(`${BACKEND}/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: updated }),
    });

    setCart(updated);
  };

  // Remove item
  const removeItem = async id => {
    const updated = cart.filter(i => i._id !== id);

    await fetch(`${BACKEND}/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: updated }),
    });

    setCart(updated);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity onPress={() => removeItem(item._id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.removeX}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subRow}>
        <Text style={styles.price}>Tk {item.price}</Text>
        <Text style={styles.subtotal}>Subtotal: Tk {item.price * item.quantity}</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item, -1)}>
          <Text style={styles.qtyText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qty}>{item.quantity}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item, 1)}>
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeItem(item._id)} style={styles.remove}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.page}>
      <Text style={styles.title}>My Cart</Text>

      {cart.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <View style={styles.summaryBar}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Tk {total}</Text>
        </View>
        <TouchableOpacity
          style={[styles.payBtn, cart.length === 0 && styles.payBtnDisabled]}
          onPress={() => router.push("/payment")}
          disabled={cart.length === 0}
        >
          <Text style={styles.payText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, backgroundColor: "#071024" },
  title: { color: "#e6eef3", fontSize: 22, fontWeight: "700", marginBottom: 12 },
  empty: { color: "#94a3b8", marginTop: 40, textAlign: "center" },

  card: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { color: "#e6eef3", fontWeight: "800", fontSize: 16 },
  removeX: { color: "#64748b", fontSize: 18, fontWeight: "700" },
  subRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  price: { color: "#9fb1be" },
  subtotal: { color: "#93c5fd", fontWeight: "700" },

  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { color: "#051013", fontSize: 18, fontWeight: "900" },
  qty: { color: "#e6eef3", marginHorizontal: 12, fontWeight: "800" },

  remove: { marginLeft: "auto" },
  removeText: { color: "#ef4444" },

  summaryBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: { color: "#9fb1be", fontSize: 12 },
  totalValue: { color: "#e6eef3", fontSize: 18, fontWeight: "800" },
  payBtn: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  payBtnDisabled: { opacity: 0.6 },
  payText: { color: "#051013", fontWeight: "900", fontSize: 15 },
});
