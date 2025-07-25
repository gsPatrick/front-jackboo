// /app/(admin)/admin/ai-settings/page.js
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaLink, FaUnlink, FaInfoCircle } from 'react-icons/fa';
import { adminAISettingsService } from '@/services/api';
import styles from './AiSettings.module.css';
import TemplateFormModal from './_components/TemplateFormModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AiSettingsPage = () => {
    const [settings, setSettings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const fetchSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await adminAISettingsService.listSettings();
            setSettings(data);
        } catch (error) {
            toast.error(`Erro ao buscar templates: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleOpenModal = (template = null) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedTemplate(null);
        setIsModalOpen(false);
    };

    const handleDelete = async (type) => {
        if (window.confirm(`Tem certeza que deseja deletar o template "${type}"? Esta ação não pode ser desfeita.`)) {
            try {
                await adminAISettingsService.deleteSetting(type);
                toast.success('Template deletado com sucesso!');
                fetchSettings();
            } catch (error) {
                toast.error(`Falha ao deletar template: ${error.message}`);
            }
        }
    };
    
    // Agrupa os templates por prefixo (USER, ADMIN, etc.)
    const groupedSettings = useMemo(() => {
        return settings.reduce((acc, setting) => {
            const prefix = setting.type.split('_')[0] || 'Outros';
            if (!acc[prefix]) {
                acc[prefix] = [];
            }
            acc[prefix].push(setting);
            return acc;
        }, {});
    }, [settings]);

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <ToastContainer position="bottom-right" theme="colored" />
            <div className={styles.header}>
                <h1 className={styles.title}>Gerenciar Templates de IA</h1>
                <button className={styles.createButton} onClick={() => handleOpenModal()}>
                    <FaPlus /> Criar Novo Template
                </button>
            </div>
            <p className={styles.subtitle}>
                Configure os prompts que a IA usará para gerar conteúdo. Os tipos (ex: `USER_character_description`) são usados pelo sistema para saber qual template aplicar em cada situação.
            </p>

            {isLoading ? (
                <p>Carregando templates...</p>
            ) : Object.keys(groupedSettings).length === 0 ? (
                 <div className={styles.emptyState}>
                    <FaInfoCircle size={40} />
                    <p>Nenhum template de IA encontrado.</p>
                    <span>Clique em "Criar Novo Template" para configurar os fluxos de geração.</span>
                </div>
            ) : (
                Object.entries(groupedSettings).map(([groupName, groupSettings]) => (
                    <div key={groupName} className={styles.groupContainer}>
                        <h2 className={styles.groupTitle}>{groupName}</h2>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Tipo (Chave do Sistema)</th>
                                        <th>Helper Prompt</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupSettings.map(setting => (
                                        <tr key={setting.id}>
                                            <td className={styles.strong}>{setting.name}</td>
                                            <td className={styles.code}>{setting.type}</td>
                                            <td>
                                                {setting.helperPrompt ? (
                                                    <span className={styles.helperLink}><FaLink /> {setting.helperPrompt.name}</span>
                                                ) : (
                                                    <span className={styles.noHelper}><FaUnlink /> Nenhum</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <button className={`${styles.actionButton} ${styles.edit}`} onClick={() => handleOpenModal(setting)}>
                                                        <FaEdit />
                                                    </button>
                                                    <button className={`${styles.actionButton} ${styles.delete}`} onClick={() => handleDelete(setting.type)}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            )}

            {isModalOpen && (
                 <TemplateFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSuccess={() => {
                        fetchSettings();
                        handleCloseModal();
                    }}
                    existingTemplate={selectedTemplate}
                    allTemplates={settings}
                />
            )}
        </motion.div>
    );
};

export default AiSettingsPage;