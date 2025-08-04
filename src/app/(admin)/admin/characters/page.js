// src/app/(admin)/admin/characters/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaPlus, FaTrash, FaPencilAlt, FaMagic } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { adminCharactersService } from '@/services/api';
// ✅ CORREÇÃO: Importa CreateOfficialCharacterModal (que é o antigo UploadCharacterModal)
import CreateOfficialCharacterModal from './_components/CreateOfficialCharacterModal'; 
// ✅ CORREÇÃO: Importa GenerateOfficialCharacterModal (que é o antigo GenerateCharacterModal)
import GenerateOfficialCharacterModal from './_components/GenerateOfficialCharacterModal'; 

import styles from './page.module.css';

// ✅ CORREÇÃO: Adicionando a URL base da API
const API_BASE_URL = 'https://geral-jackboo.r954jc.easypanel.host';

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } };

export default function OfficialCharactersPage() {
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // ✅ ATUALIZADO: Nomes dos estados dos modais para refletir os componentes (já estava certo, só reforçando)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // Modal para upload direto
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false); // Modal para gerar com IA

    const refreshCharacters = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await adminCharactersService.listCharacters();
            setCharacters(response.characters || []);
        } catch (error) {
            toast.error(`Falha ao buscar personagens: ${error.message}`);
            setCharacters([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshCharacters();
    }, [refreshCharacters]);

    const handleDelete = async (charId) => {
        if (window.confirm("Tem certeza que deseja deletar este personagem? Esta ação não pode ser desfeita.")) {
            try {
                await adminCharactersService.deleteOfficialCharacter(charId);
                toast.success("Personagem deletado com sucesso!");
                refreshCharacters();
            } catch (error) {
                toast.error(`Falha ao deletar: ${error.message}`);
            }
        }
    };

    // ✅ CORREÇÃO: Função para construir a URL completa
    const getFullImageUrl = (path) => {
        if (!path) return '/images/character-placeholder.png'; // Fallback
        if (path.startsWith('http')) return path; // Se já for uma URL completa
        return `${API_BASE_URL}${path}`;
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ToastContainer position="bottom-right" theme="colored" />
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Personagens Oficiais</h1>
                    <p className={styles.subtitle}>Gerencie os protagonistas das histórias JackBoo.</p>
                </div>
                <div className={styles.buttonGroup}>
                     <button className={styles.addButton} onClick={() => setIsGenerateModalOpen(true)}>
                        <FaMagic /> Gerar com IA
                    </button>
                    <button className={styles.secondaryButton} onClick={() => setIsUploadModalOpen(true)}> {/* ✅ ATUALIZADO: Chama setIsUploadModalOpen */}
                        <FaPlus /> Upload Direto
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Carregando personagens...</div>
            ) : (
                <motion.div className={styles.grid} variants={containerVariants} initial="hidden" animate="visible">
                    {characters.map(char => (
                        <motion.div key={char.id} className={styles.card} variants={itemVariants}>
                            <div className={styles.imageWrapper}>
                                <Image 
                                    // ✅ CORREÇÃO: Usando a função para obter a URL completa
                                    src={getFullImageUrl(char.generatedCharacterUrl || char.originalDrawingUrl)} 
                                    alt={char.name} 
                                    width={150} 
                                    height={150} 
                                    className={styles.avatar}
                                    unoptimized // Adicionado para evitar problemas com otimização do Next.js para URLs externas
                                />
                            </div>
                            <h3 className={styles.name}>{char.name}</h3>
                            <p className={styles.description}>{char.description || 'Sem descrição.'}</p>
                            <div className={styles.actions}>
                                <button className={styles.actionButton} title="Editar"><FaPencilAlt /></button>
                                <button onClick={() => handleDelete(char.id)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Deletar"><FaTrash /></button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
            
            {!isLoading && characters.length === 0 && (
                <div className={styles.emptyState}>Nenhum personagem encontrado. Crie o primeiro!</div>
            )}

            {/* ✅ ATUALIZADO: Renderiza CreateOfficialCharacterModal (que é o upload direto) */}
            <CreateOfficialCharacterModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSuccess={() => {
                    setIsUploadModalOpen(false);
                    refreshCharacters();
                }}
            />

            {/* ✅ ATUALIZADO: Renderiza GenerateOfficialCharacterModal (que é a geração por IA) */}
            <GenerateOfficialCharacterModal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                onSuccess={() => {
                    setIsGenerateModalOpen(false);
                    refreshCharacters();
                }}
            />
        </motion.div>
    );
}