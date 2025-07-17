// src/app/championship/page.js
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { FaFutbol, FaTrophy, FaUserCheck } from 'react-icons/fa'; // Ícones

// --- Mock Data para a lista de Campeonatos ---
const mockChampionships = [
    { id: 'jackboo-art-cup-2024', title: 'JackBoo Art Cup 2024', status: 'Em Andamento', entries: 8, maxEntries: 8 },
    { id: 'summer-drawing-challenge', title: 'Desafio de Desenho de Verão', status: 'Inscrições Abertas', entries: 5, maxEntries: 8 },
    { id: 'monsters-cup', title: 'Copa dos Monstrinhos', status: 'Finalizado', entries: 8, maxEntries: 8 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


export default function ChampionshipListPage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <motion.h1
                    className={styles.pageTitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Campeonatos <span className={styles.highlight}>JackBoo!</span>
                </motion.h1>

                 {mockChampionships.length === 0 ? (
                     <p className={styles.emptyMessage}>Nenhum campeonato disponível no momento. Volte logo!</p>
                 ) : (
                     <motion.div
                         className={styles.championshipList}
                         variants={containerVariants}
                         initial="hidden"
                         animate="visible"
                     >
                         {mockChampionships.map(championship => (
                             <motion.div
                                 key={championship.id}
                                 className={styles.championshipCard}
                                 variants={itemVariants}
                                  whileHover={{ scale: 1.03, y: -5 }}
                                 transition={{ type: 'spring', stiffness: 200 }}
                             >
                                 <h2 className={styles.cardTitle}>{championship.title}</h2>
                                 <div className={styles.cardDetails}>
                                     <p><FaFutbol className={styles.detailIcon} /> Status: <span className={styles.statusText}>{championship.status}</span></p>
                                      <p><FaUserCheck className={styles.detailIcon} /> Participantes: {championship.entries}/{championship.maxEntries}</p>
                                 </div>
                                  {/* Link para a página de detalhes do campeonato */}
                                  <Link href={`/championship/${championship.id}`} passHref>
                                      <motion.button
                                          className={styles.viewBracketButton}
                                           whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                      >
                                          Ver Chaveamento
                                      </motion.button>
                                  </Link>
                             </motion.div>
                         ))}
                     </motion.div>
                 )}

                 {/* Botão para Entrar em um Novo Campeonato (placeholder) */}
                 <motion.button
                     className={styles.enterNewButton}
                     whileHover={{ scale: 1.05, y: -3 }}
                     whileTap={{ scale: 0.95 }}
                      onClick={() => alert("Funcionalidade de entrar em um novo campeonato ainda não implementada :)")}
                 >
                     Quero Entrar em um Campeonato!
                 </motion.button>

            </div>
        </main>
    );
}