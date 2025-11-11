import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext.jsx';


export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error al cargar producto:', error);
        setLoading(false);
      } else {
        setProduct(data);
        setMainImage(data.image_url);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleImageChange = (img) => {
    if (img !== mainImage) {
      setImageLoading(true);
      setMainImage(img);
      setTimeout(() => setImageLoading(false), 300);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    // Opcional: mostrar notificación
  };

  if (loading) {
    return (
      <div className="luxury-detail-loading">
        <div className="loading-spinner"></div>
        <p>Cargando vehículo...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="luxury-detail-error">
        <h2>Vehículo no encontrado</h2>
        <button className="luxury-btn-secondary" onClick={() => navigate('/')}>
          Volver al catálogo
        </button>
      </div>
    );
  }

  const allImages = [product.image_url, ...(product.galeria || [])].filter(Boolean);

  return (
    <div className="luxury-car-detail">
      {/* Botón volver */}
      <button className="back-button" onClick={() => navigate('/')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        VOLVER
      </button>

      {/* Header con nombre */}
      <div className="detail-header">
        <h1 className="detail-title">{product.name}</h1>
        <div className="title-divider"></div>
        <p className="detail-subtitle">Vehículo de colección exclusivo</p>
      </div>

      <div className="detail-container">
        {/* Columna izquierda: Imágenes */}
        <div className="detail-gallery">
          <div className={`main-image-container ${imageLoading ? 'loading' : ''}`}>
            <img 
              src={mainImage} 
              alt={product.name} 
              className="main-image"
            />
          </div>

          {allImages.length > 1 && (
            <div className="thumbnail-gallery">
              {allImages.map((img, i) => (
                <div
                  key={i}
                  className={`thumbnail-wrapper ${img === mainImage ? 'active' : ''}`}
                  onClick={() => handleImageChange(img)}
                >
                  <img
                    src={img}
                    alt={`Vista ${i + 1}`}
                    className="thumbnail-image"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna derecha: Información */}
        <div className="detail-info">
          {/* Precio */}
          <div className="price-section">
            <span className="price-label">PRECIO</span>
            <div className="price-amount">
              ${Number(product.price).toLocaleString('es-AR')}
              <span className="price-currency">USD</span>
            </div>
          </div>

          {/* Especificaciones */}
          <div className="specs-section">
            <h3 className="specs-title">ESPECIFICACIONES</h3>
            
            {product.motor && (
              <div className="spec-item">
                <div className="spec-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="spec-content">
                  <span className="spec-label">Motor</span>
                  <span className="spec-value">{product.motor}</span>
                </div>
              </div>
            )}

            {product.detalles && (
              <div className="spec-item">
                <div className="spec-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="spec-content">
                  <span className="spec-label">Detalles</span>
                  <span className="spec-value">{product.detalles}</span>
                </div>
              </div>
            )}

            {product.type && (
              <div className="spec-item">
                <div className="spec-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="spec-content">
                  <span className="spec-label">Tipo</span>
                  <span className="spec-value">{product.type === 'auto' ? 'Automóvil' : 'Motocicleta'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Métodos de pago */}
          <div className="payment-section">
            <h3 className="payment-title">MÉTODOS DE PAGO ACEPTADOS</h3>
            <div className="payment-logos">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" 
                alt="Visa" 
                className="payment-logo"
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" 
                alt="MasterCard" 
                className="payment-logo"
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Mercado_Pago.svg/512px-Mercado_Pago.svg.png" 
                alt="Mercado Pago" 
                className="payment-logo"
              />
            </div>
          </div>

          {/* Botón añadir al carrito */}
          <button className="luxury-btn-primary" onClick={handleAddToCart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            AÑADIR AL CARRITO
          </button>

          {/* Información adicional */}
          <div className="additional-info">
            <p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Garantía de autenticidad
            </p>
            <p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Envío asegurado
            </p>
            <p>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Documentación completa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}