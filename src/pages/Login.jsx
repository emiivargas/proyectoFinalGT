import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../auth/SupabaseAuthProvider.jsx';

export default function Login() {
  const { user } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true); setErr(null); setMsg(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin }
        });
        if (error) throw error;
        setMsg('Cuenta creada. Revisá tu email para verificar la dirección antes de iniciar sesión.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMsg('¡Sesión iniciada!');
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  if (user) {
    return (
      <div>
        <h2 className="h2">Mi cuenta</h2>
        <p>Estás logueado como <strong>{user.email}</strong>.</p>
        <button className="btn" onClick={logout}>Cerrar sesión</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2 className="h2">{mode === 'signup' ? 'Crear cuenta' : 'Iniciar sesión'}</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button className="btn" onClick={() => setMode('login')}  disabled={mode==='login'}>Login</button>
        <button className="btn" onClick={() => setMode('signup')} disabled={mode==='signup'}>Registro</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
        <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn primary" disabled={busy}>{busy ? 'Procesando…' : (mode==='signup' ? 'Crear cuenta' : 'Entrar')}</button>
      </form>

      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
      {err && <p className="alert" style={{ marginTop: 10 }}>{err}</p>}
    </div>
  );
}
