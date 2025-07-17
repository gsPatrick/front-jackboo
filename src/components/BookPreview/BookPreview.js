// src/components/BookPreview/BookPreview.js
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './BookPreview.module.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const pages = [
  { type: 'image', src: '/images/cover.png' },
  { type: 'image', src: '/images/page.png' },
  { type: 'image', src: '/images/page.png' },
  { type: 'image', src: '/images/page.png' },
  { type: 'cta' },
];

const variants = {
    enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
};

const BookPreview = () => {
    const [[page, direction], setPage] = useState([0, 0]);

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
      <h2 className={styles.title}>Seu livro mágico está pronto</h2>
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
                    <Image
                        src={currentPageData.src}
                        alt={`Página do livro ${page + 1}`}
                        width={600}
                        height={600}
                        className={styles.bookPageImage}
                    />
                ) : (
                    <div className={styles.ctaCard}>
                        <h3>Gostou?</h3>
                        <p>Compre o livro para ver o resto da sua aventura mágica!</p>
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