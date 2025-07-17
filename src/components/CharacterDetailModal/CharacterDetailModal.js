// src/components/CharacterDetailModal/CharacterDetailModal.js
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CharacterDetailModal.module.css'; // <-- **A LINHA QUE FALTAVA FOI ADICIONADA AQUI**
import Pagination from '../Pagination/Pagination'; 

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 150, damping: 20 } },
  exit: { opacity: 0, y: 50, scale: 0.9 },
};

// Recriando o LikeButton para ser autossuficiente
const LikeButton = ({ initialLikes }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!liked) {
      setLiked(true);
      setLikesCount(likesCount + 1);
    }
  };

  return (
    <motion.div className={styles.likesWrapper} onClick={handleLike} whileTap={{ scale: 0.9 }}>
      <svg className={`${styles.heartIcon} ${liked ? styles.liked : ''}`} viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <span>{likesCount}</span>
    </motion.div>
  );
};


const CharacterDetailModal = ({ character, userBooks, onClose }) => {
  const [activeTab, setActiveTab] = useState('História');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 3; 

  if (!character) return null;

  const filteredBooks = userBooks?.filter(book => book.type === activeTab) || [];
  
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );
  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);


  return (
    <AnimatePresence>
      <motion.div
        className={styles.backdrop}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className={styles.modal}
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.closeButton} onClick={onClose}>×</button>
          
          <div className={styles.characterInfo}>
            <div className={styles.characterImageWrapper}>
              <Image src={character.imageUrl} alt={character.name} width={180} height={180} className={styles.characterImage}/>
            </div>
            <h2 className={styles.characterName}>{character.name}</h2>
          </div>

          <div className={styles.booksSection}>
            <h3 className={styles.booksTitle}>Livros com este Personagem</h3>
            
            <div className={styles.tabsContainer}>
              <button className={`${styles.tabButton} ${activeTab === 'História' ? styles.active : ''}`} onClick={() => setActiveTab('História')}>História</button>
              <button className={`${styles.tabButton} ${activeTab === 'Colorir' ? styles.active : ''}`} onClick={() => setActiveTab('Colorir')}>Colorir</button>
            </div>

            {currentBooks.length > 0 ? (
                <>
                    <motion.div 
                        key={activeTab}
                        className={styles.booksGrid}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {currentBooks.map(book => (
                            <div key={book.id} className={styles.bookCardWrapper}>
                                <motion.div className={styles.bookCard} style={{ backgroundColor: book.bgColor }} whileHover={{y: -5}}>
                                    <div className={styles.bookTypeBadge}>{book.type}</div>
                                    <div className={styles.bookCoverWrapper}>
                                        <Image src={book.imageUrl} alt={book.title} width={120} height={150} className={styles.bookCover}/>
                                    </div>
                                    <span className={styles.bookTitle}>{book.title}</span>
                                    <div className={styles.bookDetails}>
                                        <span className={styles.bookPrice}>R$ {book.price.toFixed(2).replace('.', ',')}</span>
                                        <LikeButton initialLikes={book.likes} />
                                    </div>
                                    <Link href={`/book-details/${book.id}`} passHref>
                                        <motion.button className={styles.viewBookButton} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Ver Livro</motion.button>
                                    </Link>
                                </motion.div>
                            </div>
                        ))}
                    </motion.div>
                    {totalPages > 1 && (
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    )}
                </>
            ) : (
              <p className={styles.emptyMessage}>Este personagem ainda não estrelou em nenhum livro de {activeTab.toLowerCase()}!</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CharacterDetailModal;