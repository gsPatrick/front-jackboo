'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AISettingFormModal.module.css';
import { FaComments, FaImage, FaTimes, FaLink, FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';
import AssetPicker from '../AssetPicker/AssetPicker';
import { adminAISettingsService } from '@/services/api';

// --- Subcomponente para a tela de seleção inicial ---
const EngineSelectionScreen = ({ onSelect }) => (
    <div className={styles.engineSelectionContainer}>
        <h3 className={styles.engineTitle}>Para qual finalidade é este template?</h3>
        <div className={styles.engineOptions}>
            <motion.div className={styles.engineCard} onClick={() => onSelect('text')} whileHover={{ y: -5 }}>
                <FaComments className={styles.engineIcon} />
                <h4>Texto / Lógica (GPT)</h4>
                <p>Para gerar roteiros, descrições, títulos ou analisar imagens.</p>
            </motion.div>
            <motion.div className={styles.engineCard} onClick={() => onSelect('image')} whileHover={{ y: -5 }}>
                <FaImage className={styles.engineIcon} />
                <h4>Geração de Imagem (Leonardo)</h4>
                <p>Para criar personagens, páginas de colorir, capas e ilustrações.</p>
            </motion.div>
        </div>
    </div>
);

// --- Componente principal do Modal ---
export default function AISettingFormModal({ show, onClose, onSave, settingData }) {
    const initialState = {
        type: '', name: '', basePromptText: '', isActive: true,
        model: 'b2614463-296c-462a-9586-aafdb8f00e36', size: '1024x1024', quality: 'standard', style: 'vivid',
        baseAssets: [],
        helperPromptId: '',
    };
    
    const [formData, setFormData] = useState(initialState);
    const [templateEngine, setTemplateEngine] = useState(null);
    const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
    const [textTemplates, setTextTemplates] = useState([]);

    useEffect(() => {
        if (show) {
            adminAISettingsService.listSettings()
                .then(allSettings => {
                    // CORREÇÃO: Um template de texto é aquele que é ativo e NÃO tem um 'model' definido.
                    const filtered = allSettings.filter(s => s.isActive && !s.model);
                    setTextTemplates(filtered);
                })
                .catch(err => console.error("Falha ao carregar templates de texto para o dropdown", err));
        }
    }, [show]);

    useEffect(() => {
        if (show) {
            if (settingData) {
                // Um template é de imagem se tiver o campo 'model' preenchido.
                const isImg = !!settingData.model;
                setTemplateEngine(isImg ? 'image' : 'text');
                setFormData({ 
                    ...initialState, 
                    ...settingData, 
                    baseAssets: settingData.baseAssets || [],
                    helperPromptId: settingData.helperPromptId || ''
                });
            } else {
                setTemplateEngine(null);
                setFormData(initialState);
            }
        }
    }, [settingData, show]);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleToggleAsset = (asset) => {
        setFormData(prev => ({
            ...prev,
            baseAssets: prev.baseAssets.some(a => a.id === asset.id)
                ? prev.baseAssets.filter(a => a.id !== asset.id)
                : [...prev.baseAssets, asset]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let payload = {
            ...formData,
            baseAssetIds: formData.baseAssets.map(asset => asset.id)
        };
        delete payload.baseAssets;

        // CORREÇÃO: Se o motor for de texto, anula os campos específicos de imagem para evitar inconsistência.
        if (templateEngine === 'text') {
            payload.model = null;
            payload.size = null;
            payload.quality = null;
            payload.style = null;
        }
        
        onSave(formData.type, payload);
    };

    const handleBackToSelection = () => {
        setTemplateEngine(null);
        setFormData(initialState);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div className={styles.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
                    <motion.div className={styles.modal} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>{settingData ? 'Editar' : 'Criar'} Template de IA</h3>
                            <button className={styles.closeButton} onClick={onClose}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            <AnimatePresence mode="wait">
                                {!templateEngine && !settingData ? (
                                    <motion.div key="selection" exit={{ opacity: 0, scale: 0.95 }}>
                                       <EngineSelectionScreen onSelect={setTemplateEngine} />
                                    </motion.div>
                                ) : (
                                    <motion.form key="form" onSubmit={handleSubmit} className={styles.form} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        {!settingData && <button type="button" onClick={handleBackToSelection} className={styles.backButton}><FaArrowLeft /> Mudar tipo de motor</button>}
                                        
                                        <div className={styles.formGroup}>
                                            <label>Nome do Template</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Geração de Personagem (Usuário)" required />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Identificador Único (Type)</label>
                                            <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="Ex: USER_character_drawing" required disabled={!!settingData} />
                                            <p className={styles.hint}>Chave do sistema. Uma vez salvo, não pode ser alterado.</p>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Texto do Prompt (Template)</label>
                                            <textarea name="basePromptText" value={formData.basePromptText} onChange={handleChange} rows={templateEngine === 'image' ? 5 : 10} required />
                                            <p className={styles.hint}>{'Use placeholders como {{DESCRIPTION}}, {{THEME}}, etc.'}</p>
                                        </div>

                                        {templateEngine === 'image' && (
                                            <div className={styles.formGroup}>
                                                <label><FaLink /> Template de Texto Ajudante (Opcional)</label>
                                                <select name="helperPromptId" value={formData.helperPromptId} onChange={handleChange}>
                                                    <option value="">Nenhum (usará prompt direto)</option>
                                                    {textTemplates.map(template => (
                                                        <option key={template.id} value={template.id}>
                                                            {template.name} ({template.type})
                                                        </option>
                                                    ))}
                                                </select>
                                                <p className={styles.hint}>Associe um template de texto (GPT) para pré-processar informações.</p>
                                            </div>
                                        )}

                                        <div className={styles.assetsSection}>
                                            <label>Assets de Referência de Estilo</label>
                                            <p className={styles.hint}>Selecione imagens que ajudarão a guiar a IA para o estilo visual desejado (opcional).</p>
                                            <div className={styles.assetsGrid}>
                                                {formData.baseAssets.map(asset => (
                                                    <div key={asset.id} className={styles.assetPreview}>
                                                        <Image src={asset.url} alt={asset.name} layout="fill" objectFit="cover" unoptimized={true} />
                                                        <button type="button" className={styles.assetRemoveButton} onClick={() => handleToggleAsset(asset)} title={`Remover ${asset.name}`}><FaTimes /></button>
                                                    </div>
                                                ))}
                                                <button type="button" className={styles.addAssetButton} onClick={() => setIsAssetPickerOpen(true)} title="Adicionar asset">+</button>
                                            </div>
                                        </div>

                                        {templateEngine === 'image' && (
                                            <details className={styles.details} open>
                                                <summary>Parâmetros de Geração de Imagem</summary>
                                                <div className={styles.detailsContent}>
                                                    <div className={styles.grid}>
                                                        <div className={styles.formGroup}><label>Modelo</label><input type="text" name="model" value={formData.model} onChange={handleChange} /></div>
                                                        <div className={styles.formGroup}><label>Tamanho</label><input type="text" name="size" value={formData.size} onChange={handleChange} /></div>
                                                        <div className={styles.formGroup}><label>Qualidade</label><input type="text" name="quality" value={formData.quality} onChange={handleChange} /></div>
                                                        <div className={styles.formGroup}><label>Estilo</label><input type="text" name="style" value={formData.style} onChange={handleChange} /></div>
                                                    </div>
                                                </div>
                                            </details>
                                        )}

                                        <div className={styles.formGroupCheckbox}>
                                            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} />
                                            <label htmlFor="isActive">Ativo (pode ser usado pelo sistema)</label>
                                        </div>
                                        
                                        <div className={styles.modalFooter}>
                                            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
                                            <button type="submit" className={styles.saveButton}>Salvar Template</button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <AnimatePresence>
                            {isAssetPickerOpen && (
                                <AssetPicker 
                                    selectedAssetIds={formData.baseAssets.map(a => a.id)}
                                    onToggleAsset={handleToggleAsset}
                                    onClose={() => setIsAssetPickerOpen(false)}
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}