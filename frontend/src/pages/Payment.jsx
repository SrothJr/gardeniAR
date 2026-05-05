import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCard, ShieldCheck, ArrowLeft, 
  CheckCircle2, Loader2, AlertCircle,
  MapPin, Phone, User, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Payment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: user?.location?.city || '',
    method: 'bkash'
  });

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/cart`);
        const items = Array.isArray(res.data.items) ? res.data.items : [];
        setCart(items);
        setTotal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
      } catch (err) {
        console.error(err);
      }
    };
    loadCart();
  }, []);

  const handleProcess = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Clear cart after success
        await axios.post(`${BACKEND_URL}/api/cart`, { items: [] });
        setSuccess(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  if (success) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground"
      >
        <CheckCircle2 size={48} />
      </motion.div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Order Placed!</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Your order has been successfully placed. You will receive a confirmation call shortly.
        </p>
      </div>
      <button 
        onClick={() => navigate('/')}
        className="bg-primary text-primary-foreground font-bold px-12 py-4 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20"
      >
        Return Home
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <button 
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 text-primary font-bold hover:bg-primary/10 px-4 py-2 rounded-xl transition-all w-fit"
      >
        <ArrowLeft size={20} />
        <span>Back to Cart</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground mt-1">Complete your order details</p>
          </div>

          <form onSubmit={handleProcess} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Shipping Details
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      required
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Shipping Address</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-surface border border-border rounded-xl py-4 px-4 outline-none focus:border-primary transition-all resize-none"
                    placeholder="House No, Street, Area..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CreditCard size={20} className="text-primary" />
                Payment Method
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {['bkash', 'Nagad', 'Rocket', 'Cash'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData({...formData, method})}
                    className={`p-4 rounded-2xl border font-bold transition-all text-center ${
                      formData.method === method ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-border text-muted-foreground hover:border-muted'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 mt-8"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={24} /> Confirm Order ৳{total}</>}
            </button>
          </form>
        </div>

        {/* Order Review */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-3xl p-8 space-y-6 sticky top-24">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                Order Review
            </h3>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/20 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="font-bold text-sm truncate max-w-[120px]">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm">৳{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-border space-y-4">
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Subtotal</span>
                <span className="font-bold text-foreground">৳{total}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Delivery Fee</span>
                <span className="text-primary font-bold">Free</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-2xl font-bold text-primary">৳{total}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-2">
                <div className="flex items-center gap-2 text-primary">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-bold">Secure Checkout</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Your personal data will be used to process your order and support your experience throughout this website.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
