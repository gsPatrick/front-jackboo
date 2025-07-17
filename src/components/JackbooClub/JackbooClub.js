// src/components/JackbooClub/JackbooClub.js
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './JackbooClub.module.css';

const JackbooClub = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className={styles.title}>Clube JackBoo</h2>
          <p className={styles.subtitle}>
            Faça parte do nosso clube e receba livros e desenhos todo mês!
          </p>
          <motion.button
            className={styles.ctaButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Assinar clube JackBoo
          </motion.button>
        </motion.div>

        {/* --- Animação com entrada + movimento contínuo --- */}
        <motion.div
          className={styles.illustration}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          animate={{
            y: ['0%', '-3%', '0%'],
            rotate: [-1, 1, -1],
          }}
          transition={{
            // Entrada (aparecer)
            opacity: { duration: 0.6, ease: 'easeOut', delay: 0.2 },
            scale: { type: 'spring', stiffness: 100, delay: 0.2 },

            // Movimento contínuo
            y: {
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
            rotate: {
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
          }}
        >
          <Image
            src="/images/club-jackboo.png"
            alt="JackBoo acenando e convidando para o clube"
            width={500}
            height={445}
            className={styles.jackbooImage}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default JackbooClub;
