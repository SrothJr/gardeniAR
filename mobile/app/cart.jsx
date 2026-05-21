import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BACKEND } from "../config";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
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
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        <TouchableOpacity onPress={() => removeItem(item._id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.removeX, { color: colors.textMuted }]}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subRow}>
        <Text style={[styles.price, { color: colors.textMuted }]}>{t('cart.price_tk', { price: item.price })}</Text>
        <Text style={[styles.subtotal, { color: colors.primary }]}>{t('cart.subtotal', { price: item.price * item.quantity })}</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={[styles.qtyBtn, { backgroundColor: colors.primary }]} onPress={() => updateQty(item, -1)}>
          <Text style={[styles.qtyText, { color: "#000" }]}>−</Text>
        </TouchableOpacity>
        <Text style={[styles.qty, { color: colors.text }]}>{item.quantity}</Text>
        <TouchableOpacity style={[styles.qtyBtn, { backgroundColor: colors.primary }]} onPress={() => updateQty(item, 1)}>
          <Text style={[styles.qtyText, { color: "#000" }]}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeItem(item._id)} style={styles.remove}>
          <Text style={styles.removeText}>{t('cart.remove')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.page, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('cart.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {cart.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textMuted }]}>{t('cart.empty')}</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <View style={[styles.summaryBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View>
          <Text style={[styles.totalLabel, { color: colors.textMuted }]}>{t('cart.total')}</Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>{t('cart.price_tk', { price: total })}</Text>
        </View>
        <TouchableOpacity
          style={[styles.payBtn, { backgroundColor: colors.primary }, cart.length === 0 && styles.payBtnDisabled]}
          onPress={() => router.push("/payment")}
          disabled={cart.length === 0}
        >
          <Text style={[styles.payText, { color: "#000" }]}>{t('cart.checkout')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  backBtn: {
    padding: 4,
  },
  empty: { marginTop: 40, textAlign: "center" },

  card: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontWeight: "800", fontSize: 16 },
  removeX: { fontSize: 18, fontWeight: "700" },
  subRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  price: { },
  subtotal: { fontWeight: "700" },

  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { fontSize: 18, fontWeight: "900" },
  qty: { marginHorizontal: 12, fontWeight: "800" },

  remove: { marginLeft: "auto" },
  removeText: { color: "#ef4444" },

  summaryBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: { fontSize: 12 },
  totalValue: { fontSize: 18, fontWeight: "800" },
  payBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  payBtnDisabled: { opacity: 0.6 },
  payText: { fontWeight: "900", fontSize: 15 },
});
