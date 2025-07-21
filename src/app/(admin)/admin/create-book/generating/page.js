'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { adminBookGeneratorService } from '@/services/api';

const GeneratingContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [status, setStatus] = useState('Iniciando a magia...');
    const [error, setError] = useState(null);
    const hasStartedGeneration = useRef(false); // Trava para evitar execução dupla

    useEffect(() => {
        // Só executa se a geração AINDA NÃO tiver começado
        if (!hasStartedGeneration.current) {
            hasStartedGeneration.current = true; // Marca que a geração começou

            const generateBook = async () => {
                // Extrai todos os parâmetros da URL
                const bookType = searchParams.get('bookType');
                const generationData = {
                    title: searchParams.get('title'),
                    characterId: parseInt(searchParams.get('characterId'), 10),
                    printFormatId: parseInt(searchParams.get('printFormatId'), 10),
                    pageCount: parseInt(searchParams.get('pageCount'), 10),
                    theme: searchParams.get('theme'),
                    location: searchParams.get('location'),
                    summary: searchParams.get('summary'),
                };

                if (!bookType || !generationData.title) {
                    setError('Dados insuficientes para iniciar a geração. Por favor, tente novamente.');
                    return;
                }
                
                try {
                    setStatus('Construindo a estrutura do seu livro...');
                    const book = await adminBookGeneratorService.generateBookPreview(bookType, generationData);
                    
                    setStatus('Livro gerado com sucesso! Redirecionando para o preview...');

                    setTimeout(() => {
                        router.push(`/admin/create-book/preview?bookId=${book.id}`);
                    }, 2000);

                } catch (err) {
                    console.error("Erro fatal durante a geração do livro:", err);
                    setError(`Ocorreu um erro: ${err.message}. Você será redirecionado em breve.`);
                    setTimeout(() => {
                        router.push('/admin/create-book');
                    }, 5000);
                }
            };

            generateBook();
        }
    }, [searchParams, router]); // Adiciona dependências para o linter do React

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
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
                            transition={{ duration: 25, ease: "linear", repeat: Infinity }} // Simula progresso contínuo
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

// Componente wrapper para usar Suspense, recomendado pelo Next.js para useSearchParams
export default function GeneratingPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <GeneratingContent />
        </Suspense>
    );
}