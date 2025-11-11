import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Admin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [form, setForm] = useState({ name: '', price: '', image_url: '' });
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true); setErr(null);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    if (error) setErr(error.message);
    setList(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createProduct(e) {
    e.preventDefault();
    setBusy(true); setErr(null);
    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      image_url: form.image_url.trim() || null
    };
    const { error } = await supabase.from('products').insert(payload);
    if (error) setErr(error.message);
    setForm({ name: '', price: '', image_url: '' });
    setBusy(false);
    load();
  }

  async function updateProduct(p) {
    const { error } = await supabase
      .from('products')
      .update({
        name: p.name,
        price: Number(p.price),
        image_url: p.image_url || null
      })
      .eq('id', p.id);
    if (error) alert(error.message);
    else load();
  }

  async function deleteProduct(id) {
    if (!confirm('¿Eliminar producto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert(error.message);
    else load();
  }

  if (loading) return <p className="muted">Cargando…</p>;
  if (err) return <p className="alert">Error: {err}</p>;

  return (
    <div>
      <h2 className="h2">Panel de administración</h2>

      {/* Crear producto */}
      <form onSubmit={createProduct} style={{ display:'grid', gap:8, maxWidth:520, marginBottom:16 }}>
        <input
          className="input"
          placeholder="Nombre"
          value={form.name}
          onChange={e=>setForm(f=>({...f, name:e.target.value}))}
          required
        />
        <input
          className="input"
          placeholder="Precio"
          type="number"
          value={form.price}
          onChange={e=>setForm(f=>({...f, price:e.target.value}))}
          required
        />
        <input
          className="input"
          placeholder="URL de imagen (opcional)"
          value={form.image_url}
          onChange={e=>setForm(f=>({...f, image_url:e.target.value}))}
        />
        <button className="btn primary" disabled={busy}>
          {busy ? 'Creando…' : 'Agregar producto'}
        </button>
      </form>

      {/* Editar / eliminar */}
      <div style={{ display:'grid', gap:12 }}>
        {list.map(p => (
          <div key={p.id} className="cart-item" style={{ gridTemplateColumns:'80px 1fr auto auto auto' }}>
            {p.image_url
              ? <img src={p.image_url} alt={p.name} style={{ width:80, height:60, objectFit:'cover', borderRadius:6 }} />
              : <div style={{ width:80, height:60, background:'#f2f2f2', borderRadius:6 }} />
            }

            <div style={{ display:'grid', gap:6 }}>
              <input
                className="input"
                value={p.name}
                onChange={e=>setList(prev=>prev.map(x=>x.id===p.id?{...x, name:e.target.value}:x))}
              />
              <input
                className="input"
                type="number"
                value={p.price}
                onChange={e=>setList(prev=>prev.map(x=>x.id===p.id?{...x, price:e.target.value}:x))}
              />
              <input
                className="input"
                placeholder="URL imagen"
                value={p.image_url || ''}
                onChange={e=>setList(prev=>prev.map(x=>x.id===p.id?{...x, image_url:e.target.value}:x))}
              />
            </div>

            <button className="btn" onClick={()=>updateProduct(p)}>Guardar</button>
            <button className="btn" onClick={()=>deleteProduct(p.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
