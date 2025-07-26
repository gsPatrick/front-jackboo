// src/app/(admin)/admin/books/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Importa o hook de roteamento
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaEye, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa'; // Importa os ícones necessários

import { adminBooksService } from '@/services/api';
import styles from './page.module.css'; // Usaremos um CSS dedicado para esta página

const API_BASE_URL = 'https://geral-jackboo.r954jc.easypanel.host';

export default function OfficialBooksPage() {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter(); // Inicializa o router

    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await adminBooksService.listAllBooks();
            // ✅ CORREÇÃO: Garante que todos os dados necessários (incluindo status) estão formatados
            const formattedBooks = (response.books || []).map(book => ({
                id: book.id,
                title: book.title,
                imageUrl: `${API_BASE_URL}${book.variations?.[0]?.coverUrl || '/images/placeholder-cover.png'}`,
                type: book.variations?.[0]?.type === 'colorir' ? 'Colorir' : 'História',
                status: book.status,
            }));
            setBooks(formattedBooks);
        } catch (error) {
            toast.error(`Erro ao buscar livros: ${error.message}`);
            setBooks([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleBookDelete = async (bookId) => {
        if (window.confirm("Tem certeza que deseja deletar este livro oficial?")) {
            try {
                await adminBooksService.deleteOfficialBook(bookId);
                toast.success("Livro deletado com sucesso!");
                fetchBooks();
            } catch (error) {
                toast.error(`Falha ao deletar: ${error.message}`);
            }
        }
    };

    // ✅ NOVA FUNÇÃO: Lida com a mudança de status diretamente da listagem
    const handleStatusChange = async (bookId, newStatus) => {
        try {
            await adminBooksService.updateOfficialBookStatus(bookId, newStatus);
            toast.success(`Livro atualizado para "${newStatus}"!`);
            fetchBooks();
        } catch (error) {
            toast.error(`Falha ao atualizar status: ${error.message}`);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Carregando livros oficiais...</div>;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ToastContainer position="bottom-right" theme="colored" />
            <div className={styles.header}>
                <h1 className={styles.title}>Livros Oficiais JackBoo</h1>
                <p className={styles.subtitle}>Gerencie os livros principais da plataforma, criados por você.</p>
            </div>

            {books.length > 0 ? (
                <div className={styles.grid}>
                    {books.map(book => (
                        <div key={book.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image src={book.imageUrl} alt={book.title} layout="fill" className={styles.image} unoptimized />
                            </div>
                            <div className={styles.content}>
                                <span className={styles.type}>{book.type}</span>
                                <h3 className={styles.bookTitle}>{book.title}</h3>
                                
                                {/* ✅ CORREÇÃO: Botões de ação adicionados */}
                                <div className={styles.actions}>
                                    <button onClick={() => router.push(`/admin/books/view/${book.id}`)} className={styles.actionButton} title="Visualizar Páginas">
                                        <FaEye />
                                    </button>
                                    <button onClick={() => handleStatusChange(book.id, book.status === 'publicado' ? 'privado' : 'publicado')} className={`${styles.actionButton} ${book.status === 'publicado' ? styles.statusPublic : styles.statusPrivate}`} title={`Tornar ${book.status === 'publicado' ? 'Privado' : 'Público'}`}>
                                        {book.status === 'publicado' ? <FaToggleOn /> : <FaToggleOff />}
                                    </button>
                                    <button onClick={() => handleBookDelete(book.id)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Deletar Livro">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>Nenhum livro encontrado.</div>
            )}
        </motion.div>
    );
}