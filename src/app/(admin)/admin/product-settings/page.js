// src/app/(admin)/admin/product-settings/page.js
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { FaBook, FaPalette, FaSave } from 'react-icons/fa';

// --- DADOS MOCKADOS ---

// Configurações de IA disponíveis (reutilizando a mesma lógica)
// Viria de GET /api/admin/taxonomies/ai-settings
const mockAvailableAISettings = [
    { id: '1', name: 'IA: Geração de Personagem Principal' },
    { id: '2', name: 'IA: Geração de Capa de Livro' },
    { id: '3', name: 'IA: Geração de Página de Miolo (História)' },
    { id: '4', name: 'IA: Geração de Página Especial de Abertura' },
    { id: '5', name: 'IA: Conversão para Colorir' },
];

// Configurações atuais dos livros principais
// Viria de GET /api/admin/product-settings
const mockCoreBookSettings = {
    historyBook: {
        name: "Livro de História dos Amigos",
        coverAIId: '2',
        firstPageAIId: '4',
        bookBodyAIId: '3',
        defaultPageCount: 20,
        defaultPageSize: '1024x1792',
    },
    coloringBook: {
        name: "Livro de Colorir dos Amigos",
        coverAIId: '2',
        coloringPagesAIId: '5',
        defaultPageCount: 15,
        defaultPageSize: '1024x1024',
    }
};

export default function ProductSettingsPage() {
    const [historySettings, setHistorySettings] = useState(mockCoreBookSettings.historyBook);
    const [coloringSettings, setColoringSettings] = useState(mockCoreBookSettings.coloringBook);

    const handleHistoryChange = (e) => {
        const { name, value } = e.target;
        setHistorySettings(prev => ({ ...prev, [name]: value }));
    };

    const handleColoringChange = (e) => {
        const { name, value } = e.target;
        setColoringSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveHistory = (e) => {
        e.preventDefault();
        console.log("Salvando configurações do Livro de História:", historySettings);
        alert("Configurações do Livro de História salvas com sucesso!");
    };

    const handleSaveColoring = (e) => {
        e.preventDefault();
        console.log("Salvando configurações do Livro de Colorir:", coloringSettings);
        alert("Configurações do Livro de Colorir salvas com sucesso!");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className={styles.title}>Configuração dos Livros Principais</h1>
            <p className={styles.subtitle}>Defina os parâmetros para os livros gerados pelos usuários.</p>

            <div className={styles.settingsContainer}>
                {/* Card para Livro de História */}
                <motion.form 
                    className={styles.settingCard} 
                    onSubmit={handleSaveHistory}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className={styles.cardHeader}>
                        <FaBook className={styles.cardIcon} />
                        <h2 className={styles.cardTitle}>Livro de História</h2>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="history_coverAI">IA para Capa</label>
                        <select id="history_coverAI" name="coverAIId" value={historySettings.coverAIId} onChange={handleHistoryChange}>
                            {mockAvailableAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="history_firstPageAI">IA para Primeira Página</label>
                        <select id="history_firstPageAI" name="firstPageAIId" value={historySettings.firstPageAIId} onChange={handleHistoryChange}>
                            {mockAvailableAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="history_bookBodyAI">IA para Miolo</label>
                        <select id="history_bookBodyAI" name="bookBodyAIId" value={historySettings.bookBodyAIId} onChange={handleHistoryChange}>
                            {mockAvailableAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="history_pageCount">Nº de Páginas Padrão</label>
                        <input type="number" id="history_pageCount" name="defaultPageCount" value={historySettings.defaultPageCount} onChange={handleHistoryChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="history_pageSize">Tamanho das Páginas</label>
                        <select id="history_pageSize" name="defaultPageSize" value={historySettings.defaultPageSize} onChange={handleHistoryChange}>
                            <option value="1024x1024">1024x1024 (Quadrado)</option>
                            <option value="1024x1792">1024x1792 (Retrato)</option>
                            <option value="1792x1024">1792x1024 (Paisagem)</option>
                        </select>
                    </div>
                    <button type="submit" className={styles.saveButton}><FaSave /> Salvar História</button>
                </motion.form>

                {/* Card para Livro de Colorir */}
                <motion.form 
                    className={styles.settingCard} 
                    onSubmit={handleSaveColoring}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className={styles.cardHeader}>
                        <FaPalette className={styles.cardIcon} />
                        <h2 className={styles.cardTitle}>Livro de Colorir</h2>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="coloring_coverAI">IA para Capa</label>
                        <select id="coloring_coverAI" name="coverAIId" value={coloringSettings.coverAIId} onChange={handleColoringChange}>
                            {mockAvailableAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="coloring_coloringPagesAI">IA para Páginas de Colorir</label>
                        <select id="coloring_coloringPagesAI" name="coloringPagesAIId" value={coloringSettings.coloringPagesAIId} onChange={handleColoringChange}>
                            {mockAvailableAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="coloring_pageCount">Nº de Páginas Padrão</label>
                        <input type="number" id="coloring_pageCount" name="defaultPageCount" value={coloringSettings.defaultPageCount} onChange={handleColoringChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="coloring_pageSize">Tamanho das Páginas</label>
                        <select id="coloring_pageSize" name="defaultPageSize" value={coloringSettings.defaultPageSize} onChange={handleColoringChange}>
                             <option value="1024x1024">1024x1024 (Quadrado)</option>
                             <option value="1024x1792">1024x1792 (Retrato)</option>
                             <option value="1792x1024">1792x1024 (Paisagem)</option>
                        </select>
                    </div>
                    <button type="submit" className={styles.saveButton}><FaSave /> Salvar Colorir</button>
                </motion.form>
            </div>
        </motion.div>
    );
}