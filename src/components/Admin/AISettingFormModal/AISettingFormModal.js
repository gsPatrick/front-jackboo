// src/components/Admin/AISettingFormModal/AISettingFormModal.js
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './AISettingFormModal.module.css';
import AssetPicker from '../AssetPicker/AssetPicker'; // <-- NOVO

// ... (variantes e TagInput permanecem os mesmos)
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 150, damping: 20 } },
    exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } },
};
const TagInput = ({ label, tags, onAddTag, onRemoveTag }) => {
    const [inputValue, setInputValue] = useState('');
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (inputValue.trim() !== '' && !tags.includes(inputValue.trim())) {
                onAddTag(inputValue.trim());
                setInputValue('');
            }
        }
    };
    return (
        <div className={styles.formGroup}>
            <label>{label}</label>
            <div className={styles.tagInputContainer}>
                {tags.map((tag, index) => (
                    <div key={index} className={styles.tag}>
                        {tag}
                        <button type="button" className={styles.tagRemove} onClick={() => onRemoveTag(tag)}>×</button>
                    </div>
                ))}
                <input type="text" className={styles.tagInputField} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="Adicionar e pressionar Enter..." />
            </div>
        </div>
    );
};

const AISettingFormModal = ({ show, onClose, onSave, settingData }) => {
    const initialState = {
        name: '', type: '', basePromptText: '', model: 'dall-e-3',
        sizes: [], qualities: [], styles: [], isActive: true, adminAssets: []
    };
    const [formData, setFormData] = useState(initialState);
    const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false); // <-- NOVO

    useEffect(() => {
        setFormData(settingData ? { ...initialState, ...settingData } : initialState);
    }, [settingData, show]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleAddTag = (field, tag) => setFormData(prev => ({ ...prev, [field]: [...prev[field], tag] }));
    const handleRemoveTag = (field, tag) => setFormData(prev => ({ ...prev, [field]: prev[field].filter(t => t !== tag) }));
    
    // NOVO: Gerenciar seleção de assets
    const handleToggleAsset = (asset) => {
        setFormData(prev => {
            const existingAssets = prev.adminAssets || [];
            const isSelected = existingAssets.some(a => a.id === asset.id);
            if (isSelected) {
                return { ...prev, adminAssets: existingAssets.filter(a => a.id !== asset.id) };
            } else {
                return { ...prev, adminAssets: [...existingAssets, asset] };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            // Em um app real, aqui você mapearia para enviar apenas os IDs
            baseAssetIds: formData.adminAssets.map(a => a.id)
        }
        delete finalData.adminAssets; // Remove o objeto completo antes de "enviar"
        onSave(finalData);
        onClose();
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
                                    {/* ... outros campos do formulário (name, type, prompt, etc) ... */}
                                    <div className={styles.formGroup}>
                                        <label htmlFor="name">Nome da Configuração</label>
                                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    {/* ... */}
                                    <div className={styles.formGroup}>
                                        <label htmlFor="basePromptText">Prompt Base</label>
                                        <textarea id="basePromptText" name="basePromptText" value={formData.basePromptText} onChange={handleChange} rows={6} required />
                                    </div>
                                    {/* ... */}
                                    <TagInput label="Estilos" tags={formData.styles} onAddTag={(tag) => handleAddTag('styles', tag)} onRemoveTag={(tag) => handleRemoveTag('styles', tag)} />


                                    {/* NOVO: Seção de seleção de Assets */}
                                    <div className={styles.assetsSection}>
                                        <label>Imagens de Referência de Estilo</label>
                                        <div className={styles.assetsGrid}>
                                            {(formData.adminAssets || []).map(asset => (
                                                <div key={asset.id} className={styles.assetPreview}>
                                                    <Image src={asset.url} alt={asset.name} width={80} height={80} style={{ objectFit: 'cover' }}/>
                                                </div>
                                            ))}
                                            <button type="button" className={styles.addAssetButton} onClick={() => setIsAssetPickerOpen(true)}>+</button>
                                        </div>
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
                        selectedAssetIds={(formData.adminAssets || []).map(a => a.id)}
                        onToggleAsset={handleToggleAsset}
                        onClose={() => setIsAssetPickerOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default AISettingFormModal;