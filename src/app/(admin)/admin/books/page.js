// /app/(admin)/admin/books/page.js
'use client'; // <--- CORREÇÃO AQUI

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { adminBookGeneratorService, adminBooksService } from '@/services/api';
import styles from './Books.module.css';
import { FaEye, FaSync, FaExclamationTriangle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StatusBadge = ({ status }) => {
    const statusMap = {
        gerando: { text: 'Gerando', icon: <FaSpinner className={styles.spinner} />, className: 'generating' },
        privado: { text: 'Pronto (Privado)', icon: <FaCheckCircle />, className: 'success' },
        publicado: { text: 'Publicado', icon: <FaCheckCircle />, className: 'published' },
        falha_geracao: { text: 'Falha na Geração', icon: <FaExclamationTriangle />, className: 'failed' },
    };
    const currentStatus = statusMap[status] || { text: status, className: 'default' };
    return (
        <span className={`${styles.statusBadge} ${styles[currentStatus.className]}`}>
            {currentStatus.icon} {currentStatus.text}
        </span>
    );
};

const BooksListPage = () => {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        try {
            // Usando o serviço genérico que busca todos os livros
            const data = await adminBooksService.listAllBooks();
            // Supondo que a API retorne um objeto { books: [...] } ou similar
            setBooks(data.books || data || []);
        } catch (error) {
            toast.error(`Erro ao buscar livros: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <ToastContainer position="bottom-right" theme="colored" />
            <div className={styles.header}>
                <h1 className={styles.title}>Gerenciar Livros Oficiais</h1>
                <button className={styles.refreshButton} onClick={fetchBooks} disabled={isLoading}>
                    <FaSync className={isLoading ? styles.spinner : ''} />
                    Atualizar Lista
                </button>
            </div>
            <p className={styles.subtitle}>
                Visualize todos os livros do catálogo, acompanhe o status da geração e gerencie cada um deles.
            </p>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Status</th>
                            <th>Tipo</th>
                            <th>Data de Criação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Carregando livros...</td></tr>
                        ) : books.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Nenhum livro encontrado.</td></tr>
                        ) : (
                            books.map(book => (
                                <tr key={book.id}>
                                    <td className={styles.strong}>{book.title}</td>
                                    <td><StatusBadge status={book.status} /></td>
                                    <td>{book.variations?.[0]?.type || 'N/A'}</td>
                                    <td>{new Date(book.createdAt).toLocaleDateString('pt-BR')}</td>
                                    <td>
                                        <Link href={`/admin/books/${book.id}`} passHref>
                                           <div className={styles.actionButton}>
                                                <FaEye /> Detalhes
                                           </div>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default BooksListPage;