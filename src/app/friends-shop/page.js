// src/app/friends-shop/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import FriendsShopSidebar from '@/components/FriendsShopSidebar/FriendsShopSidebar';
import FriendsProductGrid from '@/components/FriendsProductGrid/FriendsProductGrid';
import { shopService } from '@/services/api'; // Import shopService

// Componente para os confetes de fundo (mantido)
const Confetti = () => {
    const confettiPieces = Array.from({ length: 25 });
    const colors = ['#FF8C00', '#5bbde4', '#E0F2F7', '#FFB35E', '#FF0000', '#E0A174', '#E8F7E0', '#F7E0E8', '#E2D0F0'];
    return (
        <div className={styles.confettiWrapper}>
            {confettiPieces.map((_, i) => {
                const style = {
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 5 + 5}s`,
                animationDelay: `${Math.random() * 8}s`,
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                width: `${Math.random() * 6 + 8}px`,
                height: `${Math.random() * 12 + 16}px`,
                opacity: `${Math.random() * 0.4 + 0.6}`,
                };
                return <span key={i} className={styles.confettiPiece} style={style}></span>;
            })}
        </div>
    );
};


const FriendsShopPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({}); // State to hold current filters

  // Function to fetch books based on current filters
  const fetchBooks = async (currentFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await shopService.getFriendsShelf(currentFilters);
      setBooks(data.books);
    } catch (err) {
      console.error("Erro ao buscar livros da lojinha dos amigos:", err);
      setError(err.message || "Não foi possível carregar os livros dos amigos.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchBooks(filters);
  }, [filters]); // Re-fetch when filters change

  // Handler for filter changes from the sidebar
  const handleFilterChange = (newFilters) => {
    // This will trigger the useEffect above to re-fetch books
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };


  return (
    <main className={styles.main}>
       <Confetti />

      <div className={styles.container}>
        <h1 className={styles.pageTitle}>
            Explore a <span className={styles.highlight}>Lojinha</span> dos Amigos!
        </h1>
        <div className={styles.shopLayout}>
          <FriendsShopSidebar onFilterChange={handleFilterChange} />
          <FriendsProductGrid products={books} isLoading={isLoading} error={error} />
        </div>
      </div>
    </main>
  );
};


export default FriendsShopPage;