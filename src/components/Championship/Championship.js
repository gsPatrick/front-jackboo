// src/components/Championship/Championship.js
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Championship.module.css';

// Componente para a "chuva" de confetes
const Confetti = () => {
  const confettiPieces = Array.from({ length: 15 }); // Gera 15 pedaços de confete
  const colors = ['#FF8C00', '#5bbde4', '#E0F2F7', '#FFB35E', '#FF0000'];

  return (
    <div className={styles.confettiWrapper}>
      {confettiPieces.map((_, i) => {
        const style = {
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 4}s`, // Duração entre 4s e 7s
          animationDelay: `${Math.random() * 5}s`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        };
        return <span key={i} className={styles.confettiPiece} style={style}></span>;
      })}
    </div>
  );
};

const Championship = () => {
  return (
    <section className={styles.section}>
      <Confetti />
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            Solte sua <span className={styles.highlight}>Criatividade</span> e vire um <span className={styles.highlight}>Campeão!</span>
          </motion.h2>
          
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            Envie sua arte para o nosso concurso e mostre para todo mundo o seu talento.
          </motion.p>
          
          <motion.div 
            className={styles.buttonWrapper}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          >
            <motion.button 
              className={styles.primaryButton}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Quero Participar!
            </motion.button>
            <motion.button 
              className={styles.secondaryButton}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Prêmios
            </motion.button>
          </motion.div>
        </div>

        <div className={styles.illustrationWrapper}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            animate={{ y: ['0rem', '-1.5rem', '0rem'] }}
            transition={{
              type: 'spring',
              stiffness: 80,
              damping: 15,
              duration: 1,
              y: { duration: 8, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }
            }}
          >
            <Image
              src="/images/jackchampionship.png"
              alt="JackBoo mostrando exemplos de livros do campeonato"
              width={700}
              height={560}
              className={styles.mainImage}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Championship;