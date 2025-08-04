// /app/(admin)/admin/ai-settings/page.js
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaLink, FaUnlink, FaInfoCircle } from 'react-icons/fa';
import { adminAISettingsService, adminLeonardoService } from '@/services/api';
import styles from './AiSettings.module.css';
import TemplateFormModal from './_components/TemplateFormModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AiSettingsPage = () => {
    const [settings, setSettings] = useState([]);
    const [elements, setElements] = useState([]); // Estado para armazenar os LeonardoElements
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const fetchSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            const [settingsData, elementsData] = await Promise.all([
                adminAISettingsService.listSettings(),
                adminLeonardoService.listElements()
            ]);
            setSettings(settingsData);
            setElements(elementsData); // Armazena os elements
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

    const handleDelete = async (purpose) => {
        if (window.confirm(`Tem certeza que deseja deletar o template "${purpose}"? Esta ação não pode ser desfeita.`)) {
            try {
                await adminAISettingsService.deleteSetting(purpose);
                toast.success('Template deletado com sucesso!');
                fetchSettings();
            } catch (error) {
                toast.error(`Falha ao deletar template: ${error.message}`);
            }
        }
    };
    
    // Agrupa os templates por prefixo (USER, BOOK, etc.)
    const groupedSettings = useMemo(() => {
        return settings.reduce((acc, setting) => {
            const prefix = setting.purpose.startsWith('BOOK_') ? 'BOOK' : setting.purpose.split('_')[0];
            if (!acc[prefix]) {
                acc[prefix] = [];
            }
            acc[prefix].push(setting);
            return acc;
        }, {});
    }, [settings]);

    // Função auxiliar para encontrar o nome do Element pelo ID
    const getElementName = useCallback((elementId) => {
        const element = elements.find(el => el.leonardoElementId === elementId);
        return element ? element.name : 'Elemento Desconhecido';
    }, [elements]);

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
                Configure os prompts que a IA usará para gerar conteúdo. Os tipos (ex: `USER_CHARACTER_DRAWING`) são usados pelo sistema para saber qual template aplicar em cada situação.
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
                                        <th>Elemento Principal</th>
                                        <th>Elemento Capa</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupSettings.map(setting => (
                                        <tr key={setting.id}>
                                            <td className={styles.strong}>{setting.name}</td>
                                            <td className={styles.code}>{setting.purpose}</td>
                                            <td>
                                                {setting.defaultElementId ? (
                                                    <span className={styles.helperLink}><FaLink /> {getElementName(setting.defaultElementId)}</span>
                                                ) : (
                                                    <span className={styles.noHelper}><FaUnlink /> Nenhum</span>
                                                )}
                                            </td>
                                            <td>
                                                {setting.coverElementId ? (
                                                    <span className={styles.helperLink}><FaLink /> {getElementName(setting.coverElementId)}</span>
                                                ) : (
                                                    <span className={styles.noHelper}><FaUnlink /> Nenhum</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <button className={`${styles.actionButton} ${styles.edit}`} onClick={() => handleOpenModal(setting)}>
                                                        <FaEdit />
                                                    </button>
                                                    <button className={`${styles.actionButton} ${styles.delete}`} onClick={() => handleDelete(setting.purpose)}>
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
                />
            )}
        </motion.div>
    );
};

export default AiSettingsPage;