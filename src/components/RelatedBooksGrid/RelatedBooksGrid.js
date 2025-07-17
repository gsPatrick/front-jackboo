// src/components/RelatedBooksGrid/RelatedBooksGrid.js
'use client';
import React, { useState } from 'react'; // Adicionar useState para o botão de like
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './RelatedBooksGrid.module.css';
import { FaHeart } from 'react-icons/fa'; // Importar o ícone de coração

// --- Componente de Botão de Like (interno ou importado) ---
const LikeButton = ({ initialLikes }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes || 0); // Garante que initialLikes não seja undefined

  const handleLike = (e) => {
    // Impede que o clique no like ative o link do card
    e.preventDefault();
    e.stopPropagation();

    if (!liked) {
      setLiked(true);
      setLikesCount(likesCount + 1);
    }
  };

  return (
    <motion.div
      className={styles.likesWrapper}
      onClick={handleLike}
      whileTap={{ scale: 0.9 }}
      animate={liked ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
    >
      <FaHeart className={`${styles.heartIcon} ${liked ? styles.liked : ''}`} />
      <span>{likesCount}</span>
    </motion.div>
  );
};


// --- VARIANTES DE ANIMAÇÃO PARA ITENS (simples, para entrada no carrossel) ---
const itemVariants = {
  hidden: { opacity: 0, x: 50, scale: 0.9 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};


const RelatedBooksGrid = ({ books, title }) => {
   const booksToDisplay = books.slice(0, 5);

   if (!booksToDisplay || booksToDisplay.length === 0) {
       return null;
   }

  return (
    <div className={styles.sectionWrapper}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.carouselWrapper}>
            <motion.div
                className={styles.carousel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <AnimatePresence>
                    {booksToDisplay.map(book => (
                        <motion.div
                            key={book.id}
                            className={styles.bookCard}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ y: -10, scale: 1.03, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.12)' }}
                            transition={{ type: 'spring', stiffness: 180, damping: 12 }}
                            style={{ backgroundColor: book.bgColor || 'white' }}
                        >
                            {/* O Link agora envolve apenas a parte superior do card (capa, título) */}
                            <Link href={`/book-details/${book.id}`} passHref className={styles.bookLink}>
                                <div className={styles.bookCoverWrapper}>
                                    <Image
                                        src={book.pageImages && book.pageImages[0] ? book.pageImages[0].src : '/images/book-placeholder.png'}
                                        alt={`Capa do livro: ${book.title}`}
                                        width={250}
                                        height={310}
                                        className={styles.bookCover}
                                    />
                                </div>
                                <h3 className={styles.bookTitle}>{book.title}</h3>
                            </Link>

                            {/* --- NOVA SEÇÃO DE AÇÕES --- */}
                            <div className={styles.cardActions}>
                                {/* Renderiza o preço para todos */}
                                {book.variations && <p className={styles.bookPrice}>R$ {book.variations[0].price.toFixed(2).replace('.', ',')}</p>}

                                {/* Renderização Condicional */}
                                <div className={styles.actionButtons}>
                                    {book.authorType === 'friend' && (
                                        // Renderiza LikeButton para livros de amigos
                                        <LikeButton initialLikes={book.likes || 0} />
                                    )}
                                     {/* O botão "Ver Livro" agora é um Link */}
                                     <Link href={`/book-details/${book.id}`} passHref>
                                         <motion.button
                                             className={styles.viewBookButton}
                                             whileHover={{ scale: 1.05 }}
                                             whileTap={{ scale: 0.95 }}
                                             // A classe 'fullWidth' será aplicada se não houver LikeButton
                                             style={{ flexGrow: book.authorType === 'jackboo' ? 1 : 0 }}
                                         >
                                             Ver Livro
                                         </motion.button>
                                     </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    </div>
  );
};

export default RelatedBooksGrid;