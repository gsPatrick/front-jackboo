// src/app/(admin)/admin/create-book/generating/page.js
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { adminBooksService } from '@/services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GeneratingContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookId = searchParams.get('bookId');

    const [status, setStatus] = useState('Iniciando a magia...');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!bookId) {
            setError('ID do livro não encontrado. Redirecionando...');
            setTimeout(() => router.push('/admin/create-book'), 3000);
            return;
        }

        const intervalId = setInterval(async () => {
            try {
                const bookData = await adminBooksService.getOfficialBookById(bookId);
                const pagesGenerated = bookData.variations?.[0]?.pages?.length || 0;
                const totalPages = bookData.variations?.[0]?.pageCount || 0;

                setStatus(`Criando as páginas... (${pagesGenerated}/${totalPages})`);

                if (bookData.status === 'privado') {
                    clearInterval(intervalId);
                    toast.success('Livro gerado com sucesso!');
                    setStatus('Tudo pronto! Redirecionando para o preview...');
                    setTimeout(() => {
                        router.push(`/admin/books/view/${bookId}`);
                    }, 2000);
                } else if (bookData.status === 'falha_geracao') {
                    clearInterval(intervalId);
                    setError('Ocorreu um erro durante a geração do livro.');
                    toast.error('A geração do livro falhou. Verifique os logs do servidor.');
                }
            } catch (err) {
                clearInterval(intervalId);
                setError('Não foi possível verificar o status do livro.');
                console.error("Erro no polling:", err);
            }
        }, 10000); // Verifica a cada 10 segundos

        // Limpeza ao desmontar o componente
        return () => clearInterval(intervalId);

    }, [bookId, router]);

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <ToastContainer position="bottom-right" theme="colored" />
            <div className={styles.animationContainer}>
                <div className={styles.magicWand}>✨</div>
                <div className={styles.sparkles}></div>
            </div>
            
            {!error ? (
                <>
                    <h1 className={styles.title}>Estamos criando seu livro...</h1>
                    <p className={styles.status}>{status}</p>
                    <div className={styles.progressBar}>
                        <motion.div
                            className={styles.progressFill}
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                        ></motion.div>
                    </div>
                </>
            ) : (
                <>
                    <h1 className={`${styles.title} ${styles.errorTitle}`}>Ops! Algo deu errado</h1>
                    <p className={`${styles.status} ${styles.errorMessage}`}>{error}</p>
                </>
            )}
        </motion.div>
    );
};

export default function GeneratingPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <GeneratingContent />
        </Suspense>
    );
}