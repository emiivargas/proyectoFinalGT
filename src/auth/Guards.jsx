import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './SupabaseAuthProvider.jsx';

export function AuthOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="muted">Cargando sesión…</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function AdminOnly({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <p className="muted">Cargando sesión…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
