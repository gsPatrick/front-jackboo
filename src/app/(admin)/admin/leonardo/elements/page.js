// /app/(admin)/admin/leonardo/elements/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaSync, FaEye } from 'react-icons/fa'; // Alterado FaEdit para FaEye
import { adminLeonardoService } from '@/services/api';
import styles from './Elements.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TrainElementModal from './_components/TrainElementModal';
import ElementDetailsModal from './_components/ElementDetailsModal'; // Renomeado o modal de edição

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
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Novo estado para o modal de detalhes
    const [selectedElement, setSelectedElement] = useState(null);

    const fetchElements = useCallback(async (isSilent = false) => {
        if (!isSilent) setIsLoading(true);
        try {
            const data = await adminLeonardoService.listElements();
            setElements(data);
        } catch (error) {
            if (!isSilent) toast.error(`Erro ao buscar Elements: ${error.message}`);
        } finally {
            if (!isSilent) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchElements();
    }, [fetchElements]);

    useEffect(() => {
        const pendingElements = elements.filter(el => ['PENDING', 'TRAINING'].includes(el.status));
        if (pendingElements.length > 0) {
            setIsPolling(true);
            const intervalId = setInterval(() => {
                fetchElements(true);
            }, 15000);

            return () => clearInterval(intervalId);
        } else {
            setIsPolling(false);
        }
    }, [elements, fetchElements]);

    const handleOpenDetailsModal = (element) => { // Novo handler
        setSelectedElement(element);
        setIsDetailsModalOpen(true);
    };

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

    return (
        <motion.div className={styles.container} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
                Elements são seus modelos de IA personalizados (LoRAs). Uma vez treinados, suas características principais são imutáveis. Você pode ajustar apenas o prompt base para refine os resultados.
            </p>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nome do Modelo</th>
                            <th>Status</th>
                            <th>Prompt de Base</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? ( <tr><td colSpan="4" style={{textAlign: 'center'}}>Carregando modelos...</td></tr> ) : 
                        elements.length === 0 ? ( <tr><td colSpan="4" style={{textAlign: 'center'}}>Nenhum modelo treinado. Clique em "Treinar Novo Modelo".</td></tr> ) : 
                        (
                            elements.map(el => (
                                <tr key={el.id}>
                                    <td className={styles.strong}>{el.name}</td>
                                    <td><StatusBadge status={el.status} /></td>
                                    <td className={styles.promptCell}>{el.basePrompt || '-'}</td>
                                    <td className={styles.actionsCell}>
                                        <button className={`${styles.actionButton} ${styles.view}`} onClick={() => handleOpenDetailsModal(el)}>
                                            <FaEye /> {/* Alterado para FaEye */}
                                        </button>
                                        <button className={`${styles.actionButton} ${styles.delete}`} onClick={() => handleDelete(el.id)} disabled={el.status === 'TRAINING' || el.status === 'PENDING'}> {/* Desabilitar delete durante treinamento/pendente */}
                                            <FaTrash />
                                        </button>
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
                onSuccess={() => { fetchElements(); setIsTrainModalOpen(false); }}
            />
            
            {selectedElement && (
                <ElementDetailsModal // Usando o novo nome do componente
                    isOpen={isDetailsModalOpen}
                    onClose={() => {setIsDetailsModalOpen(false); setSelectedElement(null);}}
                    onSuccess={() => { fetchElements(); setIsDetailsModalOpen(false); setSelectedElement(null); }}
                    element={selectedElement}
                />
            )}
        </motion.div>
    );
};

export default ElementsPage;