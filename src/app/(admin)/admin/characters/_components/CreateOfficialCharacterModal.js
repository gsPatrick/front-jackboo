// src/app/(admin)/admin/characters/_components/CreateOfficialCharacterModal.js
'use client';

import React, { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import Image from 'next/image';

import { adminCharactersService } from '@/services/api';
import styles from './Modals.module.css';

Modal.setAppElement('body');

export default function CreateOfficialCharacterModal({ isOpen, onClose, onSuccess }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [characterFile, setCharacterFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setCharacterFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setCharacterFile(null);
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
        if (!name.trim() || !description.trim() || !characterFile) {
            toast.warn("Nome, descrição e imagem do personagem são obrigatórios.");
            return;
        }
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('name', name.trim());
        formData.append('description', description.trim());
        // ✅ CORREÇÃO CRÍTICA: O nome do campo do arquivo deve ser 'characterImage'.
        formData.append('characterImage', characterFile);
        
        try {
            await adminCharactersService.createOfficialCharacterByUpload(formData);
            toast.success("Personagem criado com sucesso!");
            onSuccess();
            handleClose();
        } catch (error) {
            toast.error(`Falha ao criar personagem: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={handleClose} className={styles.modal} overlayClassName={styles.overlay}>
            <h2 className={styles.modalTitle}>Criar Personagem (Upload Direto)</h2>
            <p className={styles.modalSubtitle}>
                Envie uma imagem já finalizada para o personagem.
            </p>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="char-name-upload">Nome do Personagem</label>
                    <input id="char-name-upload" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Princesa Lua" required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="char-desc-upload">Descrição Curta</label>
                    <textarea id="char-desc-upload" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva o personagem em uma frase." required />
                </div>
                
                <div className={styles.formGroup}>
                    <label htmlFor="char-file-upload">Imagem Finalizada</label>
                    <input id="char-file-upload" type="file" accept="image/*" onChange={handleFileChange} required />
                </div>
                {preview && (
                    <div className={styles.preview}>
                        <Image src={preview} alt="Preview do personagem" width={100} height={100} style={{ objectFit: 'cover' }}/>
                    </div>
                )}
                
                <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelButton} onClick={handleClose} disabled={isSubmitting}>Cancelar</button>
                    <button type="submit" className={styles.confirmButton} disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Salvar Personagem'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}