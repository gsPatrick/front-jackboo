// /app/(admin)/admin/leonardo/elements/_components/TrainElementModal.js
'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { adminLeonardoService, adminAIHelperService } from '@/services/api';
import { toast } from 'react-toastify';
import styles from './TrainElementModal.module.css';
import { FaBrain } from 'react-icons/fa';

Modal.setAppElement('body');

const TrainElementModal = ({ isOpen, onClose, onSuccess }) => {
    const [datasets, setDatasets] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        basePrompt: '',
        localDatasetId: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAILoading, setIsAILoading] = useState(false);

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
            // Limpa o formulário ao fechar
            setFormData({ name: '', description: '', basePrompt: '', localDatasetId: '' });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateWithAI = async (field, promptGenerator) => {
        if (!formData.name) {
            toast.warn('Por favor, preencha o nome do modelo primeiro.');
            return;
        }
        setIsAILoading(true);
        try {
            const prompt = promptGenerator(formData.name);
            const response = await adminAIHelperService.generateText(prompt);
            setFormData(prev => ({ ...prev, [field]: response.text }));
            toast.info('Texto gerado pela IA!');
        } catch (error) {
            toast.error(`Assistente de IA falhou: ${error.message}`);
        } finally {
            setIsAILoading(false);
        }
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
            // AQUI ESTÁ A MUDANÇA:
            // A função `trainElement` no serviço já deve estar retornando o elemento criado localmente
            // ou lançando um erro. Se ela retornar, consideramos sucesso e fechamos.
            await adminLeonardoService.trainElement(formData);
            
            toast.success('Treinamento do modelo iniciado com sucesso! O status será atualizado automaticamente.');
            onSuccess(); // Isso já fecha o modal e atualiza a lista de Elements.
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
            contentLabel="Treinar Novo Modelo (Element)"
        >
            <h2 className={styles.modalTitle}>Treinar Novo Modelo</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Nome do Modelo</label>
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Ex: Estilo-Aquarela-Magica"/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="localDatasetId">Dataset de Origem</label>
                    <select id="localDatasetId" name="localDatasetId" value={formData.localDatasetId} onChange={handleChange} required>
                        <option value="" disabled>Selecione um dataset...</option>
                        {datasets.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="basePrompt">Prompt Base (Opcional)</label>
                    <input id="basePrompt" name="basePrompt" type="text" value={formData.basePrompt} onChange={handleChange} placeholder="Ex: in the style of a whimsical watercolor painting"/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.labelWithHelper}>
                        Descrição
                         <button 
                            type="button" 
                            className={styles.aiHelperButton}
                            onClick={() => handleGenerateWithAI('description', (name) => `Gere uma descrição curta e informativa para um modelo de estilo do Leonardo.AI chamado "${name}".`)}
                            disabled={isAILoading || !formData.name}
                        >
                            <FaBrain /> Gerar com IA
                        </button>
                    </label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="2" placeholder="Descreva o que este modelo faz..."/>
                </div>

                <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
                    <button type="submit" className={styles.confirmButton} disabled={isSubmitting || isAILoading}>
                        {isSubmitting ? 'Iniciando...' : 'Iniciar Treinamento'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default TrainElementModal;