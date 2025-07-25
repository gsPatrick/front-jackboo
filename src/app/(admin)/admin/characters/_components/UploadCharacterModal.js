// /app/(admin)/admin/characters/_components/UploadCharacterModal.js
'use client';

import React, { useState } from 'react';
import Modal from 'react-modal';
import Image from 'next/image';
import { adminCharactersService } from '@/services/api';
import { toast } from 'react-toastify';
import styles from './Modals.module.css';
import { FaUpload, FaSpinner, FaImage } from 'react-icons/fa';

Modal.setAppElement('body');

const UploadCharacterModal = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    
    const handleClose = () => {
        setName('');
        setFile(null);
        setPreview(null);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !file) {
            toast.warn('Nome e arquivo da imagem são obrigatórios.');
            return;
        }
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('characterImage', file);

        try {
            await adminCharactersService.createOfficialCharacterByUpload(formData);
            toast.success('Personagem enviado! A descrição será gerada em segundo plano.');
            handleClose();
            onSuccess();
        } catch (error) {
            toast.error(`Falha ao criar personagem: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
            contentLabel="Adicionar Personagem via Upload"
        >
            <h2 className={styles.modalTitle}>Adicionar Personagem (Upload)</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                 <div className={styles.formGroup}>
                    <label htmlFor="charName">Nome do Personagem</label>
                    <input id="charName" type="text" placeholder="Nome do Personagem" value={name} onChange={(e) => setName(e.target.value)} required />
                 </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="charFile">Arquivo da Imagem Final</label>
                    <input id="charFile" type="file" onChange={handleFileChange} accept="image/*" required style={{ display: 'none' }}/>
                    <label htmlFor="charFile" className={styles.fileInputLabel}>
                        {preview ? <Image src={preview} alt="Pré-visualização" width={100} height={100} /> : <FaImage />}
                        <span>{file ? file.name : 'Clique para selecionar a imagem'}</span>
                    </label>
                 </div>
                <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelButton} onClick={handleClose}>Cancelar</button>
                    <button type="submit" className={styles.confirmButton} disabled={isSubmitting}>
                        {isSubmitting ? <FaSpinner className={styles.spinner}/> : <FaUpload/>}
                        {isSubmitting ? 'Enviando...' : 'Fazer Upload'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default UploadCharacterModal;