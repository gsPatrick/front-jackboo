// /app/(admin)/admin/ai-settings/_components/TemplateFormModal.js
'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { adminAISettingsService, adminLeonardoService } from '@/services/api';
import { toast } from 'react-toastify';
import styles from './TemplateFormModal.module.css';

Modal.setAppElement('body');

// Estrutura para construção guiada do 'type'
const typeStructure = {
    USER: {
        character: ['description', 'drawing'],
        book: ['theme_and_title', 'cover_generation'],
        coloring_book: ['storyline', 'page_generation'],
        story_book: ['storyline', 'illustration_generation'],
    },
    ADMIN: {
        character: ['description', 'drawing'],
        coloring_book: ['storyline', 'cover_generation', 'page_generation'],
        story_book: ['storyline', 'cover_generation', 'illustration_generation'],
    }
};

const TemplateFormModal = ({ isOpen, onClose, onSuccess, existingTemplate, allTemplates }) => {
    const [formData, setFormData] = useState({
        name: '',
        basePromptText: '',
        helperPromptId: '',
        defaultElementId: '', // Campo para associar o Element
    });
    
    const [elements, setElements] = useState([]);
    const [typeContext, setTypeContext] = useState('ADMIN');
    const [typeFlow, setTypeFlow] = useState('character');
    const [typeStep, setTypeStep] = useState('description');
    
    const [finalType, setFinalType] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const isEditing = Boolean(existingTemplate);

    useEffect(() => {
        if (isOpen) {
            const fetchElements = async () => {
                try {
                    const data = await adminLeonardoService.listElements();
                    setElements(data.filter(el => el.status === 'COMPLETE') || []);
                } catch (error) {
                    toast.error("Erro ao buscar os modelos de estilo (Elements).");
                }
            };
            fetchElements();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isEditing) {
            let flowString = typeFlow.replace(/_book$/, '');
            let final = `${typeContext}_${flowString}_${typeStep}`;
            setFinalType(final);
        }
    }, [typeContext, typeFlow, typeStep, isEditing]);
    
    useEffect(() => {
        if (isEditing && existingTemplate) {
            setFormData({
                name: existingTemplate.name || '',
                basePromptText: existingTemplate.basePromptText || '',
                helperPromptId: existingTemplate.helperPromptId || '',
                defaultElementId: existingTemplate.defaultElementId || '',
            });
            setFinalType(existingTemplate.type);
        } else {
            setFormData({ name: '', basePromptText: '', helperPromptId: '', defaultElementId: '' });
            setTypeContext('ADMIN');
            setTypeFlow('character');
            setTypeStep('description');
        }
    }, [isOpen, existingTemplate, isEditing]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !finalType.trim() || !formData.basePromptText.trim()) {
            toast.warn('Nome e Texto do Prompt são obrigatórios.');
            return;
        }
        setIsSubmitting(true);
        const submissionData = { ...formData, type: finalType };

        try {
            // O serviço de back-end espera o tipo (a chave) e os dados
            await adminAISettingsService.createOrUpdateSetting(finalType, submissionData);
            toast.success(`Template "${formData.name}" ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
            onSuccess();
        } catch (error) {
            toast.error(`Falha ao salvar template: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const availableHelpers = allTemplates.filter(t => !existingTemplate || t.id !== existingTemplate.id);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
            contentLabel={isEditing ? 'Editar Template de IA' : 'Criar Novo Template de IA'}
        >
            <h2 className={styles.modalTitle}>{isEditing ? 'Editar Template (Auxiliar GPT)' : 'Criar Novo Template (Auxiliar GPT)'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                
                <div className={styles.formGroup}>
                    <label htmlFor="name">Nome do Template</label>
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Ex: Roteiro Mágico para Colorir (Admin)"/>
                </div>

                {isEditing ? (
                    <div className={styles.formGroup}>
                        <label>Tipo (Chave do Sistema)</label>
                        <input type="text" value={finalType} disabled />
                        <small className={styles.helperText}>O tipo não pode ser alterado após a criação.</small>
                    </div>
                ) : (
                    <>
                        <label className={styles.groupLabel}>Defina o Propósito do Template</label>
                        <div className={styles.grid}>
                             <div className={styles.formGroup}>
                                <label htmlFor="typeContext">Contexto</label>
                                <select id="typeContext" value={typeContext} onChange={(e) => { setTypeContext(e.target.value); setTypeFlow(Object.keys(typeStructure[e.target.value])[0]); }}>
                                    <option value="ADMIN">Admin</option>
                                    <option value="USER">Usuário</option>
                                </select>
                             </div>
                             <div className={styles.formGroup}>
                                <label htmlFor="typeFlow">Fluxo</label>
                                <select id="typeFlow" value={typeFlow} onChange={(e) => { setTypeFlow(e.target.value); setTypeStep(typeStructure[typeContext][e.target.value][0]); }}>
                                    {Object.keys(typeStructure[typeContext]).map(flow => (
                                        <option key={flow} value={flow}>{flow.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                             </div>
                             <div className={styles.formGroup}>
                                <label htmlFor="typeStep">Etapa</label>
                                 <select id="typeStep" value={typeStep} onChange={(e) => setTypeStep(e.target.value)}>
                                    {typeStructure[typeContext][typeFlow].map(step => (
                                         <option key={step} value={step}>{step.replace(/_/g, ' ')}</option>
                                    ))}
                                 </select>
                             </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Tipo (Chave do Sistema) Gerado</label>
                            <input type="text" value={finalType} disabled className={styles.generatedType} />
                        </div>
                    </>
                )}

                <div className={styles.formGroup}>
                    <label htmlFor="basePromptText">Texto do Prompt (Instruções para o GPT)</label>
                    <textarea id="basePromptText" name="basePromptText" value={formData.basePromptText} onChange={handleChange} required rows="8" placeholder="Digite as instruções para o GPT aqui..."/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="defaultElementId">Elemento de Estilo Associado (Opcional)</label>
                    <select id="defaultElementId" name="defaultElementId" value={formData.defaultElementId} onChange={handleChange}>
                        <option value="">Nenhum / Usar Padrão do Sistema</option>
                        {elements.map(el => <option key={el.leonardoElementId} value={el.leonardoElementId}>{el.name}</option>)}
                    </select>
                    <small className={styles.helperText}>Associe um "pincel" a este "roteiro". Isso definirá o estilo visual da geração.</small>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="helperPromptId">Helper Prompt (Auxiliar do Auxiliar)</label>
                    <select id="helperPromptId" name="helperPromptId" value={formData.helperPromptId} onChange={handleChange}>
                        <option value="">Nenhum</option>
                        {availableHelpers.map(h => <option key={h.id} value={h.id}>{h.name} ({h.type})</option>)}
                    </select>
                </div>

                <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isSubmitting}>
                        Cancelar
                    </button>
                    <button type="submit" className={styles.confirmButton} disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar Template'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default TemplateFormModal;