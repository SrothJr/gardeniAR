
// // app/payment.jsx
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   TextInput,
// } from "react-native";
// import { BACKEND } from "../config";
// import { useRouter } from "expo-router";

// export default function Payment() {
//   const router = useRouter();

//   const [cart, setCart] = useState([]);
//   const [address, setAddress] = useState("");
//   const [phone, setPhone] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("cash");

//   // 🔹 Load cart from backend
//   const loadCart = async () => {
//     try {
//       const res = await fetch(`${BACKEND}/api/cart`);
//       const data = await res.json();
//       setCart(Array.isArray(data.items) ? data.items : []);
//     } catch (err) {
//       console.error(err);
//       setCart([]);
//     }
//   };

//   useEffect(() => {
//     loadCart();
//   }, []);

//   const total = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   const handlePay = async () => {
//     if (cart.length === 0)
//       return Alert.alert("Cart empty", "Add items first");

//     if (!address.trim())
//       return Alert.alert("Missing address", "Enter delivery address");

//     if (!phone.trim())
//       return Alert.alert("Missing contact", "Enter phone number");

//     const orderData = {
//       address,
//       paymentMethod,
//       items: cart,
//       paymentStatus: "paid", // demo
//     };

//     try {
//       await fetch(`${BACKEND}/api/order/checkout`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orderData),
//       });

//       // clear cart AFTER order
//       await fetch(`${BACKEND}/api/cart`, { method: "DELETE" });

//       Alert.alert("Success", "Order placed successfully 🌱");
//       router.replace("/");
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Payment failed");
//     }
//   };

//   return (
//     <ScrollView style={styles.page}>
//       <Text style={styles.title}>Payment Details</Text>

//       {/* 🔹 ORDER SUMMARY */}
//       <Text style={styles.section}>Order Summary</Text>
//       {cart.map(item => (
//         <View key={item._id} style={styles.summaryCard}>
//           <Text style={styles.itemName}>{item.name}</Text>
//           <Text style={styles.itemSub}>
//             {item.quantity} × Tk {item.price} = Tk{" "}
//             {item.quantity * item.price}
//           </Text>
//         </View>
//       ))}

//       <View style={styles.totalBox}>
//         <Text style={styles.totalText}>Total: Tk {total}</Text>
//       </View>

//       {/* 🔹 DELIVERY ADDRESS */}
//       <Text style={styles.section}>Delivery Address</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter delivery address"
//         placeholderTextColor="#94a3b8"
//         value={address}
//         onChangeText={setAddress}
//       />

//       {/* 🔹 CONTACT */}
//       <Text style={styles.section}>Contact Number</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter phone number"
//         placeholderTextColor="#94a3b8"
//         keyboardType="phone-pad"
//         value={phone}
//         onChangeText={setPhone}
//       />

//       {/* 🔹 PAYMENT METHOD */}
//       <Text style={styles.section}>Payment Method</Text>

//       <TouchableOpacity
//         style={[
//           styles.method,
//           paymentMethod === "cash" && styles.methodActive,
//         ]}
//         onPress={() => setPaymentMethod("cash")}
//       >
//         <Text style={styles.methodText}>💵 Cash on Delivery</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[
//           styles.method,
//           paymentMethod === "card" && styles.methodActive,
//         ]}
//         onPress={() => setPaymentMethod("card")}
//       >
//         <Text style={styles.methodText}>💳 Card Payment</Text>
//       </TouchableOpacity>

//       {/* 🔹 PAY */}
//       <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
//         <Text style={styles.payText}>Pay Now</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   page: { flex: 1, backgroundColor: "#071024", padding: 16 },
//   title: { color: "#e6eef3", fontSize: 22, fontWeight: "700", marginBottom: 12 },

//   section: {
//     color: "#94a3b8",
//     fontWeight: "600",
//     marginTop: 20,
//     marginBottom: 8,
//   },

//   summaryCard: {
//     backgroundColor: "#0b1220",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 8,
//   },
//   itemName: { color: "#e6eef3", fontWeight: "700" },
//   itemSub: { color: "#94a3b8" },

//   totalBox: {
//     backgroundColor: "#16a34a",
//     padding: 14,
//     borderRadius: 10,
//     marginTop: 10,
//   },
//   totalText: { color: "#ecfdf5", fontWeight: "700", textAlign: "center" },

//   input: {
//     backgroundColor: "#0b1220",
//     borderRadius: 10,
//     padding: 12,
//     color: "#e6eef3",
//     borderWidth: 1,
//     borderColor: "#1e293b",
//   },

//   method: {
//     backgroundColor: "#0b1220",
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#1e293b",
//   },
//   methodActive: {
//     borderColor: "#22c55e",
//     backgroundColor: "#052e1c",
//   },
//   methodText: { color: "#e6eef3", fontWeight: "600" },

//   payBtn: {
//     backgroundColor: "#22c55e",
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 20,
//     marginBottom: 30,
//   },
//   payText: { color: "#022c22", fontWeight: "700", fontSize: 16 },
// });


// mobile/app/payment.jsx
// mobile/app/payment.jsx
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

/* ================= VALIDATION ================= */
const isValidPhone      = (v) => /^[0-9]{10,15}$/.test(v);
const isValidCardNumber = (v) => /^[0-9]{16}$/.test(v);
const isValidCardName   = (v) => /^[A-Za-z ]{3,}$/.test(v);
const isValidExpiry     = (v) => /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(v);
const isValidCVV        = (v) => /^[0-9]{3}$/.test(v);

/* ================= SCREEN ================= */
export default function PaymentScreen() {
  const router = useRouter();

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
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Checkout</Text>

      {/* ORDER SUMMARY */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Order Summary</Text>
        <FlatList
          data={cart}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.summaryRow}>
              <Text style={styles.cartText}>
                {item.name} × {item.quantity}
              </Text>
              <Text style={styles.cartText}>
                Tk {(item.price ?? 0) * (item.quantity ?? 1)}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyCart}>Your cart is empty.</Text>
          }
        />
        <Text style={styles.total}>Total: Tk {totalPrice}</Text>
      </View>

      {/* DELIVERY DETAILS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Delivery Details</Text>
        <TextInput
          placeholder="Delivery Address"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          placeholder="Contact Number"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          keyboardType="numeric"
          maxLength={15}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {/* PAYMENT METHOD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Method</Text>
        <View style={styles.methodRow}>
          <TouchableOpacity
            style={[styles.methodBtn, paymentMethod === "cash" && styles.selected]}
            onPress={() => setPaymentMethod("cash")}
          >
            <Text style={styles.methodText}>Cash on Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.methodBtn, paymentMethod === "card" && styles.selected]}
            onPress={() => setPaymentMethod("card")}
          >
            <Text style={styles.methodText}>Credit / Debit Card</Text>
          </TouchableOpacity>
        </View>

        {paymentMethod === "card" && (
          <>
            <TextInput
              placeholder="Card Number"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              keyboardType="numeric"
              maxLength={16}
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <TextInput
              placeholder="Card Holder Name"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              value={cardName}
              onChangeText={setCardName}
            />
            <View style={styles.cardRow}>
              <TextInput
                placeholder="MM/YY"
                placeholderTextColor="#9ca3af"
                style={[styles.input, styles.smallInput]}
                maxLength={5}
                value={expiry}
                onChangeText={setExpiry}
              />
              <TextInput
                placeholder="CVV"
                placeholderTextColor="#9ca3af"
                style={[styles.input, styles.smallInput]}
                keyboardType="numeric"
                secureTextEntry
                maxLength={3}
                value={cvv}
                onChangeText={setCvv}
              />
            </View>
          </>
        )}
      </View>

      {/* PAY BUTTON */}
      <TouchableOpacity
        style={[styles.payBtn, (paying || cart.length === 0) && { opacity: 0.6 }]}
        onPress={handlePay}
        disabled={paying || cart.length === 0}
      >
        {paying
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.payText}>Pay Tk {totalPrice}</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071024", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#071024" },
  title: { fontSize: 26, fontWeight: "bold", color: "#ffffff", marginBottom: 20 },

  card: {
    backgroundColor: "#0b0a29", borderRadius: 14, padding: 16,
    marginBottom: 18, borderWidth: 1, borderColor: "#1f2937",
  },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#e5e7eb", marginBottom: 10 },

  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
  cartText: { fontSize: 15, color: "#d1d5db" },
  emptyCart: { color: "#64748b", fontStyle: "italic", textAlign: "center", paddingVertical: 8 },
  total: { fontSize: 18, fontWeight: "bold", color: "#22c55e", marginTop: 10 },

  input: {
    backgroundColor: "#020617", borderRadius: 10, padding: 12,
    marginVertical: 6, borderWidth: 1, borderColor: "#374151", color: "#ffffff",
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  smallInput: { flex: 1, marginHorizontal: 4 },

  methodRow: { flexDirection: "row", marginTop: 10 },
  methodBtn: {
    flex: 1, padding: 12, borderRadius: 10, borderWidth: 1,
    borderColor: "#374151", alignItems: "center", marginHorizontal: 4,
  },
  selected: { backgroundColor: "#22c55e", borderColor: "#22c55e" },
  methodText: { color: "#ffffff", fontWeight: "500" },

  payBtn: {
    backgroundColor: "#22c55e", padding: 16, borderRadius: 14,
    alignItems: "center", marginBottom: 40,
  },
  payText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
});
