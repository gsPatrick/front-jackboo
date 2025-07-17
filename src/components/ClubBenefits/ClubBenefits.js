// src/components/ClubBenefits/ClubBenefits.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaPalette, FaGift, FaStar } from 'react-icons/fa'; // Exemplo de ícones
import styles from './ClubBenefits.module.css';

const benefits = [
  { icon: <FaBookOpen />, title: 'Livros Novinhos', description: 'Receba histórias e livros de colorir originais todo mês!' },
  { icon: <FaPalette />, title: 'Desafios Criativos', description: 'Acesso a atividades e desafios exclusivos para soltar a imaginação.' },
  { icon: <FaGift />, title: 'Brindes Especiais', description: 'Surpresas e mimos JackBoo para colecionar e se divertir.' },
  { icon: <FaStar />, title: 'Acesso Antecipado', description: 'Seja o primeiro a conhecer novos personagens e coleções.' },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const itemVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

const ClubBenefits = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Por que entrar para o Clube?</h2>
      <motion.div className={styles.grid} variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
        {benefits.map((benefit, index) => (
          <motion.div key={index} className={styles.card} variants={itemVariants}>
            <div className={styles.iconWrapper}>{benefit.icon}</div>
            <h3 className={styles.cardTitle}>{benefit.title}</h3>
            <p className={styles.cardDescription}>{benefit.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
export default ClubBenefits;