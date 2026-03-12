import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf, Menu, X, Sparkles, Scan, ArrowRight, Check,
  Search, CheckSquare, MessageCircle, ShoppingCart,
  TrendingUp, Box, Camera, Lock, FlaskConical, Bug,
} from "lucide-react";

// Mock asset if missing
const appMockup = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop";

/* ───── data ───── */
const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Services", href: "#services" },
  { label: "Premium", href: "#premium" },
];

const features = [
  { icon: Scan, title: "Weed Scanner", description: "Point your camera and get instant AI-powered weed identification.", tone: "primary" },
  { icon: FlaskConical, title: "Soil Test", description: "Scan soil color & texture for quick composition tips and recommendations.", tone: "secondary" },
  { icon: TrendingUp, title: "Growth Tracker", description: "Monitor plant health over time with visual progress tracking.", tone: "primary" },
  { icon: Leaf, title: "Companions", description: "Discover which plants thrive together for a healthier garden.", tone: "accent" },
  { icon: Camera, title: "Share Garden", description: "Capture and share your garden's beauty with the community.", tone: "destructive" },
  { icon: Bug, title: "Disease Detection", description: "Identify plant diseases early with AR-powered analysis.", tone: "primary" },
];

const services = [
  { icon: Search, label: "Explore", sub: "Plants & tips", tone: "secondary" },
  { icon: Leaf, label: "Companions", sub: "Plant buddies", tone: "accent" },
  { icon: CheckSquare, label: "Tasks", sub: "Daily checklist", tone: "accent" },
  { icon: MessageCircle, label: "Forum", sub: "Ask & help", tone: "secondary" },
  { icon: ShoppingCart, label: "Cart", sub: "Your items", tone: "destructive" },
  { icon: TrendingUp, label: "Growth", sub: "Track plants", tone: "primary", locked: true },
  { icon: Box, label: "Plant Tracker", sub: "AR & Disease", tone: "primary", locked: true },
  { icon: Camera, label: "Share", sub: "2 free uses", tone: "destructive" },
];

const perks = [
  "Unlimited plant scanning & identification",
  "Growth tracking with visual timeline",
  "AR plant disease detection",
  "Unlimited garden sharing",
  "Priority weather alerts",
  "Ad-free experience",
];

const featureTone = {
  primary: "bg-primary/15 text-primary",
  secondary: "bg-secondary/15 text-secondary",
  accent: "bg-accent/15 text-accent",
  destructive: "bg-destructive/15 text-destructive",
};

const serviceTone = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

/* ───── page ───── */
const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container flex items-center justify-between h-16 px-6 mx-auto max-w-6xl">
          <a href="#" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">GardeniAR</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{l.label}</a>
            ))}
            <a href="#download" className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">Get the App</a>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden border-b border-border bg-background overflow-hidden">
              <div className="flex flex-col gap-4 p-6">
                {navLinks.map((l) => (
                  <a key={l.label} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMenuOpen(false)}>{l.label}</a>
                ))}
                <a href="#download" className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold text-center" onClick={() => setMenuOpen(false)}>Get the App</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="container relative z-10 px-6 mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground">AI-Powered Gardening</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
                Grow smarter, <span className="text-primary">every day</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                Scan plants, test soil, track growth, and get personalized tips — all powered by AI and augmented reality.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#download" className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                  <Scan className="w-5 h-5" /> Download Free
                </a>
                <a href="#features" className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-muted text-foreground font-bold text-sm hover:bg-muted/80 transition-colors">
                  Explore Features <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-[60px]" />
                <img src={appMockup} alt="GardeniAR app" className="relative w-80 lg:w-96 rounded-3xl shadow-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative py-24 bg-muted/30">
        <div className="container px-6 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything your garden needs</h2>
            <p className="text-muted-foreground max-w-md mx-auto">From AI scanning to growth tracking — smart tools for every gardener.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-colors">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${featureTone[f.tone as keyof typeof featureTone]}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="download" className="border-t border-border py-16">
        <div className="container px-6 mx-auto max-w-6xl text-center">
          <p className="text-xs text-muted-foreground">© 2026 GardeniAR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
