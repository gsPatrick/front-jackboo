// /src/components/Admin/BookPreview/BookPreview.js
'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './BookPreview.module.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const variants = {
    enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://geral-jackboo.r954jc.easypanel.host';

const BookPreview = ({ book }) => {
    const [[page, direction], setPage] = useState([0, 0]);

    const pages = useMemo(() => {
        if (!book || !book.variations || book.variations.length === 0) {
            return [{ type: 'info', message: 'Dados do livro incompletos.' }]; 
        }
        
        const variation = book.variations[0];
        const coverUrl = variation.coverUrl ? `${APP_URL}${variation.coverUrl}` : '/images/placeholder-cover.png';
        
        const contentPages = (variation.pages || []).map(p => ({
            type: p.pageType === 'illustration' || p.pageType === 'coloring_page' ? 'image' : 'text',
            src: p.imageUrl ? `${APP_URL}${p.imageUrl}` : null,
            content: p.content || null,
            status: p.status,
            errorDetails: p.errorDetails || null
        }));

        return [
            { type: 'image', src: coverUrl, status: 'completed' },
            ...contentPages,
            { type: 'cta' }
        ];
    }, [book]);

    const paginate = (newDirection) => {
      setPage([(page + newDirection + pages.length) % pages.length, newDirection]);
    };

    const currentPageData = pages[page];

    return (
        <motion.div 
            className={styles.wrapper}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h2 className={styles.title}>{book.title || 'Preview do Livro'}</h2>
            <div className={styles.carousel}>
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page}
                        className={styles.pageWrapper}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {currentPageData.type === 'image' && currentPageData.status === 'completed' ? (
                            <Image src={currentPageData.src} alt={`Página ${page}`} width={600} height={600} className={styles.bookPageImage} unoptimized />
                        ) : currentPageData.type === 'text' ? (
                             <div className={styles.textPage}>
                                <p>{currentPageData.content}</p>
                            </div>
                        ) : currentPageData.type === 'cta' ? (
                            <div className={styles.ctaCard}>
                                <h3>Fim do Preview</h3>
                                <p>Este livro contém {book.variations[0].pageCount} páginas no total.</p>
                            </div>
                        ) : (
                            <div className={styles.pageFailedPlaceholder}>
                                <p>Página em processamento ou com falha.</p>
                                {currentPageData.errorDetails && <small>{currentPageData.errorDetails}</small>}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
                <button className={`${styles.navButton} ${styles.prev}`} onClick={() => paginate(-1)}><FaArrowLeft /></button>
                <button className={`${styles.navButton} ${styles.next}`} onClick={() => paginate(1)}><FaArrowRight /></button>
            </div>
            <button className={styles.actionButton}>Finalizar e Publicar Livro</button>
        </motion.div>
    );
};

export default BookPreview;