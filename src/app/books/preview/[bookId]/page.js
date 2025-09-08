// src/app/books/preview/[bookId]/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { contentService } from '@/services/api';
import styles from './page.module.css';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaBook } from 'react-icons/fa';

const APP_URL = 'https://geral-jackboo.r954jc.easypanel.host';

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
            setBook(data); // Atualiza o estado da UI com os dados mais recentes

            const pages = data.variations?.[0]?.pages || [];
            const totalPages = data.variations?.[0]?.pageCount || 0;
            const completedPages = pages.filter(p => p.status === 'completed').length;
            const failedPages = pages.filter(p => p.status === 'failed').length;
            const processedPages = completedPages + failedPages;

            // ✅ LÓGICA DE PARADA DO POLLING CORRIGIDA
            if (data.status === 'falha_geracao') {
                console.log(`[Preview Page] Falha geral na geração. Parando o polling.`);
                stopPolling();
                return;
            }

            // Para de verificar apenas se o livro está 'publicado' E todas as páginas foram processadas.
            if (data.status === 'publicado' && processedPages >= totalPages && totalPages > 0) {
                 console.log(`[Preview Page] Geração finalizada (todas as páginas processadas). Parando o polling.`);
                 stopPolling();
                 return;
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
            const interval = setInterval(pollBookStatus, 7000); // Continua verificando a cada 7 segundos
            setPollingIntervalId(interval);

            return () => {
                console.log("[Preview Page] Desmontando componente, limpando intervalo.");
                clearInterval(interval);
            };
        }
    }, [bookId]); // Removido pollBookStatus das dependências para evitar recriação do intervalo

    // ✅ LÓGICA DO HEADER DE STATUS MELHORADA
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

        const pages = book.variations?.[0]?.pages || [];
        const totalPages = book.variations?.[0]?.pageCount || 0;
        const completedPages = pages.filter(p => p.status === 'completed').length;
        const failedPages = pages.filter(p => p.status === 'failed').length;

        switch (book.status) {
            case 'gerando':
                return (
                    <div className={`${styles.statusHeader} ${styles.generating}`}>
                        <FaHourglassHalf className={styles.icon} />
                        <span>Seu livro está sendo criado... Páginas prontas: {completedPages} de {totalPages}</span>
                    </div>
                );
            case 'publicado': // O status agora é 'publicado'
                if (failedPages > 0) {
                    return (
                        <div className={`${styles.statusHeader} ${styles.failed}`}>
                            <FaTimesCircle className={styles.icon} />
                            <span>Geração concluída com {failedPages} erro(s). Contate o suporte.</span>
                        </div>
                    );
                }
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
                        <span>Ocorreu um erro crítico na geração. Por favor, tente novamente mais tarde.</span>
                    </div>
                );
            default: return null;
        }
    };
    
    const pages = book?.variations?.[0]?.pages.sort((a, b) => a.pageNumber - b.pageNumber) || [];
    const isGenerationFinished = book?.status === 'publicado' || book?.status === 'falha_geracao';

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
                            {page.status === 'completed' ? (
                                <Image src={`${APP_URL}${page.imageUrl}`} alt={`Página ${page.pageNumber}`} width={500} height={500} className={styles.pageImage} unoptimized />
                            ) : (
                                <div className={styles.placeholder}>
                                    <FaHourglassHalf className={styles.placeholderIcon} />
                                    <span>Página {page.pageNumber} está sendo desenhada...</span>
                                </div>
                            )}
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