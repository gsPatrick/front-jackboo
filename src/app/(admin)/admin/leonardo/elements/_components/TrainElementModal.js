// /app/(admin)/admin/leonardo/elements/_components/TrainElementModal.js
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
        lora_focus: 'Character',
        instance_prompt: '',
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
        const { name, localDatasetId, lora_focus, instance_prompt } = formData;
        if (!name || !localDatasetId || !lora_focus) {
            toast.warn('Nome, Dataset e Foco do LoRA são obrigatórios.');
            return;
        }
        if (lora_focus === 'Character' && !instance_prompt) {
            toast.warn('Para foco em "Personagem", o Prompt de Instância é obrigatório.');
            return;
        }
        
        setIsSubmitting(true);
        try {
            await adminLeonardoService.trainElement(formData);
            toast.success('Treinamento do modelo iniciado com sucesso!');
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
            contentLabel="Treinar Novo Modelo (Element)"
        >
            <h2 className={styles.modalTitle}>Treinar Novo Modelo</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Nome do Modelo</label>
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Ex: Estilo-Jackboo-Aquarela"/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="localDatasetId">Dataset de Origem</label>
                    <select id="localDatasetId" name="localDatasetId" value={formData.localDatasetId} onChange={handleChange} required>
                        <option value="" disabled>Selecione um dataset...</option>
                        {datasets.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="lora_focus">Foco do LoRA</label>
                    <select id="lora_focus" name="lora_focus" value={formData.lora_focus} onChange={handleChange}>
                        <option value="Character">Personagem</option>
                        <option value="Style">Estilo</option>
                        <option value="Environment">Ambiente</option>
                        <option value="Object">Objeto</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="instance_prompt" className={styles.labelWithHelper}>
                        Prompt de Instância
                        <button 
                            type="button" 
                            className={styles.aiHelperButton}
                            onClick={() => handleGenerateWithAI('instance_prompt', (name) => `Gere um "instance prompt" conciso e eficaz para um modelo LoRA do Leonardo.AI focado em "${formData.lora_focus}" e chamado "${name}".`)}
                            disabled={isAILoading}
                        >
                            <FaBrain /> Gerar com IA
                        </button>
                    </label>
                    <input id="instance_prompt" name="instance_prompt" type="text" value={formData.instance_prompt} onChange={handleChange} placeholder="Ex: no estilo de xyz-style"/>
                    <small className={styles.helperText}>Palavra-chave para ativar o modelo. Obrigatório se o foco for "Personagem".</small>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.labelWithHelper}>
                        Descrição
                         <button 
                            type="button" 
                            className={styles.aiHelperButton}
                            onClick={() => handleGenerateWithAI('description', (name) => `Gere uma descrição curta e informativa para um modelo LoRA chamado "${name}".`)}
                            disabled={isAILoading}
                        >
                            <FaBrain /> Gerar com IA
                        </button>
                    </label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Descreva o que este modelo faz..."/>
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