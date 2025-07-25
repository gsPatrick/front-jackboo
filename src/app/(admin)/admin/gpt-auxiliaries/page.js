// /app/(admin)/admin/gpt-auxiliaries/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaCommentDots } from 'react-icons/fa';
import { adminAISettingsService } from '@/services/api';
import styles from './GptAuxiliaries.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GptAuxiliaryModal from './_components/GptAuxiliaryModal';

const GptAuxiliariesPage = () => {
    const [auxiliaries, setAuxiliaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAuxiliary, setSelectedAuxiliary] = useState(null);

    const fetchAuxiliaries = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await adminAISettingsService.listSettings();
            setAuxiliaries(data);
        } catch (error) {
            toast.error(`Erro ao buscar auxiliares: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAuxiliaries();
    }, [fetchAuxiliaries]);

    const handleOpenModal = (auxiliary = null) => {
        setSelectedAuxiliary(auxiliary);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedAuxiliary(null);
        setIsModalOpen(false);
    };

    const handleDelete = async (type) => {
        if (window.confirm(`Tem certeza que deseja deletar o auxiliar "${type}"?`)) {
            try {
                await adminAISettingsService.deleteSetting(type);
                toast.success('Auxiliar deletado com sucesso!');
                fetchAuxiliaries();
            } catch (error) {
                toast.error(`Falha ao deletar: ${error.message}`);
            }
        }
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <ToastContainer position="bottom-right" theme="colored" />
            <div className={styles.header}>
                <h1 className={styles.title}>GPT Auxiliares (Roteiristas)</h1>
                <button className={styles.createButton} onClick={() => handleOpenModal()}>
                    <FaPlus /> Criar Novo Auxiliar
                </button>
            </div>
            <p className={styles.subtitle}>
                Crie e gerencie os prompts de texto que instruem a IA sobre o que gerar. Eles atuam como "roteiristas" para os "artistas" (Elements).
            </p>
            <div className={styles.grid}>
                {isLoading ? <p>Carregando...</p> : auxiliaries.map(aux => (
                    <div key={aux.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <FaCommentDots />
                            <h3>{aux.name}</h3>
                        </div>
                        <p className={styles.cardType}>Chave: {aux.type}</p>
                        <p className={styles.cardPrompt}>{aux.basePromptText}</p>
                        <div className={styles.cardActions}>
                            <button onClick={() => handleOpenModal(aux)}><FaEdit/> Editar</button>
                            <button onClick={() => handleDelete(aux.type)} className={styles.deleteButton}><FaTrash/> Deletar</button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                 <GptAuxiliaryModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSuccess={() => {
                        fetchAuxiliaries();
                        handleCloseModal();
                    }}
                    existingAuxiliary={selectedAuxiliary}
                />
            )}
        </motion.div>
    );
};

export default GptAuxiliariesPage;