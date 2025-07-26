// src/app/(admin)/admin/print-formats/_components/FormatModal.js
'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

import { adminTaxonomiesService } from '@/services/api';
import styles from './FormatModal.module.css';

Modal.setAppElement('body');

const initialFormState = {
    name: '',
    pageWidth: '',
    pageHeight: '',
    coverWidth: '',
    coverHeight: '',
    margin: '1.5',
    isActive: true,
};

export default function FormatModal({ isOpen, onClose, onSuccess, formatData }) {
    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditing = Boolean(formatData);

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                setFormData(formatData);
            } else {
                setFormData(initialFormState);
            }
        }
    }, [isOpen, isEditing, formatData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (isEditing) {
                await adminTaxonomiesService.updatePrintFormat(formatData.id, formData);
                toast.success('Formato atualizado com sucesso!');
            } else {
                await adminTaxonomiesService.createPrintFormat(formData);
                toast.success('Formato criado com sucesso!');
            }
            onSuccess(); // Atualiza a lista na página principal
            onClose();   // Fecha o modal
        } catch (error) {
            toast.error(`Erro ao salvar formato: ${error.message}`);
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
        >
            <h2 className={styles.modalTitle}>{isEditing ? 'Editar Formato' : 'Criar Novo Formato'}</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Nome do Formato</label>
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Ex: A4 Retrato" />
                </div>

                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="pageWidth">Largura da Página (cm)</label>
                        <input id="pageWidth" name="pageWidth" type="number" step="0.1" value={formData.pageWidth} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="pageHeight">Altura da Página (cm)</label>
                        <input id="pageHeight" name="pageHeight" type="number" step="0.1" value={formData.pageHeight} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="coverWidth">Largura da Capa (cm)</label>
                        <input id="coverWidth" name="coverWidth" type="number" step="0.1" value={formData.coverWidth} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="coverHeight">Altura da Capa (cm)</label>
                        <input id="coverHeight" name="coverHeight" type="number" step="0.1" value={formData.coverHeight} onChange={handleChange} required />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="margin">Margem (cm)</label>
                    <input id="margin" name="margin" type="number" step="0.1" value={formData.margin} onChange={handleChange} required />
                </div>
                
                <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isSubmitting}>Cancelar</button>
                    <button type="submit" className={styles.confirmButton} disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar Formato'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}