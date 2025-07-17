// src/components/HowItWorks/HowItWorks.js
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './HowItWorks.module.css';

// Dados dos passos (sem alterações)
const steps = [
  {
    id: 1,
    icon: '/images/icons/icon-pencil.svg',
    title: '1. Desenhe',
    description: 'Crie um desenho incrível',
    image: '/images/how-it-works/step1-draw.png',
    bgColor: 'var(--color-jackboo-pink-lightest)',
    iconBgColor: '#FADEE7',
  },
  {
    id: 2,
    icon: '/images/icons/icon-scan.svg',
    title: '2. Escaneie',
    description: 'Tire uma foto ou escaneie o desenho',
    image: '/images/how-it-works/step2-scan.png',
    bgColor: 'var(--color-jackboo-blue-lightest)',
    iconBgColor: '#D3ECF4',
  },
  {
    id: 3,
    icon: '/images/icons/icon-book.svg',
    title: '3. Personagem',
    description: 'O JackBoo cria o seu personagem',
    image: '/images/how-it-works/step3-character.png',
    bgColor: 'var(--color-jackboo-green-lightest)',
    iconBgColor: '#DAF0D4',
  },
  {
    id: 4,
    icon: '/images/icons/icon-stars.svg',
    title: '4. Livro',
    description: 'Receba o seu livrinho em casa',
    image: '/images/how-it-works/step4-book.png',
    bgColor: 'var(--color-jackboo-orange-lightest)',
    iconBgColor: '#FCE7C6',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 90, damping: 12 } 
  },
};

const HowItWorks = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* --- TÍTULO MAIS LÚDICO --- */}
        <motion.h2 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Sua Aventura <span className={styles.highlightOrange}>Começa</span> Aqui!
        </motion.h2>

        <motion.div
          className={styles.grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.15 }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className={styles.card}
              style={{ backgroundColor: step.bgColor }}
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -10, boxShadow: '0 15px 30px rgba(47, 74, 110, 0.15)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className={styles.iconWrapper} style={{ backgroundColor: step.iconBgColor }}>
                <Image src={step.icon} alt={`Ícone para ${step.title}`} width={40} height={40} />
              </div>
              <h3 className={styles.cardTitle}>{step.title}</h3>
              <p className={styles.cardDescription}>{step.description}</p>
              <div className={styles.illustrationWrapper}>
                <Image
                  src={step.image}
                  alt={`Ilustração para ${step.title}`}
                  width={200}
                  height={180}
                  className={styles.illustration}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;