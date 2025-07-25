// /app/(admin)/admin/gpt-auxiliaries/_components/GptAuxiliaryModal.js
'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { adminAISettingsService } from '@/services/api';
import { toast } from 'react-toastify';
import styles from './GptAuxiliaryModal.module.css';

Modal.setAppElement('body');

const GptAuxiliaryModal = ({ isOpen, onClose, onSuccess, existingAuxiliary }) => {
    const [formData, setFormData] = useState({ name: '', type: '', basePromptText: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = Boolean(existingAuxiliary);

    useEffect(() => {
        if (existingAuxiliary) {
            setFormData({
                name: existingAuxiliary.name || '',
                type: existingAuxiliary.type || '',
                basePromptText: existingAuxiliary.basePromptText || '',
            });
        } else {
            setFormData({ name: '', type: '', basePromptText: '' });
        }
    }, [isOpen, existingAuxiliary]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, type, basePromptText } = formData;
        if (!name.trim() || !type.trim() || !basePromptText.trim()) {
            toast.warn('Todos os campos são obrigatórios.');
            return;
        }
        setIsSubmitting(true);
        try {
            await adminAISettingsService.createOrUpdateSetting(type, formData);
            toast.success(`Auxiliar "${name}" salvo com sucesso!`);
            onSuccess();
        } catch (error) {
            toast.error(`Falha ao salvar: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className={styles.modal} overlayClassName={styles.overlay}>
            <h2 className={styles.modalTitle}>{isEditing ? 'Editar Auxiliar GPT' : 'Criar Novo Auxiliar GPT'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Nome do Auxiliar</label>
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Ex: Roteiro para Livro de Colorir"/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="type">Chave do Sistema (Tipo)</label>
                    <input id="type" name="type" type="text" value={formData.type} onChange={handleChange} required disabled={isEditing} placeholder="Ex: coloring_book_storyline"/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="basePromptText">Prompt (Instruções para o GPT)</label>
                    <textarea id="basePromptText" name="basePromptText" value={formData.basePromptText} onChange={handleChange} required rows="10" placeholder="A IA analisará a imagem e usará este texto como instrução..."/>
                </div>
                <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
                    <button type="submit" className={styles.confirmButton} disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default GptAuxiliaryModal;