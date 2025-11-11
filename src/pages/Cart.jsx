import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../auth/SupabaseAuthProvider.jsx'; // ✅

export default function Cart() {
  const { items, setQty, removeFromCart, clearCart, subtotal } = useCart();
  const { user } = useAuth(); // ✅

  if (items.length === 0) return <p className="muted">No hay productos en el carrito.</p>;

  return (
    <div>
      <h2 className="h2">Carrito de compras</h2>

      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((it) => (
          <div key={it.id} className="cart-item">
            {it.image_url
              ? <img src={it.image_url} alt={it.name} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />
              : <div style={{ width: 80, height: 60, background: '#f2f2f2', borderRadius: 6 }} />
            }

            <div>
              <div style={{ fontWeight: 600 }}>{it.name}</div>
              <div className="muted">${it.price.toLocaleString('es-AR')}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button className="btn" onClick={() => setQty(it.id, it.qty - 1)}>-</button>
              <input
                className="input"
                type="number"
                min={1}
                value={it.qty}
                onChange={(e) => setQty(it.id, Number(e.target.value || 1))}
                style={{ width: 64, textAlign: 'center' }}
              />
              <button className="btn" onClick={() => setQty(it.id, it.qty + 1)}>+</button>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div><strong>${(it.qty * it.price).toLocaleString('es-AR')}</strong></div>
              <button className="btn" style={{ marginTop: 6 }} onClick={() => removeFromCart(it.id)}>Quitar</button>
            </div>
          </div>
        ))}
      </div>

      <div className="subtotal">
        <button className="btn" onClick={clearCart}>Vaciar carrito</button>
        <div style={{ fontSize: 18 }}>
          Subtotal: <strong>${subtotal.toLocaleString('es-AR')}</strong>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          className="btn primary"
          onClick={() => {
            if (!user) {
              alert('Para comprar necesitás iniciar sesión o registrarte.');
              window.location.href = '/login';
              return;
            }
          }}
        >
          Ir a pagar
        </button>
      </div>
    </div>
  );
}
