// src/components/Admin/BookListing/BookListing.js
'use client';

import React, { useState } from 'react'; // Importar useState
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './BookListing.module.css';
import { FaEye, FaTrash, FaUser } from 'react-icons/fa';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

// MODIFICADO: O componente agora recebe a lista completa de livros e gerencia o filtro internamente
export default function BookListing({ title, subtitle, books, showAuthor = false, onBookDelete }) {
    const [activeTab, setActiveTab] = useState('Todos'); // Estado para a aba ativa

    const filteredBooks = books.filter(book => {
        if (activeTab === 'Todos') return true;
        return book.type === activeTab;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>

            {/* NOVO: Abas de Filtragem */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'Todos' ? styles.active : ''}`}
                    onClick={() => setActiveTab('Todos')}
                >
                    Todos
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'História' ? styles.active : ''}`}
                    onClick={() => setActiveTab('História')}
                >
                    Livros de História
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'Colorir' ? styles.active : ''}`}
                    onClick={() => setActiveTab('Colorir')}
                >
                    Livros de Colorir
                </button>
            </div>

            <motion.div className={styles.grid} variants={containerVariants} initial="hidden" animate="visible">
                {filteredBooks.map(book => (
                    <motion.div key={book.id} className={styles.bookCard} variants={itemVariants}>
                        <div className={styles.imageWrapper}>
                            <Image src={book.imageUrl} alt={book.title} width={150} height={180} className={styles.bookImage} />
                            <span className={styles.typeBadge}>{book.type}</span>
                        </div>
                        <div className={styles.bookInfo}>
                            <h3 className={styles.bookTitle}>{book.title}</h3>
                            {showAuthor && book.author && (
                                <Link href={`/profile/${book.author.slug}`} className={styles.authorLink}>
                                    <FaUser />
                                    <span>{book.author.name}</span>
                                </Link>
                            )}
                            <div className={styles.actions}>
                                <Link href={`/book-details/${book.id}`} passHref>
                                    <motion.button className={`${styles.actionButton} ${styles.viewButton}`} title="Ver Detalhes do Livro" whileHover={{scale: 1.1}}><FaEye /></motion.button>
                                </Link>
                                <motion.button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => onBookDelete(book.id)} title="Deletar Livro" whileHover={{scale: 1.1}}><FaTrash /></motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
             {filteredBooks.length === 0 && (
                <p className={styles.emptyMessage}>Nenhum livro encontrado para este filtro.</p>
            )}
        </motion.div>
    );
}