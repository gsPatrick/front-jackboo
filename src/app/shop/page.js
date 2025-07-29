// src/app/shop/page.js
'use client'; // Ensure this is a client component

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import ShopSidebar from '@/components/ShopSidebar/ShopSidebar';
import ShopProductGrid from '@/components/ProductGrid/ProductGrid'; // Use the renamed component
import styles from './page.module.css';
import { shopService } from '@/services/api'; // Import shopService

// Componente para os confetes de fundo (mantido)
const Confetti = () => {
    const confettiPieces = Array.from({ length: 20 });
    const colors = ['#FF8C00', '#5bbde4', '#E0F2F7', '#FFB35E'];
    return (
        <div className={styles.confettiWrapper}>
            {confettiPieces.map((_, i) => {
                const style = {
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 4 + 6}s`,
                animationDelay: `${Math.random() * 7}s`,
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                };
                return <span key={i} className={styles.confettiPiece} style={style}></span>;
            })}
        </div>
    );
};

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({}); // State to hold current filters

  // Function to fetch products based on current filters
  const fetchProducts = async (currentFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await shopService.getJackbooShelf(currentFilters);
      setProducts(data.books);
    } catch (err) {
      console.error("Erro ao buscar produtos da lojinha JackBoo:", err);
      setError(err.message || "Não foi possível carregar os produtos da lojinha.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchProducts(filters);
  }, [filters]); // Re-fetch when filters change

  // Handler for filter changes from the sidebar
  const handleFilterChange = (newFilters) => {
    // This will trigger the useEffect above to re-fetch products
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <main className={styles.main}>
      <Confetti />
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>
            Explore nossa <span className={styles.highlight}>Lojinha</span> dos Sonhos!
        </h1>
        <div className={styles.shopLayout}>
          <ShopSidebar onFilterChange={handleFilterChange} /> {/* Pass filter handler */}
          <ShopProductGrid products={products} isLoading={isLoading} error={error} /> {/* Pass data and status */}
        </div>
      </div>
    </main>
  );
};

export default ShopPage;