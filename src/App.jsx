import React, { useEffect, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Admin from './pages/Admin.jsx';                 
import { AdminOnly } from './auth/Guards.jsx';         
import { useCart } from './context/CartContext.jsx';
import { useAuth } from './auth/SupabaseAuthProvider.jsx'; 
import './App.css';
import CarDetail from './pages/CarDetail.jsx';
import { useNavigate } from 'react-router-dom';

const THEME_KEY = 'gen-t:theme';

export default function App() {
  const { count } = useCart();
  const { isAdmin } = useAuth(); 
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_KEY, theme);
    } else {
      root.removeAttribute('data-theme');
      localStorage.removeItem(THEME_KEY);
    }
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cycleTheme = () => setTheme(prev => (prev == null ? 'dark' : prev === 'dark' ? 'light' : null));

  return (
    <div className="shell">
      <header className="nav" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--card)',
        boxShadow: scrolled ? '0 6px 18px rgba(0,0,0,.08)' : 'none'
      }}>
          <h1><Link to="/">RAMBOCARS</Link></h1>
        <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/cart" className="badge">
            Carrito {count > 0 && <span className="dot">{count}</span>}
          </Link>
          <Link to="/login">Login</Link>
          {isAdmin && <Link to="/admin">Admin</Link>}
        </nav>

        <button className="btn theme-toggle" onClick={cycleTheme} title="Cambiar tema">
          {theme === 'dark' ? '🌙 Oscuro' : theme === 'light' ? '☀️ Claro' : '🖥️ Sistema'}
        </button>
      </header>

      <Routes>
         <Route path="/" element={<Home theme={theme} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/car/:id" element={<CarDetail />} />
        <Route
          path="/admin"
          element={
            <AdminOnly>
              <Admin />
            </AdminOnly>
          }
        />
       
      </Routes>
    </div>
  );
};
