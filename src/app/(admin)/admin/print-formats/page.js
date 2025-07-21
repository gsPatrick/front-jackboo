'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaRulerCombined } from 'react-icons/fa';
import { adminTaxonomiesService } from '@/services/api';

// --- Componente Modal para Criar/Editar ---
const PrintFormatModal = ({ format, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: format ? format.name : '',
        coverWidth: format ? format.coverWidth : '',
        coverHeight: format ? format.coverHeight : '',
        pageWidth: format ? format.pageWidth : '',
        pageHeight: format ? format.pageHeight : '',
        margin: format ? format.margin : '1.5',
        isActive: format ? format.isActive : true,
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Validação simples
        if (!formData.name || !formData.coverWidth || !formData.coverHeight || !formData.pageWidth || !formData.pageHeight || !formData.margin) {
            setError('Todos os campos são obrigatórios.');
            return;
        }
        onSave(formData, format ? format.id : null);
    };

    return (
        <motion.div className={styles.modalBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modalContent} initial={{ y: -50 }} animate={{ y: 0 }} exit={{ y: -50 }}>
                <button onClick={onClose} className={styles.closeButton}><FaTimes /></button>
                <h2>{format ? 'Editar' : 'Novo'} Formato de Impressão</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Nome do Formato</label>
                        <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Ex: Capa Dura A4" required />
                    </div>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>Largura da Capa (cm)</label>
                            <input name="coverWidth" type="number" step="0.1" value={formData.coverWidth} onChange={handleChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Altura da Capa (cm)</label>
                            <input name="coverHeight" type="number" step="0.1" value={formData.coverHeight} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>Largura da Página (cm)</label>
                            <input name="pageWidth" type="number" step="0.1" value={formData.pageWidth} onChange={handleChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Altura da Página (cm)</label>
                            <input name="pageHeight" type="number" step="0.1" value={formData.pageHeight} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Margem (cm)</label>
                        <input name="margin" type="number" step="0.1" value={formData.margin} onChange={handleChange} required />
                    </div>
                    <div className={styles.checkboxGroup}>
                        <input name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} id="isActiveCheckbox" />
                        <label htmlFor="isActiveCheckbox">Ativo (visível para criação de livros)</label>
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <button type="submit" className={styles.saveButton}>{format ? 'Salvar Alterações' : 'Criar Formato'}</button>
                </form>
            </motion.div>
        </motion.div>
    );
};


// --- Componente Principal da Página ---
export default function ManagePrintFormatsPage() {
    const [formats, setFormats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFormat, setEditingFormat] = useState(null);

    const fetchFormats = async () => {
        try {
            setIsLoading(true);
            const data = await adminTaxonomiesService.listPrintFormats();
            setFormats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFormats();
    }, []);

    const handleOpenModal = (format = null) => {
        setEditingFormat(format);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingFormat(null);
    };

    const handleSaveFormat = async (formData, formatId) => {
        try {
            if (formatId) {
                await adminTaxonomiesService.updatePrintFormat(formatId, formData);
            } else {
                await adminTaxonomiesService.createPrintFormat(formData);
            }
            fetchFormats();
            handleCloseModal();
        } catch (err) {
            alert(`Erro ao salvar formato: ${err.message}`);
        }
    };
    
    const handleDeleteFormat = async (formatId) => {
        if (window.confirm('Tem certeza que deseja deletar este formato? Esta ação só é possível se nenhum livro o estiver utilizando.')) {
            try {
                await adminTaxonomiesService.deletePrintFormat(formatId);
                fetchFormats();
            } catch (err) {
                alert(`Erro ao deletar formato: ${err.message}`);
            }
        }
    };

    if (isLoading) return <p>Carregando formatos...</p>;
    if (error) return <p className={styles.errorMessage}>Erro: {error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Gerenciar Formatos de Impressão</h1>
                <button className={styles.addButton} onClick={() => handleOpenModal()}>
                    <FaPlus /> Adicionar Formato
                </button>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Dimensões da Capa</th>
                        <th>Dimensões da Página</th>
                        <th>Margem</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {formats.length === 0 ? (
                        <tr>
                            <td colSpan="6">Nenhum formato encontrado. Clique em "Adicionar Formato" para começar.</td>
                        </tr>
                    ) : (
                        formats.map(format => (
                            <tr key={format.id}>
                                <td>{format.name}</td>
                                <td>{format.coverWidth}cm x {format.coverHeight}cm</td>
                                <td>{format.pageWidth}cm x {format.pageHeight}cm</td>
                                <td>{format.margin}cm</td>
                                <td>
                                    <span className={format.isActive ? styles.statusActive : styles.statusInactive}>
                                        {format.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td className={styles.actionsCell}>
                                    <button onClick={() => handleOpenModal(format)}><FaEdit /></button>
                                    <button onClick={() => handleDeleteFormat(format.id)} className={styles.deleteButton}><FaTrash /></button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <AnimatePresence>
                {isModalOpen && (
                    <PrintFormatModal
                        format={editingFormat}
                        onClose={handleCloseModal}
                        onSave={handleSaveFormat}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}