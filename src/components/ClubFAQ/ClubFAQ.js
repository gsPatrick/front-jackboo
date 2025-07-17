// src/components/ClubFAQ/ClubFAQ.js
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ClubFAQ.module.css';
import { FaChevronDown } from 'react-icons/fa';

const faqItems = [
  { question: 'Como funciona a entrega dos livros?', answer: 'Os livros são enviados mensalmente para o endereço cadastrado, chegando com toda a magia na sua casa!' },
  { question: 'Posso cancelar a qualquer momento?', answer: 'Sim, você pode cancelar sua assinatura a qualquer momento, sem burocracia, diretamente na sua conta.' },
  { question: 'Os livros são personalizados com o desenho do meu filho?', answer: 'Depende do plano! Alguns planos incluem personalização completa, enquanto outros focam em histórias da turma JackBoo.' },
  { question: 'Como funcionam os desafios criativos?', answer: 'A cada mês, enviamos um kit com ideias e materiais para atividades lúdicas, estimulando a criatividade das crianças.' },
];

const ClubFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Perguntas Mágicas</h2>
      <div className={styles.faqList}>
        {faqItems.map((item, index) => (
          <motion.div 
            key={index} 
            className={styles.faqItem}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className={styles.question} onClick={() => toggleFAQ(index)}>
              <h3 className={styles.questionText}>{item.question}</h3>
              <FaChevronDown className={`${styles.icon} ${openIndex === index ? styles.iconOpen : ''}`} />
            </div>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div 
                  className={styles.answer}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
export default ClubFAQ;