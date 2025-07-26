// src/components/Admin/BookListing/BookListing.js
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import styles from './BookListing.module.css';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const BookListing = ({ title, subtitle, books, onBookDelete, showAuthor = false }) => {
    return (
        <motion.div className={styles.container} initial="hidden" animate="visible" variants={containerVariants}>
            <div className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>{subtitle}</p>
            </div>
            
            <div className={styles.bookGrid}>
                {books.map(book => (
                    <motion.div key={book.id} className={styles.bookCard} variants={itemVariants}>
                        <div className={styles.imageWrapper}>
                            <Image src={book.imageUrl} alt={book.title} layout="fill" className={styles.bookImage} />
                            <div className={styles.typeBadge}>{book.type}</div>
                        </div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.bookTitle}>{book.title}</h3>
                            {showAuthor && book.author && (
                                <Link href={`/profile/${book.author.slug}`} className={styles.authorLink}>
                                    por {book.author.name}
                                </Link>
                            )}
                        </div>
                        <div className={styles.cardActions}>
                            <button className={styles.actionButton} title="Editar Livro"><FaPencilAlt /></button>
                            <button onClick={() => onBookDelete(book.id)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Deletar Livro"><FaTrash /></button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default BookListing;