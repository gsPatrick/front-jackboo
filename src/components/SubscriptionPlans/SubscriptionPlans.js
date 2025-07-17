// src/components/SubscriptionPlans/SubscriptionPlans.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import styles from './SubscriptionPlans.module.css';

const plans = [
  { id: 1, name: 'Plano Aventuras', price: '49,90', frequency: 'por mês', description: 'Um livro de colorir e um desafio criativo mensal.', featured: false, benefits: ['1 Livro de Colorir', '1 Desafio Criativo'] },
  { id: 2, name: 'Plano Mágico', price: '79,90', frequency: 'por mês', description: 'Uma história personalizada e brindes especiais todo mês.', featured: true, benefits: ['1 História Personalizada', 'Brindes Exclusivos', 'Acesso Antecipado'] },
  { id: 3, name: 'Plano Família', price: '129,90', frequency: 'por mês', description: 'Duas histórias personalizadas e todos os benefícios premium.', featured: false, benefits: ['2 Histórias Personalizadas', 'Brindes Exclusivos', 'Acesso Antecipado', 'Frete Grátis'] },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const cardVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

const SubscriptionPlans = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Escolha o seu Plano Mágico</h2>
      <motion.div className={styles.grid} variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
        {plans.map(plan => (
          <motion.div key={plan.id} className={`${styles.card} ${plan.featured ? styles.featured : ''}`} variants={cardVariants}>
            {plan.featured && <div className={styles.featuredBadge}>Mais Popular!</div>}
            <h3 className={styles.planName}>{plan.name}</h3>
            <p className={styles.price}>R$ {plan.price}<span className={styles.frequency}>/{plan.frequency}</span></p>
            <p className={styles.description}>{plan.description}</p>
            <ul className={styles.benefitsList}>
              {plan.benefits.map((benefit, idx) => <li key={idx}>✓ {benefit}</li>)}
            </ul>
            <motion.button className={styles.chooseButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Escolher Plano
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
export default SubscriptionPlans;