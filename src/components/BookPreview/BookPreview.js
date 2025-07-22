// src/components/BookPreview/BookPreview.js
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

// Componente Spinner (reutilizado do CharacterCreator, se quiser)
const LoadingSpinnerSmall = () => (
    <div className={styles.spinner}></div>
);

const BookPreview = ({ book }) => {
    const [[page, direction], setPage] = useState([0, 0]);

    // URL BASE DO APLICATIVO (HARDCODED - conforme sua última solicitação)
    const APP_BASE_URL = 'https://geral-jackboo.r954jc.easypanel.host'; 

    const pages = useMemo(() => {
        if (!book || !book.variations || book.variations.length === 0) {
            console.warn("Book data is incomplete or missing for preview.");
            // Retorna um placeholder se os dados iniciais não chegarem
            return [{ type: 'info', message: 'Carregando estrutura do livro...' }]; 
        }
        
        const variation = book.variations[0];
        const coverUrl = variation.coverUrl ? `${APP_BASE_URL}${variation.coverUrl}` : '/images/placeholder-cover.png';
        
        // Mapeia as páginas e inclui o status e o erro (se houver)
        const contentPages = variation.pages.map(p => ({
            type: 'image',
            src: p.imageUrl ? `${APP_BASE_URL}${p.imageUrl}` : null, // src pode ser null se a imagem ainda não estiver pronta
            status: p.status, // 'generating', 'completed', 'failed'
            errorDetails: p.errorDetails || null // Detalhes do erro para exibição
        }));

        // Adiciona a capa e o CTA final
        return [
            { type: 'image', src: coverUrl, isCover: true, status: 'completed' }, // Capa é considerada completa
            ...contentPages,
            { type: 'cta' } // Adiciona o card de CTA no final
        ];
    }, [book]);

    // Exibe um estado de carregamento inicial para o livro como um todo
    if (!book || !book.variations || book.variations.length === 0 || pages.length === 0 || pages[0].type === 'info') {
        return (
            <div className={styles.wrapper}>
                <h2 className={styles.title}>Preparando seu livro mágico...</h2>
                <div className={styles.spinnerWrapper}>
                    <div className={styles.spinner}></div>
                    <p>{pages.length > 0 && pages[0].type === 'info' ? pages[0].message : 'Carregando dados iniciais...'}</p>
                </div>
            </div>
        );
    }

    const paginate = (newDirection) => {
      setPage([(page + newDirection + pages.length) % pages.length, newDirection]);
    };

    const currentPageData = pages[page];

  return (
    <motion.div 
        className={styles.wrapper}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h2 className={styles.title}>{book.title || 'Seu livro mágico está pronto'}</h2>
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
                {currentPageData.type === 'image' ? (
                    currentPageData.status === 'completed' && currentPageData.src ? (
                        <Image
                            src={currentPageData.src}
                            alt={`Página do livro ${page + 1}`}
                            width={600}
                            height={600}
                            className={styles.bookPageImage}
                            unoptimized // Importante para URLs externas como as da IA ou caminhos locais
                        />
                    ) : currentPageData.status === 'generating' ? (
                        <div className={styles.pageLoadingPlaceholder}>
                            <LoadingSpinnerSmall />
                            <p>Gerando página {page + 1}...</p>
                        </div>
                    ) : currentPageData.status === 'failed' ? (
                        <div className={styles.pageFailedPlaceholder}>
                            <p>Erro ao gerar esta página!</p>
                            {currentPageData.errorDetails && <small>{currentPageData.errorDetails}</small>}
                        </div>
                    ) : ( // Fallback para status 'pending' ou desconhecido sem URL
                        <div className={styles.pageLoadingPlaceholder}>
                            <p>Página {page + 1} em processamento...</p>
                        </div>
                    )
                ) : currentPageData.type === 'cta' ? (
                    <div className={styles.ctaCard}>
                        <h3>Gostou?</h3>
                        <p>Compre o livro para ver o resto da sua aventura mágica!</p>
                    </div>
                ) : ( // Caso para 'info' ou outros tipos de página não previstos
                    <div className={styles.ctaCard}>
                        <h3>Ops!</h3>
                        <p>{currentPageData.message || 'Houve um problema ao carregar esta página.'}</p>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>

        <button className={`${styles.navButton} ${styles.prev}`} onClick={() => paginate(-1)}>
            <FaArrowLeft />
        </button>
        <button className={`${styles.navButton} ${styles.next}`} onClick={() => paginate(1)}>
            <FaArrowRight />
        </button>
      </div>

      <motion.button 
        className={styles.addToCartButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Adicionar ao carrinho
      </motion.button>
    </motion.div>
  );
};

export default BookPreview;