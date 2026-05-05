import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, CheckCircle2, Award, 
  Box, Camera, TrendingUp, Zap,
  ShieldCheck, Loader2, ArrowRight,
  Leaf, Info, Star, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Premium = () => {
  const { user, updatePremium } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const plans = [
    {
      id: 'monthly',
      name: 'Garden Pro',
      price: '৳299',
      period: '/month',
      description: 'Perfect for enthusiasts',
      features: [
        'Unlimited AI Plant Identification',
        'Advanced Growth Tracking',
        'Unlimited Garden Sharing',
        'Priority AI Care Advice',
        'Early access to new features'
      ],
      color: 'primary'
    },
    {
      id: 'yearly',
      name: 'Garden Master',
      price: '৳2,499',
      period: '/year',
      description: 'Best value for long-term growth',
      features: [
        'Everything in Pro',
        'Personalized Seasonal Planning',
        'Direct Expert Support',
        'No Ads in Community',
        'Exclusive AR Visualizers'
      ],
      color: 'accent',
      recommended: true
    }
  ];

  const handleSubscribe = async (planId) => {
    setLoading(true);
    // Simulate payment gateway
    setTimeout(async () => {
      const res = await updatePremium(true);
      if (res.success) {
        setSuccess(true);
      } else {
        alert('Payment failed. Please try again.');
      }
      setLoading(false);
    }, 2000);
  };

  if (success) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-accent-foreground shadow-2xl shadow-accent/50"
      >
        <Star size={48} fill="currentColor" />
      </motion.div>
      <div className="space-y-2">
        <h2 className="text-4xl font-bold">Welcome to Pro!</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
            Your premium features are now unlocked. Start growing your best garden yet.
        </p>
      </div>
      <button 
        onClick={() => navigate('/')}
        className="bg-primary text-primary-foreground font-bold px-12 py-4 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20"
      >
        Explore Premium Features
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-accent bg-accent/10 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-accent/20">
            <Sparkles size={14} /> Upgrade Your Garden
        </div>
        <h1 className="text-5xl font-bold">Unlock the Full Potential</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of smart gardeners using our AI-powered premium tools to grow healthier, happier plants.
        </p>
      </header>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
            { icon: Box, title: 'Immersive AR', desc: 'Visualize your plants at full growth before you even plant them.', color: 'text-primary' },
            { icon: Camera, title: 'Unlimited AI', desc: 'Scan as many plants and soil samples as you need, no limits.', color: 'text-secondary' },
            { icon: TrendingUp, title: 'Advanced Growth', desc: 'Predictive harvesting dates based on real-time weather data.', color: 'text-accent' }
        ].map((f, i) => (
            <div key={i} className="p-8 bg-surface border border-border rounded-[2rem] space-y-4">
                <div className={`w-12 h-12 rounded-2xl bg-muted/20 flex items-center justify-center ${f.color}`}>
                    <f.icon size={24} />
                </div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
        ))}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
            <div 
                key={plan.id}
                className={`p-10 rounded-[2.5rem] border-2 flex flex-col relative transition-all ${
                    plan.recommended 
                        ? 'bg-surface border-accent shadow-2xl shadow-accent/5' 
                        : 'bg-surface border-border hover:border-primary/50'
                }`}
            >
                {plan.recommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground rounded-full text-xs font-bold uppercase">
                        Most Popular
                    </div>
                )}
                
                <div className="space-y-2 mb-8">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground font-medium">{plan.period}</span>
                </div>

                <div className="space-y-4 flex-1 mb-10">
                    {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-primary shrink-0" />
                            <span className="text-sm font-medium">{feature}</span>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading}
                    className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                        plan.recommended 
                            ? 'bg-accent text-accent-foreground hover:opacity-90 shadow-xl shadow-accent/20' 
                            : 'bg-primary text-primary-foreground hover:opacity-90 shadow-xl shadow-primary/20'
                    }`}
                >
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <>Get Started <ArrowRight size={20} /></>
                    )}
                </button>
            </div>
        ))}
      </div>

      <div className="p-8 bg-surface border border-border rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <ShieldCheck size={28} />
            </div>
            <div>
                <h4 className="font-bold">Secure Checkout</h4>
                <p className="text-xs text-muted-foreground">SSL Encrypted & Safe Payments</p>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-surface bg-muted/20 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                    </div>
                ))}
            </div>
            <p className="text-sm font-bold text-muted-foreground">Join 10k+ Pro Gardeners</p>
        </div>
      </div>
    </div>
  );
};

export default Premium;
