// src/app/(admin)/admin/user-book-settings/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { FaUserAstronaut, FaBook, FaPalette, FaSave } from 'react-icons/fa';
import { authService, adminAISettingsService, adminTaxonomiesService } from '@/services/api';

const USER_CHARACTER_CONFIG_KEY = 'USER_CHARACTER_CONFIG';
const USER_STORY_BOOK_CONFIG_KEY = 'USER_STORY_BOOK_CONFIG';
const USER_COLORING_BOOK_CONFIG_KEY = 'USER_COLORING_BOOK_CONFIG';

export default function UserGenerationSettingsPage() {
    const [characterSettings, setCharacterSettings] = useState(null);
    const [storySettings, setStorySettings] = useState(null);
    const [coloringSettings, setColoringSettings] = useState(null);
    
    const [availableAISettings, setAvailableAISettings] = useState([]);
    const [availablePrintFormats, setAvailablePrintFormats] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllSettings = async () => {
            try {
                setIsLoading(true);
                const [systemSettingsRes, aiSettingsRes, printFormatsRes] = await Promise.all([
                    authService.getSettings(),
                    adminAISettingsService.listSettings(),
                    adminTaxonomiesService.listPrintFormats(),
                ]);

                setAvailableAISettings(aiSettingsRes.filter(s => s.isActive));
                setAvailablePrintFormats(printFormatsRes.filter(f => f.isActive));

                const findAndParse = (key, defaults) => {
                    const setting = systemSettingsRes.find(s => s.key === key);
                    return setting ? JSON.parse(setting.value) : defaults;
                };

                setCharacterSettings(findAndParse(USER_CHARACTER_CONFIG_KEY, { descriptionAiId: '', generationAiId: '' }));
                setStorySettings(findAndParse(USER_STORY_BOOK_CONFIG_KEY, { pageCount: 8, printFormatId: '', storylineAiId: '', pageGenAiId: '' }));
                setColoringSettings(findAndParse(USER_COLORING_BOOK_CONFIG_KEY, { pageCount: 10, printFormatId: '', storylineAiId: '', pageGenAiId: '' }));

            } catch (err) {
                setError("Falha ao carregar configurações: " + err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllSettings();
    }, []);

    const createChangeHandler = (setter) => (e) => {
        const { name, value } = e.target;
        setter(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (key, dataToSave, formName) => {
        try {
            await authService.updateSetting(key, JSON.stringify(dataToSave));
            alert(`Configurações para "${formName}" salvas com sucesso!`);
        } catch (err) {
            alert(`Falha ao salvar configurações: ${err.message}`);
        }
    };
    
    if (isLoading) return <div className={styles.loading}>Carregando...</div>;
    if (error) return <div className={styles.errorMessage}>{error}</div>;

    return (
        <motion.div className={styles.container} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className={styles.header}>
                <h1 className={styles.title}>Configurações de Geração (Usuários)</h1>
                <p className={styles.subtitle}>Atribua os templates de IA para cada funcionalidade disponível aos usuários.</p>
            </div>

            <div className={styles.settingsGrid}>
                {/* Geração de Personagem */}
                {characterSettings && (
                    <form className={styles.settingCard} onSubmit={(e) => { e.preventDefault(); handleSave(USER_CHARACTER_CONFIG_KEY, characterSettings, "Geração de Personagem"); }}>
                        <div className={styles.cardHeader}><FaUserAstronaut className={styles.cardIcon} /><h2 className={styles.cardTitle}>Geração de Personagem</h2></div>
                        <div className={styles.formGroup}><label>Template para Descrever Imagem (GPT)</label><select name="descriptionAiId" value={characterSettings.descriptionAiId} onChange={createChangeHandler(setCharacterSettings)}><option value="">Selecione um template...</option>{availableAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}</select></div>
                        <div className={styles.formGroup}><label>Template para Gerar Personagem (Leonardo)</label><select name="generationAiId" value={characterSettings.generationAiId} onChange={createChangeHandler(setCharacterSettings)}><option value="">Selecione um template...</option>{availableAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}</select></div>
                        <button type="submit" className={styles.saveButton}><FaSave /> Salvar</button>
                    </form>
                )}

                {/* Livro de Colorir */}
                {coloringSettings && (
                     <form className={styles.settingCard} onSubmit={(e) => { e.preventDefault(); handleSave(USER_COLORING_BOOK_CONFIG_KEY, coloringSettings, "Livro de Colorir"); }}>
                        <div className={styles.cardHeader}><FaPalette className={styles.cardIcon} /><h2 className={styles.cardTitle}>Livro de Colorir</h2></div>
                        <div className={styles.formGroup}><label>Template de Roteiro (GPT)</label><select name="storylineAiId" value={coloringSettings.storylineAiId} onChange={createChangeHandler(setColoringSettings)}><option value="">Selecione...</option>{availableAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}</select></div>
                        <div className={styles.formGroup}><label>Template por Página (Leonardo)</label><select name="pageGenAiId" value={coloringSettings.pageGenAiId} onChange={createChangeHandler(setColoringSettings)}><option value="">Selecione...</option>{availableAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}</select></div>
                        <div className={styles.grid}>
                             <div className={styles.formGroup}><label>Nº Padrão de Páginas</label><input type="number" name="pageCount" value={coloringSettings.pageCount} onChange={createChangeHandler(setColoringSettings)} min="1"/></div>
                            <div className={styles.formGroup}><label>Formato Padrão</label><select name="printFormatId" value={coloringSettings.printFormatId} onChange={createChangeHandler(setColoringSettings)}><option value="">Selecione...</option>{availablePrintFormats.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
                        </div>
                        <button type="submit" className={styles.saveButton}><FaSave /> Salvar</button>
                    </form>
                )}

                {/* Livro de História */}
                {storySettings && (
                     <form className={styles.settingCard} onSubmit={(e) => { e.preventDefault(); handleSave(USER_STORY_BOOK_CONFIG_KEY, storySettings, "Livro de História"); }}>
                        <div className={styles.cardHeader}><FaBook className={styles.cardIcon} /><h2 className={styles.cardTitle}>Livro de História</h2></div>
                        <div className={styles.formGroup}><label>Template de Roteiro (GPT)</label><select name="storylineAiId" value={storySettings.storylineAiId} onChange={createChangeHandler(setStorySettings)}><option value="">Selecione...</option>{availableAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}</select></div>
                        <div className={styles.formGroup}><label>Template por Página (Leonardo)</label><select name="pageGenAiId" value={storySettings.pageGenAiId} onChange={createChangeHandler(setStorySettings)}><option value="">Selecione...</option>{availableAISettings.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}</select></div>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}><label>Nº Padrão de Cenas</label><input type="number" name="pageCount" value={storySettings.pageCount} onChange={createChangeHandler(setStorySettings)} min="1" /></div>
                            <div className={styles.formGroup}><label>Formato Padrão</label><select name="printFormatId" value={storySettings.printFormatId} onChange={createChangeHandler(setStorySettings)}><option value="">Selecione...</option>{availablePrintFormats.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
                        </div>
                        <button type="submit" className={styles.saveButton}><FaSave /> Salvar</button>
                    </form>
                )}
            </div>
        </motion.div>
    );
}