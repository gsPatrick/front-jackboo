// src/components/EmptyCart/EmptyCart.js
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './EmptyCart.module.css';

const EmptyCart = () => {
  return (
    <motion.div className={styles.wrapper} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Container para a imagem e o balão */}
      <div className={styles.jackbooContainer}>
        {/* Balão de fala */}
        <motion.div 
          className={styles.speechBubble}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 150, delay: 0.3 }}
        >
          Coloque livros no carrinho para me deixar feliz
        </motion.div>
        
        {/* Imagem do JackBoo */}
        <Image src="/images/jackboo-sad.png" alt="JackBoo triste com carrinho vazio" width={250} height={250} />
      </div>

      <h2 className={styles.title}>Seu carrinho está vazio!</h2>
      <p className={styles.subtitle}>Que tal dar uma olhada na nossa lojinha para encontrar tesouros mágicos?</p>
      
      <Link href="/shop" passHref>
        <motion.button className={styles.shopButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Ir para a Lojinha
        </motion.button>
      </Link>
    </motion.div>
  );
};
export default EmptyCart;