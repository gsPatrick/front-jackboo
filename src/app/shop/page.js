// src/app/shop/page.js
import React from 'react';
import ShopSidebar from '@/components/ShopSidebar/ShopSidebar';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import styles from './page.module.css';

// Componente para os confetes de fundo
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
  return (
    <main className={styles.main}>
      <Confetti />
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>
            Explore nossa <span className={styles.highlight}>Lojinha</span> dos Sonhos!
        </h1>
        <div className={styles.shopLayout}>
          <ShopSidebar />
          <ProductGrid />
        </div>
      </div>
    </main>
  );
};

export default ShopPage;