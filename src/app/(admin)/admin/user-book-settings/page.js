// src/app/(admin)/admin/user-book-settings/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { FaBook, FaPalette, FaSave } from 'react-icons/fa'; // Ícone para personagem?
import { authService, adminTaxonomiesService } from '@/services/api';

// Chaves que serão usadas para salvar/buscar no backend na tabela 'settings'
const USER_STORY_BOOK_CONFIG_KEY = 'USER_STORY_BOOK_CONFIG';
const USER_COLORING_BOOK_CONFIG_KEY = 'USER_COLORING_BOOK_CONFIG';
const USER_CHARACTER_CONFIG_KEY = 'USER_CHARACTER_CONFIG';

export default function UserBookSettingsPage() {
    const [storySettings, setStorySettings] = useState(null);
    const [coloringSettings, setColoringSettings] = useState(null);
    const [characterSettings, setCharacterSettings] = useState(null);
    const [availableAISettings, setAvailableAISettings] = useState([]);
    const [availablePrintFormats, setAvailablePrintFormats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllSettings = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const [systemSettingsRes, aiSettingsRes, printFormatsRes] = await Promise.all([
                    authService.getSettings(),
                    adminTaxonomiesService.listAllAiSettings(), 
                    adminTaxonomiesService.listPrintFormats(),
                ]);

                // Mapear settings do sistema para o estado local
                const storyConfig = systemSettingsRes.find(s => s.key === USER_STORY_BOOK_CONFIG_KEY);
                const coloringConfig = systemSettingsRes.find(s => s.key === USER_COLORING_BOOK_CONFIG_KEY);
                const characterConfig = systemSettingsRes.find(s => s.key === USER_CHARACTER_CONFIG_KEY);

                setStorySettings(storyConfig ? JSON.parse(storyConfig.value) : {
                    aiSettingId: '', // Apenas um ID de IA para o livro de história
                    pageCount: 8, 
                    printFormatId: '', 
                });
                setColoringSettings(coloringConfig ? JSON.parse(coloringConfig.value) : {
                    aiSettingId: '', // Apenas um ID de IA para o livro de colorir
                    pageCount: 10, 
                    printFormatId: '', 
                });
                setCharacterSettings(characterConfig ? JSON.parse(characterConfig.value) : {
                    aiSettingId: '', // Apenas um ID de IA para o personagem
                });

                setAvailableAISettings(aiSettingsRes.filter(s => s.isActive)); 
                setAvailablePrintFormats(printFormatsRes.filter(f => f.isActive));

            } catch (err) {
                console.error("Erro ao carregar configurações:", err);
                setError("Falha ao carregar configurações: " + err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllSettings();
    }, []);

    const handleStoryChange = (e) => {
        const { name, value } = e.target;
        setStorySettings(prev => ({ ...prev, [name]: value }));
    };

    const handleColoringChange = (e) => {
        const { name, value } = e.target;
        setColoringSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleCharacterChange = (e) => {
        const { name, value } = e.target;
        setCharacterSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (configType) => {
        let settingsToSave = {};
        let key = '';

        if (configType === 'story') {
            settingsToSave = storySettings;
            key = USER_STORY_BOOK_CONFIG_KEY;
        } else if (configType === 'coloring') {
            settingsToSave = coloringSettings;
            key = USER_COLORING_BOOK_CONFIG_KEY;
        } else if (configType === 'character') {
            settingsToSave = characterSettings;
            key = USER_CHARACTER_CONFIG_KEY;
        }

        try {
            // Validações básicas antes de salvar
            if (configType === 'story' || configType === 'coloring') {
                if (!settingsToSave.aiSettingId || !settingsToSave.printFormatId) {
                    throw new Error("Por favor, selecione a Configuração de IA e o Formato de Impressão padrão.");
                }
            } else if (configType === 'character') {
                if (!settingsToSave.aiSettingId) {
                    throw new Error("Por favor, selecione a Configuração de IA para Geração de Personagem.");
                }
            }

            await authService.updateSetting(key, JSON.stringify(settingsToSave));
            alert(`Configurações para ${configType === 'story' ? 'o livro de história' : configType === 'coloring' ? 'o livro de colorir' : 'personagens'} salvas com sucesso!`);
        } catch (err) {
            console.error(`Erro ao salvar configurações para ${configType}:`, err);
            alert(`Falha ao salvar configurações: ${err.message}`);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Carregando configurações...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>Erro ao carregar configurações: {error}</div>;
    }
    
    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className={styles.header}>
                <h1 className={styles.title}>Livros e Personagens Padrão dos Usuários</h1>
                <p className={styles.subtitle}>Defina aqui as configurações de IA e os parâmetros padrão para as gerações de usuários.</p>
            </div>

            <div className={styles.settingsGrid}>
                {/* Formulário Livro de História */}
                <form className={styles.settingCard} onSubmit={(e) => { e.preventDefault(); handleSave('story'); }}>
                    <div className={styles.cardHeader}>
                        <FaBook className={styles.cardIcon} />
                        <h2 className={styles.cardTitle}>Livro de História Padrão</h2>
                    </div>
                    {storySettings && (
                        <>
                            <div className={styles.formGroup}>
                                <label>Configuração de IA para Livros de História</label>
                                <select name="aiSettingId" value={storySettings.aiSettingId} onChange={handleStoryChange}>
                                    <option value="">Selecione...</option>
                                    {/* Exemplo de filtro, adapte conforme a necessidade se uma IA for "só de história" */}
                                    {availableAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name || ai.type}</option>)}
                                </select>
                            </div>
                            <div className={styles.grid}>
                                <div className={styles.formGroup}>
                                    <label>Nº de Cenas (Ilustração + Texto)</label>
                                    <input type="number" name="pageCount" value={storySettings.pageCount} onChange={handleStoryChange} min="1" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Formato de Impressão Padrão</label>
                                    <select name="printFormatId" value={storySettings.printFormatId} onChange={handleStoryChange}>
                                        <option value="">Selecione...</option>
                                        {availablePrintFormats.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                    <button type="submit" className={styles.saveButton}><FaSave /> Salvar História</button>
                </form>

                {/* Formulário Livro de Colorir */}
                <form className={styles.settingCard} onSubmit={(e) => { e.preventDefault(); handleSave('coloring'); }}>
                    <div className={styles.cardHeader}>
                        <FaPalette className={styles.cardIcon} />
                        <h2 className={styles.cardTitle}>Livro de Colorir Padrão</h2>
                    </div>
                    {coloringSettings && (
                        <>
                            <div className={styles.formGroup}>
                                <label>Configuração de IA para Livros de Colorir</label>
                                <select name="aiSettingId" value={coloringSettings.aiSettingId} onChange={handleColoringChange}>
                                    <option value="">Selecione...</option>
                                    {availableAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name || ai.type}</option>)}
                                </select>
                            </div>
                            <div className={styles.grid}>
                                <div className={styles.formGroup}>
                                    <label>Nº de Páginas de Colorir</label>
                                    <input type="number" name="pageCount" value={coloringSettings.pageCount} onChange={handleColoringChange} min="1" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Formato de Impressão Padrão</label>
                                    <select name="printFormatId" value={coloringSettings.printFormatId} onChange={handleColoringChange}>
                                        <option value="">Selecione...</option>
                                        {availablePrintFormats.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                    <button type="submit" className={styles.saveButton}><FaSave /> Salvar Colorir</button>
                </form>

                {/* Formulário Geração de Personagem */}
                <form className={styles.settingCard} onSubmit={(e) => { e.preventDefault(); handleSave('character'); }}>
                    <div className={styles.cardHeader}>
                        <FaPalette className={styles.cardIcon} /> {/* Pode ser um ícone diferente, como FaUser */}
                        <h2 className={styles.cardTitle}>Geração de Personagem Padrão</h2>
                    </div>
                    {characterSettings && (
                        <>
                            <div className={styles.formGroup}>
                                <label>Configuração de IA para Geração de Personagem</label>
                                <select name="aiSettingId" value={characterSettings.aiSettingId} onChange={handleCharacterChange}>
                                    <option value="">Selecione...</option>
                                    {availableAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name || ai.type}</option>)}
                                </select>
                            </div>
                        </>
                    )}
                    <button type="submit" className={styles.saveButton}><FaSave /> Salvar Personagem</button>
                </form>
            </div>
        </motion.div>
    );
}