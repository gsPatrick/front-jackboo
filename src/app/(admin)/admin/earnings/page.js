// src/app/(admin)/admin/earnings/page.js
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { FaDollarSign, FaGift, FaUserFriends, FaChartLine, FaDownload } from 'react-icons/fa';

// --- DADOS MOCKADOS ---
const earningsData = {
    totalRevenue: 15780.50,
    jackbooRevenue: 12540.00,
    friendsRevenue: 3240.50,
    topAffiliates: [
        { id: 'user003', name: 'Max Aventureiro', avatarUrl: '/images/hero-jackboo.png', earnings: 980.25, booksSold: 25 },
        { id: 'user002', name: 'Lívia Colorida', avatarUrl: '/images/jackboo-sad.png', earnings: 750.00, booksSold: 20 },
        { id: 'user001', name: 'Pequeno Artista', avatarUrl: '/images/character-generated.png', earnings: 550.75, booksSold: 15 },
    ],
    monthlyData: [ /* Para um futuro gráfico */ ]
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function EarningsPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Painel de Ganhos</h1>
                    <p className={styles.subtitle}>Acompanhe a performance financeira da plataforma.</p>
                </div>
                <button className={styles.reportButton}><FaDownload /> Baixar Relatório</button>
            </div>
            
            <div className={styles.summaryGrid}>
                <div className={`${styles.summaryCard} ${styles.total}`}>
                    <FaDollarSign className={styles.cardIcon}/>
                    <div>
                        <p className={styles.cardLabel}>Ganhos Totais</p>
                        <p className={styles.cardValue}>{formatCurrency(earningsData.totalRevenue)}</p>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <FaGift className={styles.cardIcon}/>
                    <div>
                        <p className={styles.cardLabel}>Ganhos JackBoo</p>
                        <p className={styles.cardValue}>{formatCurrency(earningsData.jackbooRevenue)}</p>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <FaUserFriends className={styles.cardIcon}/>
                    <div>
                        <p className={styles.cardLabel}>Repasse Amigos (Afiliados)</p>
                        <p className={styles.cardValue}>{formatCurrency(earningsData.friendsRevenue)}</p>
                    </div>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.topAffiliates}>
                    <h2 className={styles.sectionTitle}>Top Afiliados</h2>
                    <table className={styles.affiliatesTable}>
                        <thead>
                            <tr>
                                <th>Pos.</th>
                                <th>Usuário</th>
                                <th>Livros Vendidos</th>
                                <th>Ganhos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {earningsData.topAffiliates.map((user, index) => (
                                <tr key={user.id}>
                                    <td className={styles.positionCell}>
                                        <span className={`${styles.positionBadge} ${styles[`pos${index + 1}`]}`}>
                                            {index + 1}º
                                        </span>
                                    </td>
                                    <td className={styles.userCell}>{user.name}</td>
                                    <td>{user.booksSold}</td>
                                    <td className={styles.earningsCell}>{formatCurrency(user.earnings)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.chartPlaceholder}>
                    <FaChartLine />
                    <h3>Gráfico de Ganhos Mensais</h3>
                    <p>(Componente de gráfico a ser implementado)</p>
                </div>
            </div>

        </motion.div>
    );
}