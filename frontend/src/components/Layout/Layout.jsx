import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Leaf, Menu, X, Bell, User, LogOut, 
  Search, ShieldCheck, CheckSquare, 
  MessageCircle, ShoppingCart, TrendingUp, 
  Box, Camera, Home as HomeIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: HomeIcon, path: '/' },
    { label: 'Explore', icon: Search, path: '/explore' },
    { label: 'Forum', icon: MessageCircle, path: '/forum' },
    { label: 'Tracker', icon: Box, path: '/ar-tracker' },
    { label: 'Tasks', icon: CheckSquare, path: '/checklist' },
    { label: 'Cart', icon: ShoppingCart, path: '/cart' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border hidden lg:flex flex-col z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Leaf className="text-primary-foreground w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">GardeniAR</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <item.icon size={20} />
              <span className="font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          {user ? (
            <div className="flex items-center gap-3 px-4 py-3">
              <Link to="/profile" className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold hover:scale-105 transition-transform">
                {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                    user.name?.charAt(0).toUpperCase() || 'U'
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to="/profile" className="text-sm font-bold truncate block hover:text-primary transition-colors">{user.name}</Link>
                <button 
                  onClick={handleLogout}
                  className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 mt-1"
                >
                  <LogOut size={12} /> Log out
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/login"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all justify-center"
            >
              <User size={20} />
              Log In
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 z-50">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="text-primary w-6 h-6" />
          <span className="text-lg font-bold">GardeniAR</span>
        </Link>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted/50"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-surface z-40 lg:hidden flex flex-col pt-20"
          >
            <nav className="flex-1 px-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl ${
                    location.pathname === item.path 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'bg-muted/30 text-foreground'
                  }`}
                >
                  <item.icon size={24} />
                  <span className="text-lg font-bold">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="p-6 border-t border-border">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary text-lg font-bold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-bold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">Signed in</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-3 rounded-xl bg-destructive/10 text-destructive"
                  >
                    <LogOut size={24} />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg"
                >
                  <User size={24} />
                  Log In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
