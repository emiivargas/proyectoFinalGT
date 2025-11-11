import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';


export default function Home({theme}) {
  console.log('Tema recibido:', theme);
  const [featured, setFeatured] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [vehicleType, setVehicleType] = useState('all');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErr(null);

      const { data: featuredCar, error: featuredError } = await supabase
        .from('products')
        .select('*')
        .eq('name', 'Ferrari Z1 X3')
        .single();

      if (featuredError) console.error('Error al cargar auto destacado:', featuredError);
      else setFeatured(featuredCar);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) setErr(error.message);
      setProducts(data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -100px 0px' }
    );

    setTimeout(() => {
      const items = document.querySelectorAll('.luxury-card, .catalog-title, .filter-controls');
      items.forEach(item => observer.observe(item));
    }, 100);

    return () => observer.disconnect();
  }, [products]);

  const sortedProducts = [...products]
    .filter(p => {
      if (vehicleType === 'all') return true;
      
      const productType = (p.type || '').toLowerCase().trim();
      const filterType = vehicleType.toLowerCase().trim();
      
      return productType === filterType;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      return 0; 
    });

  console.log('Filtro actual:', vehicleType);
  console.log('Productos filtrados:', sortedProducts.length);
  console.log('Tipos disponibles:', [...new Set(products.map(p => p.type))]);

  return (
    <div className="luxury-home">
      {featured && (
        <section className="luxury-hero">
          <div className="hero-overlay" />
          <div 
            className="hero-bg"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
              opacity: Math.max(0.3, 1 - scrollY / 600)
            }}
          />
          
          <div className="hero-content-wrapper">
            <div 
              className="hero-text-box"
              style={{
                transform: `translateY(${scrollY * 0.3}px)`,
                opacity: Math.max(0, 1 - scrollY / 400)
              }}
            >
              <h1 className="luxury-title">EXCELENCIA EN MOVIMIENTO</h1>
              <div className="luxury-divider" />
              <p className="luxury-subtitle">Colección Exclusiva</p>
            </div>

            <Link to={`/car/${featured.id}`} className="featured-car-link">
              <div 
                className="featured-car-container"
                style={{
                  transform: `translateY(${scrollY * 0.2}px) scale(${1 + scrollY * 0.00005})`
                }}
              >
                <img 
                  src={featured.image_url} 
                  alt={featured.name} 
                  className="featured-car-image"
                />
                <div className="featured-car-info">
                  <h2 className="featured-name">{featured.name}</h2>
                  <div className="featured-cta">
                    <span>DESCUBRIR</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="luxury-catalog">
        <div className="catalog-intro">
          <h2 className="catalog-title">NUESTRA COLECCIÓN</h2>
          <div className="catalog-description">
            Vehículos excepcionales para clientes excepcionales
          </div>
        </div>

        <div className="filter-controls">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${vehicleType === 'all' ? 'active' : ''}`}
              onClick={() => setVehicleType('all')}
            >
              TODOS
            </button>
            <button 
              className={`filter-tab ${vehicleType === 'auto' ? 'active' : ''}`}
              onClick={() => setVehicleType('auto')}
            >
              AUTOMÓVILES
            </button>
            <button 
              className={`filter-tab ${vehicleType === 'moto' ? 'active' : ''}`}
              onClick={() => setVehicleType('moto')}
            >
              MOTOCICLETAS
            </button>
          </div>

          <div className="sort-dropdown">
            <button 
              className="sort-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              ORDENAR
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {showFilters && (
              <div className="sort-menu">
                <button onClick={() => { setSortBy('default'); setShowFilters(false); }}>
                  Orden Original
                </button>
                <button onClick={() => { setSortBy('name'); setShowFilters(false); }}>
                  Nombre (A-Z)
                </button>
                <button onClick={() => { setSortBy('priceAsc'); setShowFilters(false); }}>
                  Precio Ascendente
                </button>
                <button onClick={() => { setSortBy('priceDesc'); setShowFilters(false); }}>
                  Precio Descendente
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="luxury-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="luxury-card skeleton">
                <div className="skeleton-image" />
                <div className="skeleton-content">
                  <div className="skeleton-line" style={{width: '60%'}} />
                  <div className="skeleton-line" style={{width: '40%'}} />
                </div>
              </div>
            ))}
          </div>
        ) : err ? (
          <div className="error-message">
            <h3>Error al cargar productos</h3>
            <p>{err}</p>
          </div>
        ) : products.length === 0 ? (
          <p className="empty-message">No hay vehículos disponibles en este momento.</p>
        ) : (
          <div className="luxury-grid">
            {sortedProducts.map((p, index) => (
              <Link 
                to={`/car/${p.id}`} 
                key={p.id} 
                className="luxury-card"
                style={{'--index': index}}
              >
                <div className="card-image-container">
                  {p.image_url && (
                    <img src={p.image_url} alt={p.name} className="card-image" />
                  )}
                  <div className="card-overlay">
                    <span className="view-details">VER DETALLES</span>
                  </div>
                </div>
                <div className="card-info">
                  <h3 className="card-name">{p.name}</h3>
                  <div className="card-price-container">
                    <span className="price-label">DESDE</span>
                    <span className="card-price">
                      ${Number(p.price).toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}