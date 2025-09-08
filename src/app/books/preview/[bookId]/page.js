// src/app/books/preview/[bookId]/page.js
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { contentService } from '@/services/api';
import styles from './page.module.css';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaBook, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const APP_URL = 'https://geral-jackboo.r954jc.easypanel.host';

// Variantes de animação para o carrossel
const variants = {
    enter: (direction) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0
    })
};

const BookPreviewPage = () => {
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [pollingIntervalId, setPollingIntervalId] = useState(null);
    
    // Estado do Carrossel: [índice da página, direção da animação]
    const [[pageIndex, direction], setPage] = useState([0, 0]);

    const params = useParams();
    const router = useRouter();
    const { bookId } = params;

    // Lógica de polling e busca de dados (sem alterações)
    const stopPolling = useCallback(() => {
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
            setPollingIntervalId(null);
        }
    }, [pollingIntervalId]);

    const pollBookStatus = useCallback(async () => {
        if (!bookId) return;
        try {
            const data = await contentService.getBookStatus(bookId);
            setBook(data);

            const pages = data.variations?.[0]?.pages || [];
            const totalPages = data.variations?.[0]?.pageCount || 0;
            const processedPages = pages.filter(p => p.status !== 'generating').length;

            if (data.status === 'falha_geracao' || (data.status === 'publicado' && processedPages >= totalPages && totalPages > 0)) {
                stopPolling();
            }
        } catch (err) {
            setError(err.message);
            stopPolling();
        }
    }, [bookId, stopPolling]);

    useEffect(() => {
        if (bookId) {
            pollBookStatus();
            const interval = setInterval(pollBookStatus, 7000);
            setPollingIntervalId(interval);
            return () => clearInterval(interval);
        }
    }, [bookId]); // Removido pollBookStatus para evitar recriação

    // Prepara as páginas para o carrossel, garantindo a ordem
    const pages = useMemo(() => {
        if (!book?.variations?.[0]?.pages) return [];
        return book.variations[0].pages.sort((a, b) => a.pageNumber - b.pageNumber);
    }, [book]);

    // Função para navegar no carrossel
    const paginate = (newDirection) => {
        setPage([pageIndex + newDirection, newDirection]);
    };

    const currentPageData = pages[pageIndex];
    const isGenerationFinished = book?.status === 'publicado' || book?.status === 'falha_geracao';

    // Lógica do cabeçalho de status (sem alterações)
    const renderStatusHeader = () => {
        // ... (código do renderStatusHeader permanece o mesmo da versão anterior)
        if (error) return <div className={`${styles.statusHeader} ${styles.failed}`}><FaTimesCircle className={styles.icon} /><span>Erro: {error}</span></div>;
        if (!book) return null;
        const total = book.variations?.[0]?.pageCount || 0;
        const completed = pages.filter(p => p.status === 'completed').length;
        if (book.status === 'gerando') return <div className={`${styles.statusHeader} ${styles.generating}`}><FaHourglassHalf className={styles.icon} /><span>Criando... {completed} de {total} páginas prontas</span></div>;
        if (book.status === 'publicado') return <div className={`${styles.statusHeader} ${styles.completed}`}><FaCheckCircle className={styles.icon} /><span>Sua aventura está pronta!</span></div>;
        if (book.status === 'falha_geracao') return <div className={`${styles.statusHeader} ${styles.failed}`}><FaTimesCircle className={styles.icon} /><span>Ocorreu um erro na geração.</span></div>;
        return null;
    };

    return (
        <div className={styles.container}>
            <AnimatePresence>
                {renderStatusHeader()}
            </AnimatePresence>

            <h1 className={styles.bookTitle}>{book?.title || 'Carregando Título...'}</h1>

            <div className={styles.carouselWrapper}>
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={pageIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className={styles.pageContent}
                    >
                        {currentPageData && currentPageData.status === 'completed' ? (
                            <Image src={`${APP_URL}${currentPageData.imageUrl}`} alt={`Página ${currentPageData.pageNumber}`} layout="fill" objectFit="contain" className={styles.pageImage} unoptimized />
                        ) : (
                            <div className={styles.placeholder}>
                                <FaHourglassHalf className={styles.placeholderIcon} />
                                <span>Página {currentPageData?.pageNumber || pageIndex + 1} está sendo desenhada...</span>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <motion.button className={`${styles.navButton} ${styles.prev}`} onClick={() => paginate(-1)} disabled={pageIndex === 0} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <FaArrowLeft />
                </motion.button>
                <motion.button className={`${styles.navButton} ${styles.next}`} onClick={() => paginate(1)} disabled={!pages.length || pageIndex === pages.length - 1} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <FaArrowRight />
                </motion.button>
            </div>
            
            <div className={styles.pageIndicator}>
                Página {pages.length > 0 ? pageIndex + 1 : 0} de {pages.length}
            </div>

            {isGenerationFinished && !error && (
                <motion.div 
                    className={styles.actions}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <button className={styles.actionButton} onClick={() => router.push('/content/my-books')}>
                        <FaBook /> Ver na minha Biblioteca
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default BookPreviewPage;