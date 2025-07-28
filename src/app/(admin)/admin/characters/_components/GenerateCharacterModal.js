// /app/(admin)/admin/characters/_components/GenerateCharacterModal.js
'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Image from 'next/image';
import { adminCharactersService, adminLeonardoService, adminTaxonomiesService } from '@/services/api';
import { toast } from 'react-toastify';
import styles from './Modals.module.css';
import { FaMagic, FaSpinner, FaImage } from 'react-icons/fa';

Modal.setAppElement('body');

const GenerateCharacterModal = ({ isOpen, onClose, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [elements, setElements] = useState([]);
    const [gptAuxiliaries, setGptAuxiliaries] = useState([]);
    const [selectedElement, setSelectedElement] = useState('');
    const [selectedGpt, setSelectedGpt] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const [elementsData, gptData] = await Promise.all([
                        adminLeonardoService.listElements(),
                        adminTaxonomiesService.listAiTemplates()
                    ]);
                    setElements(elementsData.filter(el => el.status === 'COMPLETE' && el.lora_focus === 'Character') || []);
                    setGptAuxiliaries(gptData.filter(g => g.type && g.type.includes('character')) || []);
                } catch (error) {
                    toast.error("Erro ao buscar dados para geração.");
                }
            };
            fetchData();
        }
    }, [isOpen]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => { setPreview(reader.result); };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleClose = () => {
        setFile(null);
        setPreview(null);
        setSelectedElement('');
        setSelectedGpt('');
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !selectedElement || !selectedGpt) {
            toast.warn('Todos os campos são obrigatórios.');
            return;
        }
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('drawing', file);
        formData.append('elementId', selectedElement);
        formData.append('descriptionTemplateType', selectedGpt);
        formData.append('drawingTemplateType', selectedGpt);

        try {
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
        <Modal isOpen={isOpen} onRequestClose={handleClose} className={styles.modal} overlayClassName={styles.overlay}>
            <h2 className={styles.modalTitle}>Gerar Personagem com IA</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                 <div className={styles.formGroup}>
                    <label>Arquivo do Desenho Base</label>
                    <input id="drawingFile" type="file" onChange={handleFileChange} accept="image/*" required style={{ display: 'none' }}/>
                     <label htmlFor="drawingFile" className={styles.fileInputLabel}>
                        {preview ? <Image src={preview} alt="Pré-visualização" width={100} height={100} /> : <FaImage />}
                        <span>{file ? file.name : 'Clique para selecionar o desenho'}</span>
                    </label>
                 </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="elementSelect">Modelo de Estilo (Artista)</label>
                    <select id="elementSelect" value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)} required>
                        <option value="" disabled>Selecione um Artista...</option>
                        {/* CORREÇÃO AQUI: O 'value' agora é o ID do Leonardo, não o nosso ID interno */}
                        {elements.map(el => <option key={el.id} value={el.leonardoElementId}>{el.name}</option>)}
                    </select>
                 </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="gptSelect">GPT Auxiliar (Roteirista)</label>
                    <select id="gptSelect" value={selectedGpt} onChange={(e) => setSelectedGpt(e.target.value)} required>
                        <option value="" disabled>Selecione um Roteirista...</option>
                        {gptAuxiliaries.map(g => <option key={g.id} value={g.type}>{g.name}</option>)}
                    </select>
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