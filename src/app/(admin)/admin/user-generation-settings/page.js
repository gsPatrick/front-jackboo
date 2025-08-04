// src/app/(admin)/admin/user-generation-settings/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaBookReader, FaPaintBrush, FaUserAstronaut, FaQuestionCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { adminLeonardoService, adminAISettingsService } from '@/services/api';
import styles from './page.module.css';
import ExplanationModal from './_components/ExplanationModal';

// ✅ ATUALIZADO: Definições de propósito do OpenAISetting para mapear para a UI
const PURPOSE_CONFIG = {
    USER_CHARACTER_DRAWING: {
        title: 'Geração de Personagem',
        icon: <FaUserAstronaut />,
        fields: ['basePromptText', 'defaultElement'], // ✅ CORRIGIDO: Adicionado 'basePromptText'
        description: 'Define o prompt do GPT para descrever o desenho do usuário e o Elemento (estilo) padrão que a IA usará para transformar esses desenhos em personagens JackBoo. Este padrão também é usado para personagens oficiais gerados por IA.',
    },
    USER_COLORING_BOOK_STORYLINE: {
        title: 'Livro de Colorir',
        icon: <FaPaintBrush />,
        fields: ['basePromptText', 'defaultElement', 'coverElement'],
        description: 'Define o prompt do GPT para gerar o roteiro das páginas de colorir, e os Elementos (estilos) para o miolo e a capa do livro. Usado tanto para livros de usuários quanto para livros oficiais de colorir.',
    },
    USER_STORY_BOOK_STORYLINE: {
        title: 'Livro de História',
        icon: <FaBookReader />,
        fields: ['basePromptText', 'defaultElement', 'coverElement'],
        description: 'Define o prompt do GPT para gerar o roteiro das páginas de história, e os Elementos (estilos) para o miolo e a capa do livro. Usado tanto para livros de usuários quanto para livros oficiais de história.',
    },
    BOOK_COVER_DESCRIPTION_GPT: {
        title: 'Descrição de Capa (GPT)',
        icon: <FaBookReader />,
        fields: ['basePromptText'],
        description: 'Define o prompt do GPT que gera a descrição textual para as capas e contracapas de TODOS os tipos de livros (colorir e história), sejam eles de usuários ou oficiais. O estilo visual é definido pelos Elements da capa nos templates de livro.',
    },
};

export default function UserGenerationSettingsPage() {
    const [settings, setSettings] = useState({});
    const [elements, setElements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState({});
    const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [elementsData, settingsData] = await Promise.all([
                adminLeonardoService.listElements(),
                adminAISettingsService.listSettings()
            ]);

            setElements(elementsData.filter(el => el.status === 'COMPLETE') || []);

            const settingsMap = {};
            (settingsData || []).forEach(s => { settingsMap[s.purpose] = s; });

            const initialSettingsState = {};
            Object.keys(PURPOSE_CONFIG).forEach(purpose => {
                initialSettingsState[purpose] = settingsMap[purpose] || {
                    purpose,
                    basePromptText: '',
                    defaultElementId: '',
                    coverElementId: '',
                    isActive: true,
                };
            });
            setSettings(initialSettingsState);
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
        const settingToSave = { ...settings[purpose], isActive: true };

        if (PURPOSE_CONFIG[purpose].fields.includes('basePromptText') && !settingToSave.basePromptText.trim()) {
            toast.warn('O Prompt Base para IA é obrigatório.');
            return;
        }
        if (PURPOSE_CONFIG[purpose].fields.includes('defaultElement') && !settingToSave.defaultElementId) {
            toast.warn('O Elemento Padrão (Miolo / Geração) é obrigatório.');
            return;
        }
        if (PURPOSE_CONFIG[purpose].fields.includes('coverElement') && !settingToSave.coverElementId) {
            toast.warn('O Elemento Padrão (Capa) é obrigatório.');
            return;
        }
        
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
            <h1 className={styles.title}>Padrões Globais de Geração de IA</h1>
            <p className={styles.subtitle}>
                Configure o que acontece "por baixo dos panos" quando um usuário cria um personagem ou livro, ou quando um admin gera um livro oficial.
                Estes são os prompts e estilos padrão que serão utilizados pela IA em todo o sistema.
                <button onClick={() => setIsExplanationModalOpen(true)} className={styles.helpButton} title="Entender as Tags de Prompt">
                    <FaQuestionCircle />
                </button>
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
                            <p className={styles.cardDescription}>{config.description}</p>

                            {config.fields.includes('basePromptText') && (
                                <div className={styles.formGroup}>
                                    <label>Prompt Base para IA (GPT)</label>
                                    <textarea
                                        value={currentSetting?.basePromptText || ''}
                                        onChange={(e) => handleChange(purpose, 'basePromptText', e.target.value)}
                                        rows="4"
                                        placeholder={`Instruções para o GPT sobre ${config.title}...`}
                                    />
                                    <small className={styles.helperText}>
                                        Este prompt será enviado ao GPT. Use placeholders como {'[CHARACTER_DETAILS]'}, {'[BOOK_TITLE]'}, {'[SCENE_COUNT]'} etc., conforme a necessidade do propósito.
                                    </small>
                                </div>
                            )}

                            {config.fields.includes('defaultElement') && (
                                <div className={styles.formGroup}>
                                    <label>Elemento Padrão (Miolo / Geração)</label>
                                    <select
                                        value={currentSetting?.defaultElementId || ''}
                                        onChange={(e) => handleChange(purpose, 'defaultElementId', e.target.value)}
                                    >
                                        <option value="">Selecione um Elemento...</option>
                                        {elements.map(el => <option key={el.leonardoElementId} value={el.leonardoElementId}>{el.name} ({el.leonardoElementId})</option>)}
                                    </select>
                                    <small className={styles.helperText}>
                                        Define o estilo visual para as páginas internas do livro ou para a imagem do personagem.
                                    </small>
                                </div>
                            )}

                             {config.fields.includes('coverElement') && (
                                <div className={styles.formGroup}>
                                    <label>Elemento Padrão (Capa e Contracapa)</label>
                                    <select
                                        value={currentSetting?.coverElementId || ''}
                                        onChange={(e) => handleChange(purpose, 'coverElementId', e.target.value)}
                                    >
                                        <option value="">Selecione um Elemento...</option>
                                        {elements.map(el => <option key={el.leonardoElementId} value={el.leonardoElementId}>{el.name} ({el.leonardoElementId})</option>)}
                                    </select>
                                    <small className={styles.helperText}>
                                        Define o estilo visual para a capa e contracapa do livro.
                                    </small>
                                </div>
                            )}
                            
                            <button className={styles.saveButton} onClick={() => handleSave(purpose)} disabled={isSaving[purpose]}>
                                <FaSave /> {isSaving[purpose] ? 'Salvando...' : 'Salvar Padrão'}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            <ExplanationModal
                isOpen={isExplanationModalOpen}
                onClose={() => setIsExplanationModalOpen(false)}
            />
        </motion.div>
    );
}