import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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

  return (
    <View style={styles.page}>
      <Text style={styles.title}>My Cart</Text>

      <ScrollView>
        {cart.length === 0 ? (
          <Text style={styles.empty}>Your cart is empty</Text>
        ) : (
          cart.map(item => (
            <View key={item._id} style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>

              <Text style={styles.price}>
                Tk {item.price} × {item.quantity} = Tk{" "}
                {item.price * item.quantity}
              </Text>

              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQty(item, -1)}
                >
                  <Text style={styles.qtyText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.qty}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQty(item, 1)}
                >
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => removeItem(item._id)}
                  style={styles.remove}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Text style={styles.total}>Total: Tk {total}</Text>

      <TouchableOpacity
        style={styles.payBtn}
        onPress={() => router.push("/payment")}
        disabled={cart.length === 0}
      >
        <Text style={styles.payText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, backgroundColor: "#071024" },
  title: { color: "#e6eef3", fontSize: 22, fontWeight: "700", marginBottom: 12 },
  empty: { color: "#94a3b8", marginTop: 40, textAlign: "center" },

  card: {
    backgroundColor: "#0b1220",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: { color: "#e6eef3", fontWeight: "700", fontSize: 16 },
  price: { color: "#94a3b8", marginVertical: 6 },

  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { color: "#022c22", fontSize: 18, fontWeight: "700" },
  qty: { color: "#e6eef3", marginHorizontal: 12 },

  remove: { marginLeft: "auto" },
  removeText: { color: "#ef4444" },

  total: {
    color: "#22c55e",
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 12,
  },
  payBtn: {
    backgroundColor: "#22c55e",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  payText: { color: "#022c22", fontWeight: "700", fontSize: 16 },
});
