// /app/(admin)/admin/books/[bookId]/page.js
'use client'; // <--- CORREÇÃO AQUI

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { adminBookGeneratorService } from '@/services/api';
import styles from './BookDetail.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner, FaExclamationTriangle, FaCheckCircle, FaBook, FaUser, FaPalette, FaFilePdf } from 'react-icons/fa';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://geral-jackboo.r954jc.easypanel.host';

const PageCard = ({ page }) => {
    const getStatusInfo = (status) => {
        switch (status) {
            case 'generating': return { icon: <FaSpinner className={styles.spinner} />, text: 'Gerando...' };
            case 'failed': return { icon: <FaExclamationTriangle />, text: 'Falhou' };
            default: return null;
        }
    };
    const statusInfo = getStatusInfo(page.status);

    return (
        <div className={`${styles.pageCard} ${styles[page.status]}`}>
            {page.status === 'completed' && page.imageUrl ? (
                <Image src={`${APP_URL}${page.imageUrl}`} alt={`Página ${page.pageNumber}`} width={200} height={200} className={styles.pageImage} />
            ) : (
                <div className={styles.pagePlaceholder}>
                    {statusInfo && (
                        <>
                            {statusInfo.icon}
                            <span>{statusInfo.text}</span>
                        </>
                    )}
                </div>
            )}
            <div className={styles.pageNumber}>Página {page.pageNumber}</div>
        </div>
    );
};

const BookDetailPage = () => {
    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const { bookId } = params;

    const fetchBookDetails = useCallback(async () => {
        if (!bookId) return;
        try {
            // Usando o serviço corrigido que aponta para o endpoint do gerador
            const data = await adminBookGeneratorService.getBookById(bookId);
            setBook(data);
        } catch (error) {
            toast.error(`Erro ao buscar detalhes do livro: ${error.message}`);
            setBook(null);
        } finally {
            setIsLoading(false);
        }
    }, [bookId]);
    
    useEffect(() => {
        fetchBookDetails();
    }, [fetchBookDetails]);
    
    // Polling para atualizar status
    useEffect(() => {
        if (book?.status === 'gerando') {
            const intervalId = setInterval(fetchBookDetails, 10000); // Poll every 10 seconds
            return () => clearInterval(intervalId);
        }
    }, [book, fetchBookDetails]);

    if (isLoading) {
        return <div className={styles.container}><p>Carregando detalhes do livro...</p></div>;
    }

    if (!book) {
        return <div className={styles.container}><p>Livro não encontrado.</p></div>;
    }

    const variation = book.variations?.[0];

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <ToastContainer position="bottom-right" theme="colored" />
            <h1 className={styles.title}>{book.title}</h1>
            
            <div className={styles.mainGrid}>
                <div className={styles.coverSection}>
                    <h2 className={styles.sectionTitle}>Capa Gerada</h2>
                    {variation?.coverUrl ? (
                         <Image src={`${APP_URL}${variation.coverUrl}`} alt={`Capa de ${book.title}`} width={300} height={300} className={styles.coverImage}/>
                    ) : <p>Capa ainda não disponível.</p>}
                </div>

                <div className={styles.detailsSection}>
                     <h2 className={styles.sectionTitle}>Detalhes</h2>
                     <div className={styles.metadata}>
                        <p><strong><FaCheckCircle/> Status:</strong> {book.status}</p>
                        <p><strong><FaBook/> Gênero/Tema:</strong> {book.genre}</p>
                        <p><strong><FaUser/> Personagem:</strong> {book.mainCharacter?.name || 'N/A'}</p>
                        <p><strong><FaPalette/> Tipo:</strong> {variation?.type || 'N/A'}</p>
                     </div>
                      <h2 className={styles.sectionTitle} style={{marginTop: '2rem'}}>Ações</h2>
                       <button className={styles.actionButton} disabled={!book.finalPdfUrl}>
                            <FaFilePdf /> Baixar PDF Final
                       </button>
                </div>
            </div>

            <div className={styles.pagesSection}>
                <h2 className={styles.sectionTitle}>Páginas do Livro ({variation?.pages?.length || 0} / {variation?.pageCount || 0})</h2>
                <div className={styles.pagesGrid}>
                    {variation?.pages && variation.pages.length > 0 ? (
                        variation.pages.map(page => <PageCard key={page.id} page={page} />)
                    ) : (
                        <p>Nenhuma página gerada ainda.</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default BookDetailPage;