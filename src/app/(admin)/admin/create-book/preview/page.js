// src/app/(admin)/admin/create-book/preview/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './page.module.css';
import { FaSyncAlt, FaFilePdf, FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

// MOCK DATA: Simula a resposta da API após a geração inicial.
// A API retornaria um array de objetos, cada um representando uma página gerada.
const mockInitialBookData = {
    title: 'A Grande Aventura de JackBoo na Floresta Mágica',
    pages: [
        { id: 'p1', number: 1, type: 'cover_front', imageUrl: '/images/book.png', status: 'completed' },
        { id: 'p2', number: 2, type: 'intro_page', imageUrl: '/images/product-coloring-book.png', status: 'completed' },
        { id: 'p3', number: 3, type: 'story_illustration', imageUrl: '/images/book.png', status: 'completed' },
        { id: 'p4', number: 4, type: 'story_text', imageUrl: '/images/character-generated.png', status: 'completed' },
        { id: 'p5', number: 5, type: 'story_illustration', imageUrl: '/images/book.png', status: 'failed', error: 'Conteúdo violou políticas.' }, // Exemplo de falha
        { id: 'p6', number: 6, type: 'story_text', imageUrl: '/images/character-generated.png', status: 'completed' },
    ]
};

// Imagem placeholder para simular regeração
const regenerationImages = [
    '/images/hero-jackboo.png',
    '/images/club-jackboo.png',
    '/images/jackboo-sad.png',
];

export default function PreviewBookPage() {
    const router = useRouter();

    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    useEffect(() => {
        // Simula o fetch dos dados da geração
        console.log("Buscando resultado da geração...");
        setTimeout(() => {
            setBook(mockInitialBookData);
            setIsLoading(false);
        }, 2000); // Simula o tempo de geração inicial
    }, []);

    const handleRegeneratePage = (pageId) => {
        console.log(`Regerando página ${pageId}...`);
        
        // Atualiza o estado da página para 'generating'
        setBook(prevBook => ({
            ...prevBook,
            pages: prevBook.pages.map(p =>
                p.id === pageId ? { ...p, status: 'generating' } : p
            )
        }));

        // Simula a API regerando a imagem após 2 segundos
        setTimeout(() => {
            setBook(prevBook => ({
                ...prevBook,
                pages: prevBook.pages.map(p =>
                    p.id === pageId ? {
                        ...p,
                        status: 'completed',
                        // Pega uma imagem aleatória do mock para mostrar a mudança
                        imageUrl: regenerationImages[Math.floor(Math.random() * regenerationImages.length)],
                        error: null
                    } : p
                )
            }));
        }, 2000);
    };

    const handleFinalize = () => {
        const hasFailedPages = book.pages.some(p => p.status === 'failed');
        if (hasFailedPages) {
            alert("Não é possível finalizar. Existem páginas com falha na geração. Por favor, regenere-as.");
            return;
        }
        
        alert("Livro aprovado! O PDF final será gerado e o livro salvo na plataforma.");
        // API Call para finalizar o processo
        router.push('/admin/jackboo-books');
    };

    const nextPage = () => setCurrentPageIndex(prev => Math.min(prev + 1, book.pages.length - 1));
    const prevPage = () => setCurrentPageIndex(prev => Math.max(prev - 1, 0));

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <h2>Gerando seu livro mágico...</h2>
                <p>Isso pode levar um momento. As imagens estão sendo criadas pela IA.</p>
            </div>
        );
    }

    if (!book) return <div className={styles.errorContainer}>Erro ao carregar o livro. Tente novamente.</div>;

    const currentPage = book.pages[currentPageIndex];
    const isRegenerating = currentPage.status === 'generating';

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>{book.title}</h1>
                <motion.button 
                    className={styles.finalizeButton} 
                    onClick={handleFinalize} 
                    whileHover={{ scale: 1.05 }}
                    disabled={book.pages.some(p => p.status !== 'completed')}
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
                            key={currentPage.id + currentPage.imageUrl} // Chave muda para forçar re-render na regeração
                            className={styles.pageContent}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentPage.status === 'completed' && <Image src={currentPage.imageUrl} alt={`Página ${currentPage.number}`} layout="fill" objectFit="contain" />}
                            
                            {isRegenerating && (
                                <div className={`${styles.pageOverlay} ${styles.generating}`}>
                                    <div className={styles.loader}></div>
                                    <span>Regerando...</span>
                                </div>
                            )}
                            
                            {currentPage.status === 'failed' && (
                                <div className={`${styles.pageOverlay} ${styles.failed}`}>
                                    <FaExclamationTriangle />
                                    <span>Falha na Geração</span>
                                    <p>{currentPage.error}</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
                
                <motion.button onClick={nextPage} className={styles.navButton} disabled={currentPageIndex === book.pages.length - 1} whileTap={{ scale: 0.9 }}>
                    <FaChevronRight />
                </motion.button>
            </main>
            
            <footer className={styles.controls}>
                <span className={styles.pageIndicator}>Página {currentPageIndex + 1} de {book.pages.length}</span>
                <motion.button 
                    className={styles.regenerateButton} 
                    onClick={() => handleRegeneratePage(currentPage.id)}
                    disabled={isRegenerating}
                    whileHover={{ scale: 1.1 }}
                >
                    <FaSyncAlt className={isRegenerating ? styles.spinningIcon : ''} />
                    {isRegenerating ? 'Aguarde...' : 'Regerar esta página'}
                </motion.button>
            </footer>
        </div>
    );
}