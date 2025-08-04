'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { adminLeonardoService } from '@/services/api';
import { toast } from 'react-toastify';
import styles from './TrainElementModal.module.css';
import { FaImages, FaPencilAlt, FaArrowRight } from 'react-icons/fa';

Modal.setAppElement('body');

const TrainElementModal = ({ isOpen, onClose, onSuccess }) => {
    const [datasets, setDatasets] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        localDatasetId: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchDatasets = async () => {
                try {
                    const data = await adminLeonardoService.listDatasets();
                    setDatasets(data);
                } catch (error) {
                    toast.error("Não foi possível carregar os datasets.");
                }
            };
            fetchDatasets();
        } else {
            setFormData({ name: '', localDatasetId: '' });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, localDatasetId } = formData;
        if (!name || !localDatasetId) {
            toast.warn('Nome e Dataset de Origem são obrigatórios.');
            return;
        }
        
        setIsSubmitting(true);
        try {
            // --- INÍCIO DA MODIFICAÇÃO PARA TRATAR O NULL ---
            // Cria um novo objeto com os dados do formulário e adiciona campos padrão,
            // garantindo que 'instance_prompt' seja sempre uma string, mesmo que vazia.
            const dataToSend = {
                ...formData,
                instance_prompt: '', // Garante que instance_prompt seja sempre uma string vazia
                // Se 'description' ou 'basePrompt' fossem campos que pudessem ser nulos no frontend
                // mas são esperados como string pela API, você faria o mesmo:
                // description: formData.description || '',
                // basePromptText: formData.basePromptText || '', // Use 'basePromptText' se estiver no Código 1
                // basePrompt: formData.basePrompt || '', // Use 'basePrompt' se estiver no Código 2
            };

            await adminLeonardoService.trainElement(dataToSend); // Envia o novo objeto 'dataToSend'
            // --- FIM DA MODIFICAÇÃO ---

            toast.success('Treinamento do modelo iniciado com sucesso! O status será atualizado automaticamente.');
            onSuccess();
        } catch (error) {
            toast.error(`Falha ao iniciar treinamento: ${error.message}`);
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
            contentLabel="Criar Novo Modelo de Estilo"
        >
            <h2 className={styles.modalTitle}>Criar Novo Modelo de Estilo</h2>
            
            {/* GUIA VISUAL DO PROCESSO */}
            <div className={styles.processFlow}>
                <div className={`${styles.flowStep} ${styles.activeStep}`}>
                    <div className={styles.flowIcon}><FaImages /></div>
                    <h4 className={styles.flowTitle}>1. Treinamento Visual</h4>
                    <p className={styles.flowDescription}>Você define o estilo com um conjunto de imagens.</p>
                </div>
                <div className={styles.flowConnector}><FaArrowRight /></div>
                <div className={`${styles.flowStep} ${styles.nextStep}`}>
                    <div className={styles.flowIcon}><FaPencilAlt /></div>
                    <h4 className={styles.flowTitle}>2. Instrução por Texto</h4>
                    <p className={styles.flowDescription}>Após criar, adicione o prompt de texto no ícone de 'olho' (👁️).</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <h3 className={styles.formSectionTitle}>Etapa 1: Defina o Nome e as Imagens</h3>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Nome do Modelo</label>
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Ex: Estilo-Aquarela-Magica"/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="localDatasetId">Dataset de Origem (Imagens)</label>
                    <select id="localDatasetId" name="localDatasetId" value={formData.localDatasetId} onChange={handleChange} required>
                        <option value="" disabled>Selecione um conjunto de imagens...</option>
                        {datasets.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>

                <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isSubmitting}>Cancelar</button>
                    <button type="submit" className={styles.confirmButton} disabled={isSubmitting}>
                        {isSubmitting ? 'Iniciando...' : 'Criar e Iniciar Treinamento'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default TrainElementModal;