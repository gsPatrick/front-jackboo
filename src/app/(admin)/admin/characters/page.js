// /app/(admin)/admin/characters/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { adminCharactersService } from '@/services/api';
import styles from './Characters.module.css';
import { FaPlus, FaTrash, FaSpinner, FaUpload, FaMagic, FaSync } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UploadCharacterModal from './_components/UploadCharacterModal';
import GenerateCharacterModal from './_components/GenerateCharacterModal';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://geral-jackboo.r954jc.easypanel.host';

const AdminCharactersPage = () => {
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPolling, setIsPolling] = useState(false);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

    const fetchCharacters = useCallback(async (isSilent = false) => {
        if (!isSilent) setIsLoading(true);
        try {
            // CORREÇÃO AQUI: Usando o nome da função que está no api.js
            const data = await adminCharactersService.listCharacters();
            setCharacters(data.characters || []);
        } catch (error) {
            if (!isSilent) toast.error(`Erro ao buscar personagens: ${error.message}`);
            console.error("Erro ao buscar personagens:", error);
        } finally {
            if (!isSilent) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCharacters();
    }, [fetchCharacters]);

    useEffect(() => {
        const charactersBeingGenerated = characters.some(c => !c.generatedCharacterUrl || c.name.includes('Gerando'));
        if (charactersBeingGenerated && !isPolling) {
            setIsPolling(true);
            const intervalId = setInterval(async () => {
                console.log("Polling for character status...");
                await fetchCharacters(true);
            }, 10000); // Poll a cada 10 segundos
            return () => {
                clearInterval(intervalId);
                setIsPolling(false);
            };
        } else if (!charactersBeingGenerated && isPolling) {
            setIsPolling(false);
        }
    }, [characters, fetchCharacters, isPolling]);

    const handleDelete = async (id) => {
        if(window.confirm('Tem certeza que quer deletar este personagem?')) {
            try {
                // CORREÇÃO AQUI: Usando o nome da função que está no api.js
                await adminCharactersService.deleteOfficialCharacter(id);
                toast.success('Personagem deletado.');
                fetchCharacters();
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
            <ToastContainer position="bottom-right" theme="colored" autoClose={3000} />
            <div className={styles.header}>
                <h1 className={styles.title}>Gerenciar Personagens Oficiais</h1>
                <div className={styles.headerActions}>
                     {isPolling && (
                        <span className={styles.pollingIndicator}>
                            <FaSync className={styles.spinner} /> Verificando...
                        </span>
                    )}
                    <button className={styles.actionButton} onClick={() => setIsUploadModalOpen(true)}>
                        <FaUpload /> Adicionar via Upload
                    </button>
                    <button className={styles.createButton} onClick={() => setIsGenerateModalOpen(true)}>
                        <FaMagic /> Gerar com IA
                    </button>
                </div>
            </div>
            
            <h2 className={styles.listTitle}>Personagens Existentes</h2>
            {isLoading && characters.length === 0 ? <p>Carregando...</p> : (
                <div className={styles.grid}>
                    {characters.map(char => (
                        <div key={char.id} className={styles.charCard}>
                            <div className={styles.imageContainer}>
                                {char.generatedCharacterUrl ? (
                                    <Image src={`${APP_URL}${char.generatedCharacterUrl}`} alt={char.name} width={200} height={200} />
                                ) : (
                                    <div className={styles.placeholder}>
                                        <FaSpinner className={styles.spinner} />
                                        <span>Gerando...</span>
                                    </div>
                                )}
                            </div>
                            <div className={styles.cardContent}>
                                <h3>{char.name}</h3>
                                <div className={styles.actions}>
                                    <button className={styles.deleteButton} onClick={() => handleDelete(char.id)}><FaTrash/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <UploadCharacterModal 
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSuccess={() => {
                    setIsUploadModalOpen(false);
                    setTimeout(() => fetchCharacters(), 1000);
                }}
            />
            
            <GenerateCharacterModal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                onSuccess={() => {
                    setIsGenerateModalOpen(false);
                    setTimeout(() => fetchCharacters(), 1000);
                }}
            />

        </motion.div>
    );
};

export default AdminCharactersPage;