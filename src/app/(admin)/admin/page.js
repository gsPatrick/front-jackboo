// src/app/(admin)/admin/page.js
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { FaUsers, FaBookOpen, FaRobot } from 'react-icons/fa';

const statCards = [
    {
        icon: <FaUsers />,
        value: '1,254',
        label: 'Usuários Totais',
        color: '#5bbde4'
    },
    {
        icon: <FaBookOpen />,
        value: '876',
        label: 'Livros Criados',
        color: '#ffb35e'
    },
    {
        icon: <FaRobot />,
        value: '3',
        label: 'Configurações de IA Ativas',
        color: '#e8f7e0'
    },
];

const quickAccessLinks = [
    { href: '/admin/ai-settings', label: 'Gerenciar Configurações de IA' },
    { href: '/admin/book-templates', label: 'Gerenciar Templates de Livro' },
];

export default function AdminDashboardPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className={styles.title}>Dashboard Administrativo</h1>
            <p className={styles.subtitle}>Bem-vindo(a)! Aqui está um resumo do seu universo JackBoo.</p>

            <div className={styles.statsGrid}>
                {statCards.map((card, index) => (
                    <motion.div
                        key={index}
                        className={styles.statCard}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <div className={styles.statIcon} style={{ backgroundColor: card.color }}>{card.icon}</div>
                        <div className={styles.statValue}>{card.value}</div>
                        <div className={styles.statLabel}>{card.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className={styles.quickAccessSection}>
                <h2 className={styles.sectionTitle}>Acesso Rápido</h2>
                <div className={styles.quickAccessGrid}>
                    {quickAccessLinks.map((link, index) => (
                        <Link key={index} href={link.href} passHref>
                            <motion.div
                                className={styles.quickAccessCard}
                                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                            >
                                {link.label}
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}