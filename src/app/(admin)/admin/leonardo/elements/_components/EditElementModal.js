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
        basePromptText: '' // ✅ CORREÇÃO: Nome do campo para basePromptText
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (element) {
            setFormData({
                name: element.name || '',
                description: element.description || '',
                // ✅ CORREÇÃO: Carrega o valor de element.basePromptText
                // Remove o {{GPT_OUTPUT}} e a vírgula do final para edição amigável
                basePromptText: element.basePromptText?.replace(/,?\s*\{\{GPT_OUTPUT\}\}\s*$/g, '') || '' 
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
            // ✅ CORREÇÃO: Envia basePromptText para o serviço
            await adminLeonardoService.updateElement(element.id, { 
                name: formData.name,
                description: formData.description,
                basePromptText: formData.basePromptText, // Envia o campo correto
            });
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
                    <label htmlFor="edit-basePromptText">Prompt Base</label> {/* ✅ CORREÇÃO: Label ajustada */}
                    <textarea 
                        id="edit-basePromptText" // ✅ CORREÇÃO: ID ajustado
                        name="basePromptText" // ✅ CORREÇÃO: Nome ajustado
                        value={formData.basePromptText} 
                        onChange={handleChange}
                        rows="4"
                        placeholder="Ex: estilo de desenho animado, cores vibrantes..."
                    />
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