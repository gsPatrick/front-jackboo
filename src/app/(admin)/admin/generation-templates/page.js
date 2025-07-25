'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { adminLeonardoService, adminAISettingsService } from '@/services/api';
import styles from './GenerationTemplates.module.css';
import { FaPaintBrush, FaLink, FaUnlink, FaCubes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssociationModal from './_components/AssociationModal';

const GenerationTemplatesPage = () => {
    const [elements, setElements] = useState([]);
    const [gptAuxiliaries, setGptAuxiliaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedElement, setSelectedElement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [elementsData, gptData] = await Promise.all([
                adminLeonardoService.listElements(),
                adminAISettingsService.listSettings()
            ]);
            setElements(elementsData.filter(el => el.status === 'COMPLETE'));
            setGptAuxiliaries(gptData);
        } catch (error) {
            toast.error(`Erro ao carregar dados: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (element) => {
        setSelectedElement(element);
        setIsModalOpen(true);
    };
    
    // Encontra o GPT Auxiliar que está associado a um Element
    const findAssociatedGpt = (elementId) => {
        return gptAuxiliaries.find(gpt => gpt.defaultElementId === elementId);
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <ToastContainer position="bottom-right" theme="colored" />
            <h1 className={styles.title}>Templates de Geração (Artista + Roteirista)</h1>
            <p className={styles.subtitle}>
                Esta é a área principal. Associe um "GPT Auxiliar" (roteirista) a um "Element" (artista) para criar um template de geração completo.
            </p>
            <div className={styles.grid}>
                {isLoading ? <p>Carregando...</p> : elements.map(element => {
                    const associatedGpt = findAssociatedGpt(element.leonardoElementId);
                    return (
                        <div key={element.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <FaCubes />
                                <h3>{element.name}</h3>
                            </div>
                            <p className={styles.cardDescription}>Modelo de Estilo Visual (Element)</p>
                            
                            <div className={styles.association}>
                                <div className={styles.line}></div>
                                <div className={styles.icon}><FaLink /></div>
                                <div className={styles.line}></div>
                            </div>

                            <div className={styles.gptSection}>
                                {associatedGpt ? (
                                    <div className={styles.associatedGpt}>
                                        <p><strong>Auxiliar Associado:</strong> {associatedGpt.name}</p>
                                        <small>({associatedGpt.type})</small>
                                    </div>
                                ) : (
                                    <div className={styles.noGpt}>
                                        <FaUnlink />
                                        <p>Nenhum GPT Auxiliar associado</p>
                                    </div>
                                )}
                                <button onClick={() => handleOpenModal(element)}>
                                    {associatedGpt ? 'Alterar Associação' : 'Associar GPT'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {isModalOpen && selectedElement && (
                <AssociationModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        fetchData();
                        setIsModalOpen(false);
                    }}
                    element={selectedElement}
                    gptAuxiliaries={gptAuxiliaries}
                    currentAssociation={findAssociatedGpt(selectedElement.leonardoElementId)}
                />
            )}
        </motion.div>
    );
};

export default GenerationTemplatesPage;