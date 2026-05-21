import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { BACKEND } from "../config";
import { useTheme } from "../hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

/* ================= VALIDATION ================= */
const isValidPhone      = (v) => /^[0-9]{10,15}$/.test(v);
const isValidCardNumber = (v) => /^[0-9]{16}$/.test(v);
const isValidCardName   = (v) => /^[A-Za-z ]{3,}$/.test(v);
const isValidExpiry     = (v) => /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(v);
const isValidCVV        = (v) => /^[0-9]{3}$/.test(v);

/* ================= SCREEN ================= */
export default function PaymentScreen() {
  const router = useRouter();
  const { colors, resolvedTheme } = useTheme();

  const [cart, setCart]       = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${BACKEND}/api/cart`);
        const data = await res.json();
        if (mounted) {
          setCart(Array.isArray(data.items) ? data.items : []);
        }
      } catch (e) {
        if (mounted) setCart([]);
      } finally {
        if (mounted) setCartLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  const [address,       setAddress]       = useState("");
  const [phone,         setPhone]         = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber,    setCardNumber]    = useState("");
  const [cardName,      setCardName]      = useState("");
  const [expiry,        setExpiry]        = useState("");
  const [cvv,           setCvv]           = useState("");
  const [paying,        setPaying]        = useState(false);

  /* ================= PAY ================= */
  const handlePay = async () => {
    if (!address.trim()) {
      Alert.alert("Error", "Please enter delivery address"); return;
    }
    if (!isValidPhone(phone)) {
      Alert.alert("Error", "Enter a valid phone number"); return;
    }
    if (!paymentMethod) {
      Alert.alert("Error", "Select payment method"); return;
    }
    if (paymentMethod === "card") {
      if (!isValidCardNumber(cardNumber)) {
        Alert.alert("Error", "Card number must be 16 digits"); return;
      }
      if (!isValidCardName(cardName)) {
        Alert.alert("Error", "Enter valid card holder name"); return;
      }
      if (!isValidExpiry(expiry)) {
        Alert.alert("Error", "Expiry must be MM/YY"); return;
      }
      if (!isValidCVV(cvv)) {
        Alert.alert("Error", "CVV must be 3 digits"); return;
      }
    }

    setPaying(true);
    try {
      const orderData = {
        address,
        paymentMethod,
        items: cart,
        paymentStatus: paymentMethod === "cash" ? "cod" : "paid",
      };
      await fetch(`${BACKEND}/api/order/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      await fetch(`${BACKEND}/api/cart`, { method: "DELETE" });
      Alert.alert("Payment Successful", "Your order has been placed 🌱", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (e) {
      Alert.alert("Error", "Could not complete payment");
    } finally {
      setPaying(false);
    }
  };

  /* ================= UI ================= */
  if (cartLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>

        {/* ORDER SUMMARY */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Order Summary</Text>
          <FlatList
            data={cart}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.summaryRow}>
                <Text style={[styles.cartText, { color: colors.textMuted }]}>
                  {item.name} × {item.quantity}
                </Text>
                <Text style={[styles.cartText, { color: colors.textMuted }]}>
                  Tk {(item.price ?? 0) * (item.quantity ?? 1)}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={[styles.emptyCart, { color: colors.textMuted }]}>Your cart is empty.</Text>
            }
          />
          <Text style={[styles.total, { color: colors.primary }]}>Total: Tk {totalPrice}</Text>
        </View>

        {/* DELIVERY DETAILS */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Delivery Details</Text>
          <TextInput
            placeholder="Delivery Address"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            placeholder="Contact Number"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            keyboardType="numeric"
            maxLength={15}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* PAYMENT METHOD */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Payment Method</Text>
          <View style={styles.methodRow}>
            <TouchableOpacity
              style={[styles.methodBtn, { borderColor: colors.border }, paymentMethod === "cash" && [styles.selected, { backgroundColor: colors.primary, borderColor: colors.primary }]]}
              onPress={() => setPaymentMethod("cash")}
            >
              <Text style={[styles.methodText, { color: paymentMethod === 'cash' ? '#000' : colors.text }]}>Cash on Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.methodBtn, { borderColor: colors.border }, paymentMethod === "card" && [styles.selected, { backgroundColor: colors.primary, borderColor: colors.primary }]]}
              onPress={() => setPaymentMethod("card")}
            >
              <Text style={[styles.methodText, { color: paymentMethod === 'card' ? '#000' : colors.text }]}>Credit / Debit Card</Text>
            </TouchableOpacity>
          </View>

          {paymentMethod === "card" && (
            <View style={{ marginTop: 10 }}>
              <TextInput
                placeholder="Card Number"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                keyboardType="numeric"
                maxLength={16}
                value={cardNumber}
                onChangeText={setCardNumber}
              />
              <TextInput
                placeholder="Card Holder Name"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={cardName}
                onChangeText={setCardName}
              />
              <View style={styles.cardRow}>
                <TextInput
                  placeholder="MM/YY"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, styles.smallInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  maxLength={5}
                  value={expiry}
                  onChangeText={setExpiry}
                />
                <TextInput
                  placeholder="CVV"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, styles.smallInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={3}
                  value={cvv}
                  onChangeText={setCvv}
                />
              </View>
            </View>
          )}
        </View>

        {/* PAY BUTTON */}
        <TouchableOpacity
          style={[styles.payBtn, { backgroundColor: colors.primary }, (paying || cart.length === 0) && { opacity: 0.6 }]}
          onPress={handlePay}
          disabled={paying || cart.length === 0}
        >
          {paying
            ? <ActivityIndicator color="#000" />
            : <Text style={[styles.payText, { color: '#000' }]}>Pay Tk {totalPrice}</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },

  card: {
    borderRadius: 14, padding: 16,
    marginBottom: 18, borderWidth: 1,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },

  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
  cartText: { fontSize: 15 },
  emptyCart: { fontStyle: "italic", textAlign: "center", paddingVertical: 8 },
  total: { fontSize: 18, fontWeight: "bold", marginTop: 10 },

  input: {
    borderRadius: 10, padding: 12,
    marginVertical: 6, borderWidth: 1,
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  smallInput: { flex: 1, marginHorizontal: 4 },

  methodRow: { flexDirection: "row", marginTop: 10 },
  methodBtn: {
    flex: 1, padding: 12, borderRadius: 10, borderWidth: 1,
    alignItems: "center", marginHorizontal: 4,
  },
  selected: { },
  methodText: { fontWeight: "500" },

  payBtn: {
    padding: 16, borderRadius: 14,
    alignItems: "center", marginBottom: 40,
  },
  payText: { fontSize: 18, fontWeight: "bold" },
});
