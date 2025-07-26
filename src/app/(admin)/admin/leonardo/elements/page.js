// /app/(admin)/admin/leonardo/elements/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaSync, FaEdit } from 'react-icons/fa';
import { adminLeonardoService } from '@/services/api';
import styles from './Elements.module.css';
import TrainElementModal from './_components/TrainElementModal';
import EditElementModal from './_components/EditElementModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ CORREÇÃO: Componente movido para fora do componente principal para evitar problemas de escopo.
const StatusBadge = ({ status }) => {
    const statusMap = {
        PENDING: { text: 'Pendente', className: 'pending' },
        TRAINING: { text: 'Treinando', className: 'training' },
        COMPLETE: { text: 'Completo', className: 'complete' },
        FAILED: { text: 'Falhou', className: 'failed' },
    };
    const currentStatus = statusMap[status] || { text: status, className: 'default' };
    return (
        <span className={`${styles.statusBadge} ${styles[currentStatus.className]}`}>
            {currentStatus.text}
        </span>
    );
};

const ElementsPage = () => {
    const [elements, setElements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPolling, setIsPolling] = useState(false);
    const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedElement, setSelectedElement] = useState(null);

    const fetchElements = useCallback(async () => {
        try {
            const data = await adminLeonardoService.listElements();
            setElements(data);
        } catch (error) {
            toast.error(`Erro ao buscar Elements: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const pollElementStatus = useCallback(async (elementId) => {
        try {
            await adminLeonardoService.getElementDetails(elementId);
        } catch (error) {
            console.error(`Erro ao fazer polling do element ${elementId}:`, error.message);
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchElements();
    }, [fetchElements]);

    useEffect(() => {
        const pendingElements = elements.filter(el => ['PENDING', 'TRAINING'].includes(el.status));
        if (pendingElements.length > 0 && !isPolling) {
            setIsPolling(true);
            const intervalId = setInterval(async () => {
                console.log("Executando polling para elements pendentes...");
                const updatedData = await adminLeonardoService.listElements();
                setElements(updatedData);
                if (!updatedData.some(el => ['PENDING', 'TRAINING'].includes(el.status))) {
                    setIsPolling(false);
                    clearInterval(intervalId);
                    toast.info("Todos os treinamentos foram concluídos!");
                }
            }, 15000);

            return () => clearInterval(intervalId);
        } else if (pendingElements.length === 0) {
            setIsPolling(false);
        }
    }, [elements, isPolling]);

    const handleDelete = async (elementId) => {
        if (window.confirm('Tem certeza que deseja deletar este Element? Esta ação também o removerá do Leonardo.AI.')) {
            try {
                await adminLeonardoService.deleteElement(elementId);
                toast.success('Element deletado com sucesso!');
                fetchElements();
            } catch (error) {
                toast.error(`Falha ao deletar Element: ${error.message}`);
            }
        }
    };

    const handleOpenEditModal = (element) => {
        setSelectedElement(element);
        setIsEditModalOpen(true);
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <ToastContainer position="bottom-right" theme="colored" />
            <div className={styles.header}>
                <h1 className={styles.title}>Gerenciar Models (Elements)</h1>
                <div className={styles.headerActions}>
                    {isPolling && (
                        <span className={styles.pollingIndicator}>
                            <FaSync className={styles.syncIcon} /> Verificando status...
                        </span>
                    )}
                    <button className={styles.createButton} onClick={() => setIsTrainModalOpen(true)}>
                        <FaPlus /> Treinar Novo Modelo
                    </button>
                </div>
            </div>
            <p className={styles.subtitle}>
                Elements são seus modelos de IA personalizados (LoRAs) treinados com seus datasets.
            </p>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nome do Modelo</th>
                            <th>Status</th>
                            <th>Dataset de Origem</th>
                            <th>Prompt Base</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="5">Carregando modelos...</td></tr>
                        ) : elements.length === 0 ? (
                            <tr><td colSpan="5">Nenhum modelo treinado. Clique em "Treinar Novo Modelo".</td></tr>
                        ) : (
                            elements.map(el => (
                                <tr key={el.id}>
                                    <td>{el.name}</td>
                                    <td><StatusBadge status={el.status} /></td>
                                    <td>{el.sourceDataset?.name || 'N/A'}</td>
                                    <td className={styles.promptCell}>{el.basePromptText || '-'}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button 
                                                className={`${styles.actionButton} ${styles.edit}`}
                                                onClick={() => handleOpenEditModal(el)}
                                                title="Editar Prompt e Detalhes"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                className={`${styles.actionButton} ${styles.delete}`}
                                                onClick={() => handleDelete(el.id)}
                                                disabled={el.status === 'TRAINING'}
                                                title="Deletar Element"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <TrainElementModal
                isOpen={isTrainModalOpen}
                onClose={() => setIsTrainModalOpen(false)}
                onSuccess={() => {
                    fetchElements();
                    setIsTrainModalOpen(false);
                }}
            />
            
            {selectedElement && (
                <EditElementModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={() => {
                        fetchElements();
                        setIsEditModalOpen(false);
                    }}
                    elementData={selectedElement}
                />
            )}
        </motion.div>
    );
};

export default ElementsPage;