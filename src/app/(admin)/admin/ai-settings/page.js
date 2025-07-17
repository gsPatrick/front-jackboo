// src/app/admin/ai-settings/page.js
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import { FaPlus, FaEdit, FaTrash, FaImages } from 'react-icons/fa';
import AISettingFormModal from '@/components/Admin/AISettingFormModal/AISettingFormModal';

// --- DADOS MOCKADOS ATUALIZADOS ---
const mockInitialSettings = [
    {
        id: '1',
        name: 'Geração de Personagem Principal',
        type: 'character_generation',
        model: 'dall-e-3',
        sizes: ['1024x1024'], // MODIFICADO: agora é um array
        qualities: ['standard', 'hd'], // MODIFICADO: agora é um array
        styles: ['vivid', 'cartoonish', 'soft'], // MODIFICADO: agora é um array
        basePromptText: 'Crie um personagem adorável no estilo de um livro infantil, baseado no desenho de uma criança. O personagem deve ter olhos grandes e expressivos, um corpo fofo e ser amigável. Fundo branco.',
        isActive: true,
        adminAssets: [ // NOVO: campo para imagens de referência
            { id: 'asset1', name: 'ref1.png', url: '/images/how-it-works/step1-draw.png' },
            { id: 'asset2', name: 'ref2.png', url: '/images/how-it-works/step3-character.png' },
        ],
    },
    {
        id: '2',
        name: 'Geração de Capa de Livro',
        type: 'cover_generation',
        model: 'dall-e-3',
        sizes: ['1024x1792'], // MODIFICADO
        qualities: ['hd'], // MODIFICADO
        styles: ['natural', 'cinematic'], // MODIFICADO
        basePromptText: 'Crie uma capa de livro infantil vibrante e mágica. O título do livro é [BOOK_TITLE] e o personagem principal é [CHARACTER_NAME]. O cenário é [LOCATION].',
        isActive: true,
        adminAssets: [], // NOVO
    },
    {
        id: '3',
        name: 'Geração de Página de Miolo (Inativo)',
        type: 'page_generation',
        model: 'dall-e-2',
        sizes: ['1024x1024'], // MODIFICADO
        qualities: ['standard'], // MODIFICADO
        styles: [], // MODIFICADO
        basePromptText: 'Ilustração para uma página de livro infantil. O personagem [CHARACTER_NAME] está [ACTION] no cenário [LOCATION].',
        isActive: false,
        adminAssets: [], // NOVO
    },
];

// --- VARIANTES DE ANIMAÇÃO (sem alteração) ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function AiSettingsPage() {
    const [settings, setSettings] = useState(mockInitialSettings);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSetting, setCurrentSetting] = useState(null);

    const handleCreate = () => {
        setCurrentSetting(null);
        setIsModalOpen(true);
    };

    const handleEdit = (setting) => {
        setCurrentSetting(setting);
        setIsModalOpen(true);
    };

    const handleDelete = (settingId) => {
        if (window.confirm('Tem certeza que deseja deletar esta configuração?')) {
            setSettings(settings.filter(s => s.id !== settingId));
        }
    };

    const handleSave = (settingData) => {
        if (settingData.id) {
            setSettings(settings.map(s => s.id === settingData.id ? settingData : s));
        } else {
            const newSetting = { ...settingData, id: Date.now().toString() };
            setSettings([...settings, newSetting]);
        }
        setIsModalOpen(false);
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

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Tipo</th>
                                <th>Modelo</th>
                                <th>Imagens</th> {/* NOVO */}
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
                                    <motion.tr key={setting.id} variants={itemVariants} exit={{ opacity: 0, x: -50 }}>
                                        <td>{setting.name}</td>
                                        <td>{setting.type}</td>
                                        <td>{setting.model}</td>
                                        {/* NOVO: Célula para contagem de imagens */}
                                        <td className={styles.imageCountCell}>
                                            <FaImages />
                                            <span>{setting.adminAssets.length}</span>
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
                                            <motion.button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(setting.id)} whileHover={{ scale: 1.1 }} title="Deletar">
                                                <FaTrash />
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </motion.tbody>
                    </table>
                </div>
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