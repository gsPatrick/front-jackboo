// src/app/(admin)/admin/books/view/[bookId]/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { adminBooksService } from '@/services/api';
import styles from './page.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft, FaToggleOn, FaToggleOff, FaSyncAlt, FaChevronRight } from 'react-icons/fa';

const APP_URL = 'https://geral-jackboo.r954jc.easypanel.host';

export default function ViewBookPagesPage() {
    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const params = useParams();
    const router = useRouter();
    const { bookId } = params;

    // ✅ CORREÇÃO: Lógica de polling para buscar atualizações do livro.
    useEffect(() => {
        if (!bookId) {
            setError("ID do livro não fornecido.");
            setIsLoading(false);
            return;
        }

        const fetchBook = async () => {
            try {
                const data = await adminBooksService.getOfficialBookById(bookId);
                setBook(data);
                if (data.status !== 'gerando') {
                    return true; // Indica que a geração terminou.
                }
                return false; // Indica que ainda está gerando.
            } catch (err) {
                setError(`Erro ao buscar detalhes do livro: ${err.message}`);
                return true; // Para o polling em caso de erro.
            } finally {
                setIsLoading(false);
            }
        };

        // Busca inicial
        fetchBook();

        // Inicia o polling se o livro ainda estiver sendo gerado
        const intervalId = setInterval(async () => {
            const isFinished = await fetchBook();
            if (isFinished) {
                clearInterval(intervalId);
            }
        }, 5000); // Verifica a cada 5 segundos

        // Limpa o intervalo quando o componente é desmontado
        return () => clearInterval(intervalId);
    }, [bookId]);

    const handleStatusChange = async () => {
        if (!book) return;
        const newStatus = book.status === 'publicado' ? 'privado' : 'publicado';
        try {
            const updatedBook = await adminBooksService.updateOfficialBookStatus(book.id, newStatus);
            setBook(updatedBook);
            toast.success(`Livro atualizado para "${newStatus}"!`);
        } catch (error) {
            toast.error(`Falha ao atualizar status: ${error.message}`);
        }
    };

    const getPages = () => {
        if (!book || !book.variations || book.variations.length === 0) return [];
        return book.variations[0].pages.sort((a, b) => a.pageNumber - b.pageNumber) || [];
    };

    const pages = getPages();
    const currentPageData = pages[currentPageIndex];

    const nextPage = () => setCurrentPageIndex(prev => Math.min(prev + 1, pages.length - 1));
    const prevPage = () => setCurrentPageIndex(prev => Math.max(prev - 1, 0));

    if (isLoading) {
        return <div className={styles.loading}>Carregando páginas do livro...</div>;
    }
    if (error) {
        return <div className={styles.loading}>{error}</div>;
    }
    if (!book) {
        return <div className={styles.loading}>Livro não encontrado.</div>;
    }

    return (
        <motion.div className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ToastContainer position="bottom-right" theme="colored" />
            <header className={styles.header}>
                <button onClick={() => router.back()} className={styles.backButton}><FaArrowLeft /> Voltar</button>
                <h1 className={styles.title}>{book.title}</h1>
                <button onClick={handleStatusChange} className={`${styles.statusButton} ${book.status === 'publicado' ? styles.statusPublic : styles.statusPrivate}`}>
                    {book.status === 'publicado' ? <FaToggleOn /> : <FaToggleOff />}
                    {book.status === 'publicado' ? 'Público' : 'Privado'}
                </button>
            </header>
            
            <main className={styles.previewArea}>
                <motion.button onClick={prevPage} className={styles.navButton} disabled={currentPageIndex === 0} whileTap={{ scale: 0.9 }}>
                    <FaArrowLeft />
                </motion.button>
                
                <div className={styles.pageWrapper}>
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={currentPageData ? currentPageData.id : 'loading-page'} 
                            className={styles.pageContent}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentPageData && currentPageData.imageUrl ? (
                                <Image 
                                    src={`${APP_URL}${currentPageData.imageUrl}`} 
                                    alt={`Página ${currentPageData.pageNumber}`} 
                                    layout="fill" 
                                    objectFit="contain" // Garante que a imagem inteira seja visível
                                    unoptimized
                                />
                            ) : (
                                <div className={styles.pendingOverlay}>
                                    <FaSyncAlt className={styles.spinningIcon} />
                                    <span>Gerando esta página...</span>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
                
                <motion.button onClick={nextPage} className={styles.navButton} disabled={currentPageIndex >= pages.length - 1} whileTap={{ scale: 0.9 }}>
                    <FaChevronRight />
                </motion.button>
            </main>
            
            <footer className={styles.controls}>
                <span className={styles.pageIndicator}>Página {currentPageIndex + 1} de {pages.length}</span>
                {book.status === 'gerando' && <span className={styles.generatingStatus}>Ainda gerando...</span>}
            </footer>
        </motion.div>
    );
}