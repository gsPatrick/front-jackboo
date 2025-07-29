// /app/(admin)/admin/leonardo/elements/_components/EditElementModal.js
'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { adminLeonardoService } from '@/services/api';
import { toast } from 'react-toastify';
import styles from './TrainElementModal.module.css'; // Reutilizando os estilos

Modal.setAppElement('body');

const EditElementModal = ({ isOpen, onClose, onSuccess, element }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        basePrompt: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (element) {
            setFormData({
                name: element.name || '',
                description: element.description || '',
                basePrompt: element.basePrompt?.replace('{{GPT_OUTPUT}}', '').replace(/,\s*$/, '') || ''
            });
        }
    }, [element, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            toast.warn('O nome do modelo é obrigatório.');
            return;
        }
        
        setIsSubmitting(true);
        try {
            await adminLeonardoService.updateElement(element.id, formData);
            toast.success('Elemento atualizado com sucesso!');
            onSuccess();
        } catch (error) {
            toast.error(`Falha ao atualizar elemento: ${error.message}`);
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
            <h2 className={styles.modalTitle}>Editar Modelo: {element.name}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="edit-name">Nome do Modelo</label>
                    <input id="edit-name" name="name" type="text" value={formData.name} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="edit-basePrompt">Prompt Base</label>
                    <input id="edit-basePrompt" name="basePrompt" type="text" value={formData.basePrompt} onChange={handleChange} />
                    {/* CORREÇÃO AQUI: A placeholder agora é uma string literal */}
                    <small className={styles.helperText}>Palavras-chave de estilo. O sistema adicionará a descrição da cena (`{'{{GPT_OUTPUT}}'}`) automaticamente.</small>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="edit-description">Descrição</label>
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

export default EditElementModal;