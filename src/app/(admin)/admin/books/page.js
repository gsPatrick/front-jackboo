'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { FaEye, FaTrash, FaPlus } from 'react-icons/fa';
import { adminBooksService } from '@/services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ManageBooksPage() {
    const [booksData, setBooksData] = useState({ books: [], totalItems: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Define a URL base diretamente aqui
    const API_BASE_URL = 'https://geral-jackboo.r954jc.easypanel.host';

    const fetchBooks = async () => {
        try {
            setIsLoading(true);
            const data = await adminBooksService.listOfficialBooks();
            setBooksData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDeleteBook = async (bookId) => {
        if (window.confirm('Tem certeza que deseja deletar este livro? Todos os seus dados e páginas serão perdidos.')) {
            try {
                await adminBooksService.deleteOfficialBook(bookId);
                fetchBooks(); // Recarrega a lista
            } catch (err) {
                alert(`Erro ao deletar livro: ${err.message}`);
            }
        }
    };

    if (isLoading) return <p className={styles.loadingMessage}>Carregando livros oficiais...</p>;
    if (error) return <p className={styles.errorMessage}>Erro: {error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Livros Oficiais</h1>
                <Link href="/admin/create-book" passHref>
                    <button className={styles.addButton}>
                        <FaPlus /> Criar Novo Livro
                    </button>
                </Link>
            </div>

            <div className={styles.booksGrid}>
                {booksData.books.length === 0 ? (
                    <p>Nenhum livro oficial encontrado.</p>
                ) : (
                    booksData.books.map(book => {
                        // Lógica para determinar a URL da capa
                        const coverUrl = book.variations[0]?.coverUrl || book.mainCharacter?.generatedCharacterUrl || '/images/placeholder.png';
                        const fullImageUrl = coverUrl.startsWith('/') ? `${API_BASE_URL}${coverUrl}` : coverUrl;

                        return (
                            <motion.div key={book.id} className={styles.bookCard} whileHover={{ y: -5 }}>
                                <div className={styles.cardImage}>
                                    {/* --- CORREÇÃO AQUI --- */}
                                    <Image
                                        src={fullImageUrl}
                                        alt={`Capa de ${book.title}`}
                                        layout="fill"
                                        objectFit="cover"
                                        unoptimized
                                    />
                                    <span className={`${styles.statusBadge} ${styles[book.status]}`}>
                                        {book.status}
                                    </span>
                                </div>
                                <div className={styles.cardContent}>
                                    <h3>{book.title}</h3>
                                    <p>
                                        Criado em: {format(new Date(book.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                    </p>
                                    <div className={styles.cardActions}>
                                        <Link href={`/admin/create-book/preview?bookId=${book.id}`} passHref>
                                            <button className={styles.viewButton}><FaEye /> Ver/Editar</button>
                                        </Link>
                                        <button onClick={() => handleDeleteBook(book.id)} className={styles.deleteButton}><FaTrash /></button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
            {/* TODO: Adicionar paginação se necessário */}
        </div>
    );
}