

// // app/payment.jsx
// import React, { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
// import { BACKEND } from "../config";
// import { useRouter } from "expo-router";

// export default function Payment() {
//   const router = useRouter();
//   const [cart, setCart] = useState([]);

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
//     if (cart.length === 0) {
//       Alert.alert("Cart empty", "Add items before payment");
//       return;
//     }

//     const orderData = {
//       address: "Demo address",
//       paymentMethod: "cash",
//       items: cart,
//       paymentStatus: "paid", // demo
//     };

//     try {
//       // 1️⃣ Create order
//       const res = await fetch(`${BACKEND}/api/order/checkout`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orderData),
//       });

//       if (!res.ok) throw new Error("Order failed");

//       // 2️⃣ Clear cart AFTER payment
//       await fetch(`${BACKEND}/api/cart`, { method: "DELETE" });

//       Alert.alert("Success", "Payment successful 🌱");
//       router.replace("/");
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Payment failed");
//     }
//   };

//   return (
//     <View style={styles.page}>
//       <Text style={styles.title}>Payment</Text>

//       <ScrollView>
//         {cart.length === 0 ? (
//           <Text style={styles.empty}>Your cart is empty</Text>
//         ) : (
//           cart.map(item => (
//             <View key={item._id} style={styles.item}>
//               <Text style={styles.name}>
//                 {item.name} × {item.quantity}
//               </Text>
//               <Text style={styles.sub}>
//                 Tk {item.price} × {item.quantity} = Tk {item.price * item.quantity}
//               </Text>
//             </View>
//           ))
//         )}
//       </ScrollView>

//       <Text style={styles.total}>Total: Tk {total}</Text>

//       <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
//         <Text style={styles.payText}>Pay Now</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   page: { flex: 1, padding: 16, backgroundColor: "#071024" },
//   title: { color: "#e6eef3", fontSize: 22, fontWeight: "700", marginBottom: 12 },
//   empty: { color: "#94a3b8", marginTop: 40, textAlign: "center" },

//   item: { marginBottom: 12 },
//   name: { color: "#e6eef3", fontWeight: "700" },
//   sub: { color: "#94a3b8" },

//   total: { color: "#22c55e", fontSize: 18, fontWeight: "700", marginVertical: 12 },
//   payBtn: {
//     backgroundColor: "#22c55e",
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   payText: { color: "#022c22", fontWeight: "700", fontSize: 16 },
// });


// app/payment.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { BACKEND } from "../config";
import { useRouter } from "expo-router";

export default function Payment() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // 🔹 Load cart from backend
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

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePay = async () => {
    if (cart.length === 0)
      return Alert.alert("Cart empty", "Add items first");

    if (!address.trim())
      return Alert.alert("Missing address", "Enter delivery address");

    if (!phone.trim())
      return Alert.alert("Missing contact", "Enter phone number");

    const orderData = {
      address,
      paymentMethod,
      items: cart,
      paymentStatus: "paid", // demo
    };

    try {
      await fetch(`${BACKEND}/api/order/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      // clear cart AFTER order
      await fetch(`${BACKEND}/api/cart`, { method: "DELETE" });

      Alert.alert("Success", "Order placed successfully 🌱");
      router.replace("/");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Payment failed");
    }
  };

  return (
    <ScrollView style={styles.page}>
      <Text style={styles.title}>Payment Details</Text>

      {/* 🔹 ORDER SUMMARY */}
      <Text style={styles.section}>Order Summary</Text>
      {cart.map(item => (
        <View key={item._id} style={styles.summaryCard}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemSub}>
            {item.quantity} × Tk {item.price} = Tk{" "}
            {item.quantity * item.price}
          </Text>
        </View>
      ))}

      <View style={styles.totalBox}>
        <Text style={styles.totalText}>Total: Tk {total}</Text>
      </View>

      {/* 🔹 DELIVERY ADDRESS */}
      <Text style={styles.section}>Delivery Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter delivery address"
        placeholderTextColor="#94a3b8"
        value={address}
        onChangeText={setAddress}
      />

      {/* 🔹 CONTACT */}
      <Text style={styles.section}>Contact Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        placeholderTextColor="#94a3b8"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {/* 🔹 PAYMENT METHOD */}
      <Text style={styles.section}>Payment Method</Text>

      <TouchableOpacity
        style={[
          styles.method,
          paymentMethod === "cash" && styles.methodActive,
        ]}
        onPress={() => setPaymentMethod("cash")}
      >
        <Text style={styles.methodText}>💵 Cash on Delivery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.method,
          paymentMethod === "card" && styles.methodActive,
        ]}
        onPress={() => setPaymentMethod("card")}
      >
        <Text style={styles.methodText}>💳 Card Payment</Text>
      </TouchableOpacity>

      {/* 🔹 PAY */}
      <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
        <Text style={styles.payText}>Pay Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#071024", padding: 16 },
  title: { color: "#e6eef3", fontSize: 22, fontWeight: "700", marginBottom: 12 },

  section: {
    color: "#94a3b8",
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },

  summaryCard: {
    backgroundColor: "#0b1220",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemName: { color: "#e6eef3", fontWeight: "700" },
  itemSub: { color: "#94a3b8" },

  totalBox: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  totalText: { color: "#ecfdf5", fontWeight: "700", textAlign: "center" },

  input: {
    backgroundColor: "#0b1220",
    borderRadius: 10,
    padding: 12,
    color: "#e6eef3",
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  method: {
    backgroundColor: "#0b1220",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  methodActive: {
    borderColor: "#22c55e",
    backgroundColor: "#052e1c",
  },
  methodText: { color: "#e6eef3", fontWeight: "600" },

  payBtn: {
    backgroundColor: "#22c55e",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  payText: { color: "#022c22", fontWeight: "700", fontSize: 16 },
});
