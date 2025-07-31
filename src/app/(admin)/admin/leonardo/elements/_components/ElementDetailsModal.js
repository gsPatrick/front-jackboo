// /app/(admin)/admin/leonardo/elements/_components/ElementDetailsModal.js
'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { adminLeonardoService } from '@/services/api';
import { toast } from 'react-toastify';
import styles from './TrainElementModal.module.css'; // Reutilizando os estilos

Modal.setAppElement('body');

const ElementDetailsModal = ({ isOpen, onClose, onSuccess, element }) => {
    const [formData, setFormData] = useState({
        basePrompt: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (element) {
            setFormData({
                basePrompt: element.basePrompt?.replace(/,?\s*\{\{GPT_OUTPUT\}\}\s*$/g, '') || ''
            });
        }
    }, [element, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsSubmitting(true);
        try {
            await adminLeonardoService.updateElement(element.id, { 
                basePrompt: formData.basePrompt,
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
            contentLabel="Detalhes do Modelo (Element)"
        >
            <h2 className={styles.modalTitle}>Detalhes do Modelo: {element.name}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Nome do Modelo</label>
                    <input type="text" value={element.name || ''} readOnly disabled />
                </div>

                {/* CAMPO RENDERIZADO CONDICIONALMENTE */}
                {element.sourceDataset && (
                    <div className={styles.formGroup}>
                        <label>Dataset de Origem</label>
                        <input type="text" value={element.sourceDataset.name} readOnly disabled />
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label>Status</label>
                    <input type="text" value={element.status || 'N/A'} readOnly disabled />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="edit-basePrompt">Prompt Base (editável)</label>
                    <textarea 
                        id="edit-basePrompt" 
                        name="basePrompt" 
                        value={formData.basePrompt} 
                        onChange={handleChange}
                        rows="4"
                        placeholder="Ex: estilo de desenho animado, cores vibrantes..."
                    />
                    <small className={styles.helperText}>Palavras-chave de estilo. A descrição da cena será adicionada automaticamente.</small>
                </div>

                <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelButton} onClick={onClose}>Fechar</button>
                    <button type="submit" className={styles.confirmButton} disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar Prompt Base'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ElementDetailsModal;