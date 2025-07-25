// /app/(admin)/admin/characters/_components/GenerateCharacterModal.js
'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Image from 'next/image';
import { adminCharactersService, adminTaxonomiesService } from '@/services/api';
import { toast } from 'react-toastify';
import styles from './Modals.module.css';
import { FaMagic, FaSpinner, FaImage } from 'react-icons/fa';

Modal.setAppElement('body');

const GenerateCharacterModal = ({ isOpen, onClose, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState(''); // State para o ID do template
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchTemplates = async () => {
                try {
                    const data = await adminTaxonomiesService.listAiTemplates();
                    // Filtra para mostrar apenas templates ADMIN focados em geração de personagem
                    setTemplates(data.filter(t => t.type && t.type === 'ADMIN_character_drawing') || []);
                } catch (error) {
                    toast.error("Erro ao buscar templates de IA para personagens.");
                }
            };
            fetchTemplates();
        }
    }, [isOpen]);

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
        setFile(null);
        setPreview(null);
        setSelectedTemplateId('');
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !selectedTemplateId) {
            toast.warn('O desenho e um template de geração são obrigatórios.');
            return;
        }
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('drawing', file);
        formData.append('aiTemplateId', selectedTemplateId); // Envia o ID do Template de IA

        try {
            // Este serviço no backend precisa ser ajustado para receber aiTemplateId
            await adminCharactersService.createOfficialCharacter(formData);

            toast.success('Geração iniciada! O personagem aparecerá na lista em breve.');
            handleClose();
            onSuccess();
        } catch (error) {
            toast.error(`Falha ao iniciar geração: ${error.message}`);
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
            contentLabel="Gerar Personagem com IA"
        >
            <h2 className={styles.modalTitle}>Gerar Personagem com IA</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                 <div className={styles.formGroup}>
                    <label htmlFor="drawingFile">Arquivo do Desenho Base</label>
                    <input id="drawingFile" type="file" onChange={handleFileChange} accept="image/*" required style={{ display: 'none' }}/>
                     <label htmlFor="drawingFile" className={styles.fileInputLabel}>
                        {preview ? <Image src={preview} alt="Pré-visualização" width={100} height={100} /> : <FaImage />}
                        <span>{file ? file.name : 'Clique para selecionar o desenho'}</span>
                    </label>
                 </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="templateSelect">Template de Geração (Roteiro + Estilo)</label>
                    <select id="templateSelect" value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)} required>
                        <option value="" disabled>Selecione um template...</option>
                        {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <small className={styles.helperText}>Cada template já possui um estilo (Element) associado.</small>
                 </div>
                <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelButton} onClick={handleClose}>Cancelar</button>
                    <button type="submit" className={styles.confirmButton} disabled={isSubmitting}>
                        {isSubmitting ? <FaSpinner className={styles.spinner}/> : <FaMagic/>}
                        {isSubmitting ? 'Iniciando...' : 'Gerar Personagem'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default GenerateCharacterModal;