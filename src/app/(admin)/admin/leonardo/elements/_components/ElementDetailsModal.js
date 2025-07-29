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
                // Ao carregar, remove o {{GPT_OUTPUT}} para que o admin edite só a parte dele.
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
        // Apenas o `basePrompt` pode ser editado. Name e description são apenas para exibição aqui.
        // O backend deve ter a lógica para aceitar a edição apenas dos campos permitidos.
        
        setIsSubmitting(true);
        try {
            await adminLeonardoService.updateElement(element.id, { 
                basePrompt: formData.basePrompt,
                // Não permite editar nome e descrição por este modal.
                // name: formData.name, 
                // description: formData.description 
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
                    <input type="text" value={formData.name} readOnly disabled /> {/* Apenas leitura */}
                </div>

                <div className={styles.formGroup}>
                    <label>Dataset de Origem</label>
                    <input type="text" value={element.sourceDataset?.name || 'N/A'} readOnly disabled /> {/* Apenas leitura */}
                </div>

                <div className={styles.formGroup}>
                    <label>Status</label>
                    <input type="text" value={element.status} readOnly disabled /> {/* Apenas leitura */}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="edit-basePrompt">Prompt Base (editável)</label>
                    <input 
                        id="edit-basePrompt" 
                        name="basePrompt" 
                        type="text" 
                        value={formData.basePrompt} 
                        onChange={handleChange} 
                    />


                </div>

                <div className={styles.formGroup}>
                    <label>Descrição</label>
                    <textarea value={formData.description} readOnly disabled rows="3" /> {/* Apenas leitura */}
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