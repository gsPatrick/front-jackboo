'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './page.module.css';
import { FaSyncAlt, FaFilePdf, FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { adminBookGeneratorService, adminBooksService } from '@/services/api';

const PreviewContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookId = searchParams.get('bookId');

    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const fetchBookDetails = async () => {
        if (!bookId) {
            setError("ID do livro não fornecido na URL.");
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            const fetchedBook = await adminBooksService.getOfficialBookById(bookId);
            setBook(fetchedBook);
        } catch (err) {
            console.error("Erro ao carregar detalhes do livro:", err);
            setError("Falha ao carregar o livro: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookDetails();
    }, [bookId]);

    const handleRegeneratePage = async (pageId) => {
        alert(`Funcionalidade de regerar a página ${pageId} ainda não implementada.`);
    };

    const handleFinalize = async () => {
        alert(`Funcionalidade de finalizar o livro ${book.id} ainda não implementada.`);
    };

    const getPages = () => {
        if (!book || !book.variations || book.variations.length === 0) return [];
        // Assumimos que o livro terá uma única variação por enquanto
        return book.variations[0].pages || [];
    };

    const pages = getPages();
    const currentPage = pages[currentPageIndex];

    const nextPage = () => setCurrentPageIndex(prev => Math.min(prev + 1, pages.length - 1));
    const prevPage = () => setCurrentPageIndex(prev => Math.max(prev - 1, 0));

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <h2>Carregando preview do livro...</h2>
            </div>
        );
    }

    if (error) return <div className={styles.errorContainer}>Erro: {error}. <button onClick={fetchBookDetails}>Tentar novamente</button></div>;
    if (!book || pages.length === 0) return <div className={styles.emptyContainer}>Nenhuma página encontrada para este livro.</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>{book.title}</h1>
                <motion.button 
                    className={styles.finalizeButton} 
                    onClick={handleFinalize} 
                    whileHover={{ scale: 1.05 }}
                    disabled={pages.some(p => p.status !== 'completed' && p.imageUrl)} // Desabilita se alguma página não estiver completa
                >
                    <FaCheckCircle /> Aprovar e Finalizar Livro
                </motion.button>
            </header>
            
            <main className={styles.previewArea}>
                <motion.button onClick={prevPage} className={styles.navButton} disabled={currentPageIndex === 0} whileTap={{ scale: 0.9 }}>
                    <FaChevronLeft />
                </motion.button>
                
                <div className={styles.pageWrapper}>
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={currentPage.id} 
                            className={styles.pageContent}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentPage.imageUrl ? (
                                // --- CORREÇÃO AQUI ---
                                <Image 
                                    src={`https://geral-jackboo.r954jc.easypanel.host${currentPage.imageUrl}`} 
                                    alt={`Página ${currentPage.pageNumber}`} 
                                    layout="fill" 
                                    objectFit="contain" 
                                    unoptimized={true}
                                />
                                // --- FIM DA CORREÇÃO ---
                            ) : (
                                <div className={`${styles.pageOverlay} ${styles.pending}`}>
                                    <span>Página pendente ou com erro.</span>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
                
                <motion.button onClick={nextPage} className={styles.navButton} disabled={currentPageIndex === pages.length - 1} whileTap={{ scale: 0.9 }}>
                    <FaChevronRight />
                </motion.button>
            </main>
            
            <footer className={styles.controls}>
                <span className={styles.pageIndicator}>Página {currentPage.pageNumber} de {pages.length}</span>
                <motion.button 
                    className={styles.regenerateButton} 
                    onClick={() => handleRegeneratePage(currentPage.id)}
                    whileHover={{ scale: 1.1 }}
                >
                    <FaSyncAlt />
                    Regerar esta página
                </motion.button>
            </footer>
        </div>
    );
}

// Componente wrapper para usar Suspense
export default function PreviewBookPageWrapper() {
    return (
        <Suspense fallback={<div className={styles.loadingContainer}><div className={styles.loader}></div><h2>Carregando...</h2></div>}>
            <PreviewContent />
        </Suspense>
    );
}