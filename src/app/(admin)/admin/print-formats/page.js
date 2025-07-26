// src/app/(admin)/admin/print-formats/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaPencilAlt, FaRulerCombined } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { adminTaxonomiesService } from '@/services/api';
import styles from './page.module.css';
import FormatModal from './_components/FormatModal';

export default function PrintFormatsPage() {
    const [formats, setFormats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFormat, setEditingFormat] = useState(null);

    const fetchFormats = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await adminTaxonomiesService.listPrintFormats();
            setFormats(data || []);
        } catch (error) {
            toast.error(`Erro ao buscar formatos: ${error.message}`);
            setFormats([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFormats();
    }, [fetchFormats]);
    
    const handleOpenModal = (format = null) => {
        setEditingFormat(format);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingFormat(null);
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        if(window.confirm("Tem certeza que deseja deletar este formato? Esta ação não pode ser desfeita.")) {
            try {
                await adminTaxonomiesService.deletePrintFormat(id);
                toast.success("Formato deletado com sucesso!");
                fetchFormats(); // Atualiza a lista
            } catch (error) {
                toast.error(`Falha ao deletar: ${error.message}`);
            }
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ToastContainer position="bottom-right" theme="colored" />
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Formatos de Impressão</h1>
                    <p className={styles.subtitle}>Gerencie as dimensões e especificações dos livros físicos.</p>
                </div>
                <button className={styles.addButton} onClick={() => handleOpenModal(null)}>
                    <FaPlus /> Novo Formato
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nome do Formato</th>
                            <th>Tamanho da Página (cm)</th>
                            <th>Tamanho da Capa (cm)</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="4" className={styles.loadingText}>Carregando formatos...</td></tr>
                        ) : formats.length === 0 ? (
                             <tr><td colSpan="4" className={styles.loadingText}>Nenhum formato encontrado.</td></tr>
                        ) : (
                            formats.map(format => (
                                <tr key={format.id}>
                                    <td className={styles.nameCell}><FaRulerCombined /> {format.name}</td>
                                    <td>{format.pageWidth} x {format.pageHeight}</td>
                                    <td>{format.coverWidth} x {format.coverHeight}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button className={styles.actionButton} title="Editar" onClick={() => handleOpenModal(format)}>
                                                <FaPencilAlt />
                                            </button>
                                            <button onClick={() => handleDelete(format.id)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Deletar">
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

            <FormatModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchFormats}
                formatData={editingFormat}
            />
        </motion.div>
    );
}