// src/components/Admin/BookListing/BookListing.js
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaEye, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import styles from './BookListing.module.css';

const BookListing = ({ title, subtitle, books, onBookDelete, onStatusChange }) => {
    const router = useRouter();

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>{subtitle}</p>
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
                                <div className={styles.actions}>
                                    <button onClick={() => router.push(`/admin/books/view/${book.id}`)} className={styles.actionButton} title="Visualizar Páginas">
                                        <FaEye />
                                    </button>
                                    <button onClick={() => onBookDelete(book.id)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Deletar Livro">
                                        <FaTrash />
                                    </button>
                                    <button onClick={() => onStatusChange(book.id, book.status === 'publicado' ? 'privado' : 'publicado')} className={`${styles.actionButton} ${book.status === 'publicado' ? styles.statusPublic : styles.statusPrivate}`} title={`Tornar ${book.status === 'publicado' ? 'Privado' : 'Público'}`}>
                                        {book.status === 'publicado' ? <FaToggleOn /> : <FaToggleOff />}
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
};

export default BookListing;