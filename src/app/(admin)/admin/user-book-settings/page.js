// src/app/(admin)/admin/user-book-settings/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { FaBook, FaPalette, FaSave } from 'react-icons/fa';

// MOCK DATA
// Em um app real, isso viria de GET /api/admin/settings
const mockInitialSettings = {
    USER_STORY_BOOK: {
        pageCount: 10,
        printFormatId: 'fmt-1',
        aiSettingCoverId: 'ai-story-1',
        aiSettingIntroId: 'ai-story-2',
        aiSettingIllustrationId: 'ai-story-3',
        aiSettingTextId: 'ai-story-4',
    },
    USER_COLORING_BOOK: {
        pageCount: 20,
        printFormatId: 'fmt-1',
        aiSettingCoverId: 'ai-color-1',
        aiSettingSpecialPageId: 'ai-color-2',
        aiSettingColoringId: 'ai-color-3',
    }
};

const mockAISettings = [
    { id: 'ai-story-1', name: 'IA: Capa de História (Padrão)' },
    { id: 'ai-story-2', name: 'IA: Página de Introdução (Padrão)' },
    { id: 'ai-story-3', name: 'IA: Ilustração de Miolo (Padrão)' },
    { id: 'ai-story-4', name: 'IA: Imagem com Texto (Padrão)' },
    { id: 'ai-color-1', name: 'IA: Capa de Colorir (Padrão)' },
    { id: 'ai-color-2', name: 'IA: Página Especial Amigos (Padrão)' },
    { id: 'ai-color-3', name: 'IA: Página de Colorir (Padrão)' },
];
const mockPrintFormats = [
    { id: 'fmt-1', name: 'Boobie Goods Original' },
    { id: 'fmt-2', name: 'Boobie Goods Falso' },
    { id: 'fmt-3', name: 'Cards' },
];

export default function UserBookSettingsPage() {
    const [storySettings, setStorySettings] = useState({});
    const [coloringSettings, setColoringSettings] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simula o fetch das configurações atuais
        setStorySettings(mockInitialSettings.USER_STORY_BOOK);
        setColoringSettings(mockInitialSettings.USER_COLORING_BOOK);
        setIsLoading(false);
    }, []);

    const handleStoryChange = (e) => {
        const { name, value } = e.target;
        setStorySettings(prev => ({ ...prev, [name]: value }));
    };

    const handleColoringChange = (e) => {
        const { name, value } = e.target;
        setColoringSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (bookType) => {
        const settingsToSave = bookType === 'story' ? storySettings : coloringSettings;
        console.log(`Salvando configurações para ${bookType}:`, settingsToSave);
        // Em um app real, seria uma chamada PUT para /api/admin/settings com um payload
        // Ex: { key: 'USER_STORY_BOOK_CONFIG', value: JSON.stringify(settingsToSave) }
        alert(`Configurações para o livro de ${bookType === 'story' ? 'história' : 'colorir'} salvas!`);
    };

    if (isLoading) {
        return <div className={styles.loading}>Carregando configurações...</div>;
    }

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className={styles.header}>
                <h1 className={styles.title}>Livros Padrão dos Usuários</h1>
                <p className={styles.subtitle}>Defina aqui os parâmetros para os livros que os usuários geram automaticamente.</p>
            </div>

            <div className={styles.settingsGrid}>
                {/* Formulário Livro de História */}
                <form className={styles.settingCard} onSubmit={(e) => { e.preventDefault(); handleSave('story'); }}>
                    <div className={styles.cardHeader}>
                        <FaBook className={styles.cardIcon} />
                        <h2 className={styles.cardTitle}>Livro de História Padrão</h2>
                    </div>
                    <div className={styles.formGroup}>
                        <label>IA para Capa e Contracapa</label>
                        <select name="aiSettingCoverId" value={storySettings.aiSettingCoverId} onChange={handleStoryChange}>
                            {mockAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>IA para Página de Introdução</label>
                        <select name="aiSettingIntroId" value={storySettings.aiSettingIntroId} onChange={handleStoryChange}>
                            {mockAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>IA para Ilustrações do Miolo</label>
                        <select name="aiSettingIllustrationId" value={storySettings.aiSettingIllustrationId} onChange={handleStoryChange}>
                            {mockAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>IA para Páginas de Texto</label>
                        <select name="aiSettingTextId" value={storySettings.aiSettingTextId} onChange={handleStoryChange}>
                            {mockAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>Nº de Cenas (Ilustração + Texto)</label>
                            <input type="number" name="pageCount" value={storySettings.pageCount} onChange={handleStoryChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Formato de Impressão Padrão</label>
                            <select name="printFormatId" value={storySettings.printFormatId} onChange={handleStoryChange}>
                                {mockPrintFormats.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className={styles.saveButton}><FaSave /> Salvar Configurações</button>
                </form>

                {/* Formulário Livro de Colorir */}
                <form className={styles.settingCard} onSubmit={(e) => { e.preventDefault(); handleSave('coloring'); }}>
                    <div className={styles.cardHeader}>
                        <FaPalette className={styles.cardIcon} />
                        <h2 className={styles.cardTitle}>Livro de Colorir Padrão</h2>
                    </div>
                    <div className={styles.formGroup}>
                        <label>IA para Capa e Contracapa</label>
                        <select name="aiSettingCoverId" value={coloringSettings.aiSettingCoverId} onChange={handleColoringChange}>
                           {mockAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>IA para Página Especial (Jack e Amigos)</label>
                        <select name="aiSettingSpecialPageId" value={coloringSettings.aiSettingSpecialPageId} onChange={handleColoringChange}>
                           {mockAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>IA para Páginas de Colorir</label>
                        <select name="aiSettingColoringId" value={coloringSettings.aiSettingColoringId} onChange={handleColoringChange}>
                           {mockAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>Nº de Páginas de Colorir</label>
                            <input type="number" name="pageCount" value={coloringSettings.pageCount} onChange={handleColoringChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Formato de Impressão Padrão</label>
                            <select name="printFormatId" value={coloringSettings.printFormatId} onChange={handleColoringChange}>
                                {mockPrintFormats.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className={styles.saveButton}><FaSave /> Salvar Configurações</button>
                </form>
            </div>
        </motion.div>
    );
}