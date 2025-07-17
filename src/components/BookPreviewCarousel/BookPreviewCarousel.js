// src/components/BookPreviewCarousel/BookPreviewCarousel.js
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './BookPreviewCarousel.module.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Variantes de animação para a transição das páginas
const pageVariants = {
    enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
};

// Componente reutilizável de Carrossel de Páginas
const BookPreviewCarousel = ({ pages }) => {
    const [[page, direction], setPage] = useState([0, 0]); // [índice da página, direção (1 para frente, -1 para trás)]

    // Função para avançar ou retroceder páginas
    const paginate = (newDirection) => {
      setPage([(page + newDirection + pages.length) % pages.length, newDirection]);
    };

    const currentPageData = pages[page]; // Objeto da página atual { src: '...' }

  return (
    <div className={styles.carouselWrapper}>
        {/* O Carrossel */}
      <div className={styles.carousel}>
        <AnimatePresence initial={false} custom={direction}>
            <motion.div
                key={page} // Chave muda com a página, dispara a animação
                className={styles.pageWrapper}
                custom={direction} // Passa a direção como prop customizada
                variants={pageVariants} // Usa as variantes definidas
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }} // Animação de transição
            >
                {/* Conteúdo da página (imagem) */}
                <Image
                    src={currentPageData.src}
                    alt={`Página do livro ${page + 1}`}
                    layout="fill" // Preenche o contêiner .pageWrapper
                    objectFit="contain" // Mantém a proporção
                    className={styles.bookPageImage}
                />
            </motion.div>
        </AnimatePresence>

        {/* Botões de navegação */}
        <motion.button className={`${styles.navButton} ${styles.prev}`} onClick={() => paginate(-1)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FaArrowLeft />
        </motion.button>
        <motion.button className={`${styles.navButton} ${styles.next}`} onClick={() => paginate(1)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FaArrowRight />
        </motion.button>
      </div>

      {/* Indicador de página atual */}
       <div className={styles.pageIndicator}>
           Página {page + 1} de {pages.length}
       </div>
    </div>
  );
};

export default BookPreviewCarousel;