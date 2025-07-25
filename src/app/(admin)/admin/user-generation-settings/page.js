// /app/(admin)/admin/user-generation-settings/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { adminLeonardoService, authService } from '@/services/api';
import styles from './UserGenerationSettings.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSave, FaSpinner } from 'react-icons/fa';

// As chaves que serão salvas na tabela 'settings' agora apontam para IDs de Elements
const SETTING_KEYS = {
    characterElement: 'USER_character_element_id',
    coloringBookElement: 'USER_coloring_book_element_id',
    storyBookElement: 'USER_story_book_element_id',
};

const UserGenerationSettingsPage = () => {
    const [settings, setSettings] = useState({});
    const [allElements, setAllElements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [elementsData, settingsData] = await Promise.all([
                adminLeonardoService.listElements(),
                authService.getSettings()
            ]);
            
            setAllElements(elementsData.filter(el => el.status === 'COMPLETE') || []);

            const settingsMap = settingsData.reduce((acc, setting) => {
                acc[setting.key] = setting.value;
                return acc;
            }, {});
            setSettings(settingsMap);

        } catch (error) {
            toast.error(`Erro ao carregar dados: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const handleSelectChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const promises = Object.entries(settings).map(([key, value]) => 
                authService.updateSetting(key, value)
            );
            await Promise.all(promises);
            toast.success('Configurações salvas com sucesso!');
        } catch (error) {
            toast.error(`Erro ao salvar configurações: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };
    
    const renderSelect = (label, key, filterFocus) => (
         <div className={styles.formGroup}>
            <label htmlFor={key}>{label}</label>
            <select id={key} value={settings[key] || ''} onChange={(e) => handleSelectChange(key, e.target.value)}>
                <option value="">-- Selecione um Modelo de Estilo --</option>
                {allElements
                    .filter(el => !filterFocus || el.lora_focus === filterFocus)
                    .map(el => <option key={el.leonardoElementId} value={el.leonardoElementId}>{el.name}</option>)
                }
            </select>
            <small>Apenas modelos completos {filterFocus ? `com foco em "${filterFocus}"` : ''} são listados.</small>
        </div>
    );

    if (isLoading) return <p>Carregando configurações...</p>;

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <ToastContainer position="bottom-right" theme="colored" />
            <div className={styles.header}>
                <h1 className={styles.title}>Padrões de Geração do Usuário</h1>
                <button className={styles.saveButton} onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <FaSpinner className={styles.spinner}/> : <FaSave />}
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>
            <p className={styles.subtitle}>
                Defina aqui quais **Modelos de Estilo (Elements)** serão usados por padrão quando um usuário comum criar conteúdo.
            </p>

            <div className={styles.settingsGrid}>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Padrão de Criação de Personagem</h2>
                    {renderSelect('Modelo de Estilo para Personagens', SETTING_KEYS.characterElement, 'Character')}
                </div>
                
                 <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Padrão de Criação de Livros</h2>
                    {renderSelect('Modelo de Estilo para Livros de Colorir', SETTING_KEYS.coloringBookElement, null)}
                    {renderSelect('Modelo de Estilo para Livros de História', SETTING_KEYS.storyBookElement, null)}
                </div>
            </div>
        </motion.div>
    );
};

export default UserGenerationSettingsPage;