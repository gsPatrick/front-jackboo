// src/app/admin/ai-settings/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import { FaPlus, FaEdit, FaTrash, FaImages } from 'react-icons/fa';
import AISettingFormModal from '@/components/Admin/AISettingFormModal/AISettingFormModal';
import { adminAISettingsService } from '@/services/api'; 

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function AiSettingsPage() {
    const [settings, setSettings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSetting, setCurrentSetting] = useState(null);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await adminAISettingsService.listSettings();
            setSettings(data); 
        } catch (err) {
            console.error("Erro ao buscar configurações de IA:", err);
            setError("Falha ao carregar configurações: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleCreate = () => {
        setCurrentSetting(null); 
        setIsModalOpen(true);
    };

    const handleEdit = (setting) => {
        setCurrentSetting(setting);
        setIsModalOpen(true);
    };

    const handleDelete = async (typeToDelete) => {
        if (window.confirm(`Tem certeza que deseja deletar a configuração "${typeToDelete}"? Esta ação não pode ser desfeita.`)) {
            try {
                await adminAISettingsService.deleteSetting(typeToDelete);
                fetchSettings(); 
                alert("Configuração deletada com sucesso!");
            } catch (err) {
                console.error("Erro ao deletar configuração:", err);
                alert("Falha ao deletar configuração: " + err.message);
            }
        }
    };

    const handleSave = async (type, settingData) => {
        try {
            await adminAISettingsService.createOrUpdateSetting(type, settingData);
            fetchSettings(); 
            alert("Configuração salva com sucesso!");
        } catch (err) {
            console.error("Erro ao salvar configuração:", err);
            alert("Falha ao salvar configuração: " + err.message);
        } finally {
            setIsModalOpen(false); 
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>Configurações de IA</h1>
                    <motion.button
                        className={styles.createButton}
                        onClick={handleCreate}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaPlus /> Criar Nova
                    </motion.button>
                </div>

                {isLoading && <p className={styles.loadingMessage}>Carregando configurações...</p>}
                {error && <p className={styles.errorMessage}>{error}</p>}
                {!isLoading && !error && settings.length === 0 && (
                    <p className={styles.emptyMessage}>Nenhuma configuração de IA encontrada. Crie uma nova!</p>
                )}

                {!isLoading && !error && settings.length > 0 && (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nome</th> {/* Agora exibe o nome amigável */}
                                    <th>Tipo</th> {/* Exibe o identificador técnico */}
                                    <th>Prompt Base</th>
                                    <th>Modelo (Tamanho)</th>
                                    <th>Estilo / Qualidade</th>
                                    <th>Imagens Ref.</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <motion.tbody
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <AnimatePresence>
                                    {settings.map(setting => (
                                        <motion.tr key={setting.id || setting.type} variants={itemVariants} exit={{ opacity: 0, x: -50 }}>
                                            <td>{setting.name}</td> {/* Exibe o nome */}
                                            <td>{setting.type}</td> {/* Exibe o tipo */}
                                            <td>{setting.basePromptText.substring(0, 70)}{setting.basePromptText.length > 70 ? '...' : ''}</td>
                                            <td>{setting.model} ({setting.size})</td>
                                            <td>{setting.style} / {setting.quality}</td>
                                            <td className={styles.imageCountCell}>
                                                <FaImages />
                                                <span>{setting.baseAssets ? setting.baseAssets.length : 0}</span>
                                            </td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${setting.isActive ? styles.active : styles.inactive}`}>
                                                    {setting.isActive ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className={styles.actionsCell}>
                                                <motion.button className={styles.actionButton} onClick={() => handleEdit(setting)} whileHover={{ scale: 1.1 }} title="Editar">
                                                    <FaEdit />
                                                </motion.button>
                                                <motion.button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(setting.type)} whileHover={{ scale: 1.1 }} title="Deletar">
                                                    <FaTrash />
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </motion.tbody>
                        </table>
                    </div>
                )}
            </div>

            <AISettingFormModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                settingData={currentSetting}
            />
        </main>
    );
}