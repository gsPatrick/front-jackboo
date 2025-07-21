// src/components/Admin/AISettingFormModal/AISettingFormModal.js
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './AISettingFormModal.module.css';
import AssetPicker from '../AssetPicker/AssetPicker';

// Modelos OpenAI DALL-E suportados (hardcoded para o frontend, ou buscado de um endpoint de settings se houver)
const OPENAI_MODELS = ['dall-e-3', 'dall-e-2'];
const OPENAI_SIZES = ['1024x1024', '1792x1024', '1024x1792'];
const OPENAI_QUALITIES = ['standard', 'hd'];
const OPENAI_STYLES = ['vivid', 'natural'];

// Lista de TYPES pré-definidos para as configurações de IA no sistema.
// Estes devem ser os mesmos tipos que seu backend (OpenAISetting.js) espera.
const SYSTEM_AI_TYPES = [
    { value: 'character_drawing', label: 'Desenho de Personagem' },
    { value: 'coloring_book_page', label: 'Página de Colorir' },
    { value: 'story_book_illustration', label: 'Ilustração de Livro de História' },
    { value: 'story_intro', label: 'Página de Introdução da História' },
    { value: 'story_page_text', label: 'Página de Texto da História' },
    { value: 'special_jack_friends', label: 'Página Especial Jack e Amigos' },
    { value: 'story_cover', label: 'Capa/Contracapa de História' },
    { value: 'coloring_cover', label: 'Capa/Contracapa de Colorir' },
];


const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 150, damping: 20 } },
    exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } },
};

const AISettingFormModal = ({ show, onClose, onSave, settingData }) => {
    const initialState = {
        type: '', // Identificador único técnico
        name: '', // Nome amigável para o admin
        basePromptText: '',
        model: OPENAI_MODELS[0],
        size: OPENAI_SIZES[0],
        quality: OPENAI_QUALITIES[0],
        style: OPENAI_STYLES[0],
        isActive: true,
        baseAssets: [], 
    };
    const [formData, setFormData] = useState(initialState);
    const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);

    useEffect(() => {
        if (settingData) {
            setFormData({ ...initialState, ...settingData, baseAssets: settingData.baseAssets || [] });
        } else {
            setFormData(initialState); 
        }
    }, [settingData, show]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    
    const handleToggleAsset = (asset) => {
        setFormData(prev => {
            const existingAssets = prev.baseAssets || []; 
            const isSelected = existingAssets.some(a => a.id === asset.id);
            if (isSelected) {
                return { ...prev, baseAssets: existingAssets.filter(a => a.id !== asset.id) };
            } else {
                return { ...prev, baseAssets: [...existingAssets, asset] };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Verifica se o 'type' já foi selecionado para novas configurações
        if (!settingData && !formData.type) {
            alert("Por favor, selecione um Tipo de Configuração.");
            return;
        }

        const finalData = {
            ...formData,
            baseAssetIds: (formData.baseAssets || []).map(a => a.id),
        };
        delete finalData.baseAssets; 

        onSave(finalData.type, finalData);
    };

    return (
        <>
            <AnimatePresence>
                {show && (
                    <motion.div className={styles.backdrop} variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}>
                        <motion.div className={styles.modal} variants={modalVariants} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h3>{settingData ? 'Editar' : 'Criar Nova'} Configuração de IA</h3>
                                <button className={styles.closeButton} onClick={onClose}>×</button>
                            </div>
                            <div className={styles.modalBody}>
                                <form onSubmit={handleSubmit} className={styles.form}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="name">Nome da Configuração (Amigável)</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Ex: Estilo JackBoo para Personagens"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="type">Tipo de Configuração (Identificador Interno)</label>
                                        {settingData ? (
                                            // Se estiver editando, exibe o tipo como texto desabilitado
                                            <input type="text" id="type" name="type" value={formData.type} disabled />
                                        ) : (
                                            // Se estiver criando, exibe um dropdown para escolher o tipo
                                            <select id="type" name="type" value={formData.type} onChange={handleChange} required>
                                                <option value="">Selecione um tipo...</option>
                                                {SYSTEM_AI_TYPES.map(aiType => (
                                                    <option key={aiType.value} value={aiType.value}>
                                                        {aiType.label} ({aiType.value})
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        {settingData ? (
                                            <p className={styles.hint}>O tipo não pode ser alterado para configurações existentes.</p>
                                        ) : (
                                            <p className={styles.hint}>Este é o identificador único da configuração para o sistema. Não pode ser alterado após a criação.</p>
                                        )}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="basePromptText">Prompt Base</label>
                                        <textarea id="basePromptText" name="basePromptText" value={formData.basePromptText} onChange={handleChange} rows={6} required />
                                        <p className={styles.hint}>Use placeholders como [TITLE], [CHARACTER_NAME], [CHARACTER_DESC], [LUGAR], [TEMA].</p>
                                    </div>
                                    
                                    <div className={styles.grid}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="model">Modelo</label>
                                            <select id="model" name="model" value={formData.model} onChange={handleChange} required>
                                                {OPENAI_MODELS.map(model => (
                                                    <option key={model} value={model}>{model}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="size">Tamanho</label>
                                            <select id="size" name="size" value={formData.size} onChange={handleChange} required>
                                                {OPENAI_SIZES.map(size => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="quality">Qualidade</label>
                                            <select id="quality" name="quality" value={formData.quality} onChange={handleChange} required>
                                                {OPENAI_QUALITIES.map(quality => (
                                                    <option key={quality} value={quality}>{quality}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="style">Estilo</label>
                                            <select id="style" name="style" value={formData.style} onChange={handleChange} required>
                                                {OPENAI_STYLES.map(style => (
                                                    <option key={style} value={style}>{style}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Seção de seleção de Assets */}
                                    <div className={styles.assetsSection}>
                                        <label>Imagens de Referência de Estilo (Opcional)</label>
                                        <p className={styles.hint}>Estas imagens ajudam a IA a entender o estilo visual desejado. Remova-as clicando no 'x'.</p>
                                        <div className={styles.assetsGrid}>
                                            {(formData.baseAssets || []).map(asset => (
                                                <div key={asset.id} className={styles.assetPreview}>
                                                    <Image src={asset.url} alt={asset.name} width={80} height={80} style={{ objectFit: 'cover' }} unoptimized={true} />
                                                    <button type="button" className={styles.assetRemoveButton} onClick={() => handleToggleAsset(asset)}>×</button>
                                                </div>
                                            ))}
                                            <button type="button" className={styles.addAssetButton} onClick={() => setIsAssetPickerOpen(true)}>+</button>
                                        </div>
                                    </div>

                                    <div className={styles.formGroupCheckbox}>
                                        <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} />
                                        <label htmlFor="isActive">Ativo (Permitir uso desta configuração)</label>
                                    </div>
                                    
                                    <div className={styles.modalFooter}>
                                        <motion.button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</motion.button>
                                        <motion.button type="submit" className={styles.saveButton}>Salvar</motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAssetPickerOpen && (
                    <AssetPicker
                        selectedAssetIds={(formData.baseAssets || []).map(a => a.id)}
                        onToggleAsset={handleToggleAsset}
                        onClose={() => setIsAssetPickerOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default AISettingFormModal;