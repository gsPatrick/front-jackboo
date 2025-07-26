// src/app/(admin)/admin/characters/_components/GenerateOfficialCharacterModal.js
'use client';

import React, { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import Image from 'next/image';

import { adminCharactersService } from '@/services/api';
import styles from './Modals.module.css';

Modal.setAppElement('body');

export default function GenerateOfficialCharacterModal({ isOpen, onClose, onSuccess }) {
    // ✅ CORREÇÃO: Adicionado estado para o nome do personagem
    const [name, setName] = useState('');
    const [drawing, setDrawing] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setDrawing(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const resetForm = () => {
        // ✅ CORREÇÃO: Limpa o nome ao resetar
        setName('');
        setDrawing(null);
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setPreview(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ✅ CORREÇÃO: Valida o nome e o desenho
        if (!name.trim() || !drawing) {
            toast.warn("Por favor, forneça um nome e selecione um desenho base.");
            return;
        }
        setIsSubmitting(true);
        
        const formData = new FormData();
        // ✅ CORREÇÃO: Adiciona o nome e o desenho ao FormData
        formData.append('name', name.trim());
        formData.append('drawing', drawing);
        
        try {
            await adminCharactersService.createOfficialCharacter(formData);
            toast.success("Geração do personagem iniciada! Atualize a lista em instantes.");
            onSuccess();
            handleClose();
        } catch (error) {
            toast.error(`Falha ao iniciar geração: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={handleClose} className={styles.modal} overlayClassName={styles.overlay}>
            <h2 className={styles.modalTitle}>Gerar Personagem com IA</h2>
            <p className={styles.modalSubtitle}>
                O personagem será gerado usando o estilo padrão definido para usuários.
            </p>
            <form onSubmit={handleSubmit}>
                {/* ✅ CORREÇÃO: Adicionado campo para o nome */}
                <div className={styles.formGroup}>
                    <label htmlFor="char-name-gen">Nome do Personagem</label>
                    <input id="char-name-gen" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Dragão Zé" required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="char-file-gen">Desenho Base (Rascunho)</label>
                    <input id="char-file-gen" type="file" accept="image/*" onChange={handleFileChange} required />
                </div>
                {preview && (
                    <div className={styles.preview}>
                        <Image src={preview} alt="Preview do desenho" width={100} height={100} style={{ objectFit: 'cover' }}/>
                    </div>
                )}
                
                <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelButton} onClick={handleClose} disabled={isSubmitting}>Cancelar</button>
                    <button type="submit" className={styles.confirmButton} disabled={isSubmitting}>
                        {isSubmitting ? 'Iniciando...' : 'Iniciar Geração'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}