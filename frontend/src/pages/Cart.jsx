import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingCart, Trash2, Plus, Minus, 
  ArrowLeft, CreditCard, ShoppingBag,
  Loader2, ChevronRight, Info, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/cart`);
      setCart(Array.isArray(res.data.items) ? res.data.items : []);
    } catch (err) {
      console.error("Load cart failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (item, delta) => {
    const updated = cart
      .map(i =>
        i._id === item._id
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      )
      .filter(i => i.quantity > 0);

    try {
      await axios.post(`${BACKEND_URL}/api/cart`, { items: updated });
      setCart(updated);
    } catch (err) {
      console.error("Update qty failed", err);
    }
  };

  const removeItem = async (id) => {
    const updated = cart.filter(i => i._id !== id);
    try {
      await axios.post(`${BACKEND_URL}/api/cart`, { items: updated });
      setCart(updated);
    } catch (err) {
      console.error("Remove item failed", err);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-primary w-12 h-12" />
      <p className="text-muted-foreground">Loading your cart...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground mt-1">{cart.length} items in your bag</p>
        </div>
        <ShoppingCart className="text-primary w-10 h-10 opacity-50" />
      </header>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-border rounded-3xl space-y-6">
          <div className="w-24 h-24 bg-muted/10 rounded-full flex items-center justify-center mx-auto text-muted-foreground opacity-20">
            <ShoppingBag size={48} />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Your cart is empty</h3>
            <p className="text-muted-foreground mt-1">Looks like you haven't added anything yet.</p>
          </div>
          <button 
            onClick={() => navigate('/explore')}
            className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-2xl inline-flex items-center gap-2 hover:opacity-90 transition-all"
          >
            Go Exploring <ArrowRight size={20} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div 
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface border border-border rounded-3xl p-4 md:p-6 flex gap-6 group hover:border-primary/30 transition-all"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-muted/20 shrink-0">
                    <img src={item.image || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">৳{item.price} each</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item._id)}
                        className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-3 bg-background border border-border rounded-xl p-1">
                        <button 
                          onClick={() => updateQty(item, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQty(item, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="font-bold text-lg text-primary">৳{item.price * item.quantity}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-3xl p-6 space-y-6 sticky top-24">
              <h3 className="text-xl font-bold">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-bold text-foreground">৳{total}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-primary font-bold">Free</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">৳{total}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                <Info size={18} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Free shipping on all orders over ৳500. Delivery usually takes 2-4 business days.
                </p>
              </div>

              <button 
                onClick={() => navigate('/payment')}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-primary/20"
              >
                Checkout <ChevronRight size={20} />
              </button>
              
              <Link to="/explore" className="block text-center text-sm font-bold text-muted-foreground hover:text-primary transition-all">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
