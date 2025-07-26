// src/app/books/preview/[bookId]/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { contentService } from '@/services/api';
import styles from './page.module.css';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaBook } from 'react-icons/fa';

const BookPreviewPage = () => {
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [pollingIntervalId, setPollingIntervalId] = useState(null);
    const params = useParams();
    const router = useRouter();
    const { bookId } = params;

    const stopPolling = useCallback(() => {
        if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
            setPollingIntervalId(null);
        }
    }, [pollingIntervalId]);

    const pollBookStatus = useCallback(async () => {
        if (!bookId) return;
        console.log(`[Preview Page] Buscando status para o livro ID: ${bookId}...`);
        try {
            const data = await contentService.getBookStatus(bookId);
            setBook(data);
            // Se o livro estiver completo ou falhou, paramos de buscar.
            if (data.status === 'privado' || data.status === 'falha_geracao') {
                console.log(`[Preview Page] Geração finalizada com status: ${data.status}. Parando o polling.`);
                stopPolling();
            }
        } catch (err) {
            console.error(`[Preview Page] Erro ao buscar status:`, err);
            setError(err.message);
            stopPolling();
        }
    }, [bookId, stopPolling]);

    useEffect(() => {
        if (bookId) {
            pollBookStatus(); // Primeira chamada imediata
            const interval = setInterval(pollBookStatus, 7000); // Polling a cada 7 segundos
            setPollingIntervalId(interval);

            // Limpeza ao desmontar o componente
            return () => {
                console.log("[Preview Page] Desmontando componente, limpando intervalo.");
                clearInterval(interval);
            };
        }
    }, [bookId, pollBookStatus]);

    const renderStatusHeader = () => {
        if (error) {
             return (
                <div className={`${styles.statusHeader} ${styles.failed}`}>
                    <FaTimesCircle className={styles.icon} />
                    <span>Erro ao buscar dados do livro: {error}</span>
                </div>
            );
        }
        if (!book) return null;

        switch (book.status) {
            case 'gerando':
                return (
                    <div className={`${styles.statusHeader} ${styles.generating}`}>
                        <FaHourglassHalf className={styles.icon} />
                        <span>Seu livro está sendo criado... As páginas aparecerão abaixo em tempo real!</span>
                    </div>
                );
            case 'privado':
                return (
                    <div className={`${styles.statusHeader} ${styles.completed}`}>
                        <FaCheckCircle className={styles.icon} />
                        <span>Sua aventura está pronta!</span>
                    </div>
                );
            case 'falha_geracao':
                return (
                    <div className={`${styles.statusHeader} ${styles.failed}`}>
                        <FaTimesCircle className={styles.icon} />
                        <span>Ocorreu um erro na geração. Por favor, tente novamente mais tarde.</span>
                    </div>
                );
            default: return null;
        }
    };
    
    // Mapeia as páginas para um formato fácil de renderizar, garantindo a ordem
    const pages = book?.variations?.[0]?.pages.sort((a, b) => a.pageNumber - b.pageNumber) || [];

    return (
        <div className={styles.container}>
            <AnimatePresence>
                {renderStatusHeader()}
            </AnimatePresence>

            <h1 className={styles.bookTitle}>{book?.title || 'Carregando Título...'}</h1>

            <div className={styles.previewArea}>
                {pages.length > 0 ? (
                     pages.map(page => (
                        <motion.div
                            key={page.pageNumber}
                            className={styles.pageWrapper}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image src={page.imageUrl} alt={`Página ${page.pageNumber}`} width={500} height={500} className={styles.pageImage} unoptimized />
                            <span className={styles.pageNumber}>{page.pageNumber}</span>
                            <span className={styles.pageType}>{page.pageType.replace(/_/g, ' ')}</span>
                        </motion.div>
                    ))
                ) : (
                    <div className={styles.placeholder}>
                        <FaHourglassHalf className={styles.placeholderIcon} />
                        Aguardando a primeira página... A magia está acontecendo!
                    </div>
                )}
            </div>

            {book?.status === 'privado' && (
                <motion.div 
                    className={styles.actions}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <button className={styles.actionButton} onClick={() => router.push('/my-books')}>
                        <FaBook /> Ver na minha Biblioteca
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default BookPreviewPage;