'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { adminLeonardoService } from '@/services/api';
import { toast } from 'react-toastify';
import styles from './TrainElementModal.module.css'; // Reutilizando os estilos

Modal.setAppElement('body');

const EditElementModal = ({ isOpen, onClose, onSuccess, elementData }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        basePromptText: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (elementData) {
            setFormData({
                name: elementData.name || '',
                description: elementData.description || '',
                // ✅ CORREÇÃO: Colocado entre aspas para ser uma string.
                basePromptText: elementData.basePromptText || '{{DESCRIPTION}}',
            });
        }
    }, [elementData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await adminLeonardoService.updateElement(elementData.id, formData);
            toast.success('Element atualizado com sucesso!');
            onSuccess();
        } catch (error) {
            toast.error(`Falha ao atualizar: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
            contentLabel="Editar Modelo (Element)"
        >
            <h2 className={styles.modalTitle}>Editar: {elementData?.name}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="edit-name">Nome do Modelo</label>
                    <input id="edit-name" name="name" type="text" value={formData.name} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="edit-basePromptText">Prompt Base de Geração</label>
                    <textarea id="edit-basePromptText" name="basePromptText" value={formData.basePromptText} onChange={handleChange} rows="4" required />
                    <small className={styles.helperText}>Use `{{DESCRIPTION}}` para inserir a descrição do GPT.</small>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="edit-description">Descrição (Interna)</label>
                    <textarea id="edit-description" name="description" value={formData.description} onChange={handleChange} rows="3" />
                </div>
                <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
                    <button type="submit" className={styles.confirmButton} disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};