// src/components/FeaturedProducts/FeaturedProducts.js
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './FeaturedProducts.module.css';

// Dados mockados dos produtos (AGORA COM 6 ITENS PARA A GRADE 3X2)
const featuredProducts = [
    { id: 1, name: 'Aventuras na Floresta', price: '29,90', imageUrl: '/images/product-book.png' },
    { id: 2, name: 'O Mistério da Estrela', price: '29,90', imageUrl: '/images/product-book.png' },
    { id: 3, name: 'JackBoo no Espaço', price: '34,90', imageUrl: '/images/product-book.png' },
    { id: 4, name: 'Amigos da Fazenda', price: '29,90', imageUrl: '/images/product-book.png' },
    { id: 5, name: 'O Tesouro Perdido', price: '32,90', imageUrl: '/images/product-book.png' },
    { id: 6, name: 'A Corrida Divertida', price: '29,90', imageUrl: '/images/product-book.png' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const FeaturedProducts = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            A <span className={styles.highlight}>Lojinha Mágica</span> do JackBoo!
          </h2>
          <motion.button 
            className={styles.viewAllButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver a Lojinha
          </motion.button>
        </div>
        
        {/* ALTERADO DE CARROSSEL PARA GRID */}
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              className={styles.productCard}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.03, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.12)' }}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={300}
                  height={300}
                  className={styles.productImage}
                />
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productPrice}>R$ {product.price}</p>
                {/* BOTÃO ADICIONADO PARA CONSISTÊNCIA */}
                <motion.button 
                  className={styles.viewProductButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver o Livro
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;