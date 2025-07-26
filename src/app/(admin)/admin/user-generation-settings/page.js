// src/app/(admin)/admin/user-generation-settings/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaBookReader, FaPaintBrush, FaUserAstronaut } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { adminLeonardoService, adminAISettingsService } from '@/services/api';
import styles from './page.module.css';

const PURPOSE_CONFIG = {
    USER_CHARACTER_DRAWING: {
        title: 'Geração de Personagem',
        icon: <FaUserAstronaut />,
        // ✅ CORREÇÃO: O campo 'prompt' foi removido. O admin só precisa definir o Element.
        // O prompt de descrição é fixo no backend para garantir a consistência e segurança.
        fields: ['element'],
    },
    USER_STORY_BOOK_GENERATION: {
        title: 'Livro de História',
        icon: <FaBookReader />,
        fields: ['element', 'coverElement'],
    },
    USER_COLORING_BOOK_GENERATION: {
        title: 'Livro de Colorir',
        icon: <FaPaintBrush />,
        fields: ['element', 'coverElement'],
    },
};

export default function UserGenerationSettingsPage() {
    const [settings, setSettings] = useState({});
    const [elements, setElements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState({});

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [elementsData, settingsData] = await Promise.all([
                adminLeonardoService.listElements(),
                adminAISettingsService.listSettings()
            ]);

            setElements(elementsData.filter(el => el.status === 'COMPLETE') || []);

            const settingsMap = {};
            (settingsData || []).forEach(s => {
                settingsMap[s.purpose] = s;
            });

            Object.keys(PURPOSE_CONFIG).forEach(purpose => {
                if (!settingsMap[purpose]) {
                    settingsMap[purpose] = {
                        purpose,
                        basePromptText: '',
                        defaultElementId: '',
                        coverElementId: '',
                        isActive: false,
                    };
                }
            });
            setSettings(settingsMap);
        } catch (error) {
            toast.error(`Erro ao carregar dados: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (purpose, field, value) => {
        setSettings(prev => ({
            ...prev,
            [purpose]: { ...prev[purpose], [field]: value },
        }));
    };

    const handleSave = async (purpose) => {
        // Pega o estado atual do setting para salvar.
        // O campo 'basePromptText' para USER_CHARACTER_DRAWING simplesmente não existirá ou será vazio,
        // o que não afeta o backend, pois ele o ignora para essa finalidade específica.
        const settingToSave = { ...settings[purpose], isActive: true };
        
        setIsSaving(prev => ({ ...prev, [purpose]: true }));
        try {
            await adminAISettingsService.createOrUpdateSetting(purpose, settingToSave);
            toast.success(`Padrão para "${PURPOSE_CONFIG[purpose].title}" salvo com sucesso!`);
        } catch (error) {
            toast.error(`Falha ao salvar: ${error.message}`);
        } finally {
            setIsSaving(prev => ({ ...prev, [purpose]: false }));
        }
    };

    if (isLoading) {
        return <div className={styles.loadingContainer}>Carregando configurações...</div>;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ToastContainer position="bottom-right" theme="colored" />
            <h1 className={styles.title}>Padrões de Geração para Usuários</h1>
            <p className={styles.subtitle}>
                Configure o que acontece "por baixo dos panos" quando um usuário cria um personagem ou livro.
            </p>

            <div className={styles.settingsGrid}>
                {Object.keys(PURPOSE_CONFIG).map(purpose => {
                    const config = PURPOSE_CONFIG[purpose];
                    const currentSetting = settings[purpose];
                    
                    return (
                        <motion.div key={purpose} className={styles.card}>
                            <div className={styles.cardHeader}>
                                {config.icon}
                                <h2 className={styles.cardTitle}>{config.title}</h2>
                            </div>

                            {config.fields.includes('prompt') && (
                                <div className={styles.formGroup}>
                                    <label>Prompt Base para IA</label>
                                    <textarea
                                        value={currentSetting?.basePromptText || ''}
                                        onChange={(e) => handleChange(purpose, 'basePromptText', e.target.value)}
                                        rows="4"
                                        placeholder={`Instruções para a IA sobre ${config.title}...`}
                                    />
                                </div>
                            )}

                            {config.fields.includes('element') && (
                                <div className={styles.formGroup}>
                                    <label>Element Padrão (Miolo / Geração)</label>
                                    <select
                                        value={currentSetting?.defaultElementId || ''}
                                        onChange={(e) => handleChange(purpose, 'defaultElementId', e.target.value)}
                                    >
                                        <option value="">Selecione um Element...</option>
                                        {elements.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
                                    </select>
                                </div>
                            )}

                             {config.fields.includes('coverElement') && (
                                <div className={styles.formGroup}>
                                    <label>Element Padrão (Capa)</label>
                                    <select
                                        value={currentSetting?.coverElementId || ''}
                                        onChange={(e) => handleChange(purpose, 'coverElementId', e.target.value)}
                                    >
                                        <option value="">Selecione um Element...</option>
                                        {elements.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
                                    </select>
                                </div>
                            )}
                            
                            <button className={styles.saveButton} onClick={() => handleSave(purpose)} disabled={isSaving[purpose]}>
                                <FaSave /> {isSaving[purpose] ? 'Salvando...' : 'Salvar Padrão'}
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}