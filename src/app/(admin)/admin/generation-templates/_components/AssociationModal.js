'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { adminAISettingsService } from '@/services/api';
import { toast } from 'react-toastify';
import styles from './AssociationModal.module.css';

Modal.setAppElement('body');

const AssociationModal = ({ isOpen, onClose, onSuccess, element, gptAuxiliaries, currentAssociation }) => {
    // Se já existe uma associação, o valor inicial é o 'type' desse GPT, senão é vazio
    const [selectedGptType, setSelectedGptType] = useState(currentAssociation?.type || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setSelectedGptType(currentAssociation?.type || '');
    }, [currentAssociation, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Desassociar o antigo, se houver
            if (currentAssociation && currentAssociation.type !== selectedGptType) {
                const oldGpt = { ...currentAssociation, defaultElementId: null };
                await adminAISettingsService.createOrUpdateSetting(currentAssociation.type, oldGpt);
            }

            // Associar o novo, se um for selecionado
            if (selectedGptType) {
                const newGpt = gptAuxiliaries.find(g => g.type === selectedGptType);
                if (newGpt) {
                    const updatedGpt = { ...newGpt, defaultElementId: element.leonardoElementId };
                    await adminAISettingsService.createOrUpdateSetting(selectedGptType, updatedGpt);
                }
            }
            
            toast.success('Associação atualizada com sucesso!');
            onSuccess();

        } catch (error) {
            toast.error(`Falha ao salvar associação: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className={styles.modal} overlayClassName={styles.overlay}>
            <h2 className={styles.modalTitle}>Associar a: <span className={styles.elementName}>{element.name}</span></h2>
            <p className={styles.subtitle}>Selecione o "roteirista" (GPT Auxiliar) para este "artista" (Element).</p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="gptSelect">GPT Auxiliar</label>
                    <select id="gptSelect" value={selectedGptType} onChange={(e) => setSelectedGptType(e.target.value)}>
                        <option value="">-- Nenhuma Associação --</option>
                        {gptAuxiliaries.map(gpt => (
                            <option key={gpt.id} value={gpt.type}>{gpt.name} ({gpt.type})</option>
                        ))}
                    </select>
                </div>
                 <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
                    <button type="submit" className={styles.confirmButton} disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar Associação'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AssociationModal;