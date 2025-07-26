// src/app/(admin)/admin/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUsers, FaBookOpen, FaPalette, FaFeatherAlt, FaUserAstronaut, FaChartPie, FaExclamationTriangle } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './page.module.css';

// ✅ CORREÇÃO: Importando o novo serviço
import { 
    adminUsersService, 
    adminBooksService, 
    adminCharactersService 
} from '@/services/api'; 

const quickAccessLinks = [
    { href: '/admin/create-book', label: 'Criar Novo Livro Oficial', icon: <FaPalette /> },
    { href: '/admin/characters', label: 'Gerenciar Personagens', icon: <FaUserAstronaut /> },
    { href: '/admin/user-generation-settings', label: 'Definir Padrões de Geração', icon: <FaFeatherAlt /> },
];

const PIE_CHART_COLORS = {
    historia: 'var(--color-jackboo-primary-orange)',
    colorir: 'var(--color-text-dark-blue)',
    indefinido: '#cccccc',
};

const DataError = ({ message }) => (
    <div className={styles.dataError}>
        <FaExclamationTriangle />
        <span>{message || 'Falha'}</span>
    </div>
);

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);

            const results = await Promise.allSettled([
                adminBooksService.listAllBooks(),
                adminUsersService.listUsers(), // Usando o novo serviço
                adminCharactersService.listCharacters()
            ]);

            const booksResult = results[0];
            const usersResult = results[1];
            const charactersResult = results[2];

            const finalStats = {};

            // --- Processando Livros e Gráfico ---
            if (booksResult.status === 'fulfilled') {
                const booksData = booksResult.value?.books || [];
                finalStats.totalBooks = booksData.length;

                const bookTypesCount = booksData.reduce((acc, book) => {
                    // ✅ CORREÇÃO: Acessando o tipo de livro corretamente
                    const type = book.variations?.[0]?.type || 'indefinido';
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                }, {});

                finalStats.pieChartData = Object.keys(PIE_CHART_COLORS).map(key => ({
                    name: key.charAt(0).toUpperCase() + key.slice(1), // Ex: 'historia' -> 'Historia'
                    value: bookTypesCount[key] || 0
                })).filter(item => item.value > 0); // Mostra apenas tipos que existem

            } else {
                console.error("Falha ao buscar LIVROS:", booksResult.reason);
                finalStats.totalBooks = <DataError />;
                finalStats.pieChartData = [];
            }

            // --- Processando Usuários ---
            if (usersResult.status === 'fulfilled') {
                finalStats.totalUsers = usersResult.value?.users?.length || 0;
            } else {
                console.error("Falha ao buscar USUÁRIOS:", usersResult.reason);
                finalStats.totalUsers = <DataError />;
            }

            // --- Processando Personagens ---
            if (charactersResult.status === 'fulfilled') {
                finalStats.totalOfficialCharacters = charactersResult.value?.characters?.length || 0;
            } else {
                console.error("Falha ao buscar PERSONAGENS:", charactersResult.reason);
                finalStats.totalOfficialCharacters = <DataError />;
            }
            
            setStats(finalStats);
            setIsLoading(false);
        };

        fetchDashboardData();
    }, []);

    const statCards = !isLoading && stats ? [
        { icon: <FaUsers />, value: stats.totalUsers, label: 'Usuários Totais', color: '#e3f2fd' },
        { icon: <FaBookOpen />, value: stats.totalBooks, label: 'Livros Oficiais Criados', color: '#fff3e0' },
        { icon: <FaUserAstronaut />, value: stats.totalOfficialCharacters, label: 'Personagens Oficiais', color: '#e8f5e9' },
    ] : [];

    if (isLoading) {
        return <div className={styles.loadingState}>Carregando dados do universo JackBoo...</div>;
    }
    
    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className={styles.title}>Dashboard Administrativo</h1>
            <p className={styles.subtitle}>Bem-vindo(a)! Gerencie todo o universo JackBoo a partir daqui.</p>

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
                        <Link key={index} href={link.href} passHref legacyBehavior>
                            <motion.a className={styles.quickAccessCard} whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                                <div className={styles.quickAccessIcon}>{link.icon}</div>
                                <span>{link.label}</span>
                            </motion.a>
                        </Link>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}