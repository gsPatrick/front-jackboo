// src/components/ClubHero/ClubHero.js
'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './ClubHero.module.css';

const ClubHero = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className={styles.title}>Entre para o Clube JackBoo!</h1>
          <p className={styles.subtitle}>
            Transforme cada mês em uma nova aventura com livros, desenhos e muita magia entregues na sua casa.
          </p>
        </motion.div>
        <motion.div
          className={styles.imageWrapper}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <Image src="/images/club-jackboo-hero.png" alt="JackBoo feliz com livros" width={400} height={400} />
        </motion.div>
      </div>
    </section>
  );
};
export default ClubHero;