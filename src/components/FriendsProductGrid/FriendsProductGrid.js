// src/components/FriendsProductGrid/FriendsProductGrid.js
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FriendsProductGrid.module.css';
import { FaHeart } from 'react-icons/fa';
import Pagination from '../Pagination/Pagination';
import { useCart } from '@/contexts/CartContext';

// --- Componente/Lógica de Botão de Like ---
const LikeButton = ({ initialLikes }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const handleLike = (e) => {
    e.stopPropagation(); // Impede que o clique se propague
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
  transition={
    liked
      ? { duration: 0.4, type: 'spring', stiffness: 300 }
      : { type: 'spring', stiffness: 400, damping: 10 }
  }
  animate={liked ? { scale: [1, 1.2, 1] } : {}}
>
  <FaHeart className={`${styles.heartIcon} ${liked ? styles.liked : ''}`} />
  <span>{likesCount}</span>
</motion.div>

  );
};


// --- VARIANTES DE ANIMAÇÃO PARA ITENS ---
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.85 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 17 } },
  exit: { opacity: 0, y: -30, scale: 0.85, transition: { duration: 0.25 } },
};


const FriendsProductGrid = ({ products, isLoading, error }) => { // Accept isLoading, error
  const { addToCart } = useCart();

  // --- PAGINAÇÃO ---
  const productsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  React.useEffect(() => {
      setCurrentPage(1);
  }, [products]);


  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    e.preventDefault();

    const defaultVariation = product.variations?.[0];

    if (defaultVariation) {
        addToCart(product, defaultVariation, 1);
    } else {
        alert("Nenhuma variação de preço disponível para este livro.");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.statusMessage}>
        <div className={styles.spinner}></div>
        <p>Carregando criações dos amigos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.statusMessage}>
        <p className={styles.errorMessage}>Oops! A magia falhou em carregar os livros dos amigos: {error}</p>
      </div>
    );
  }

  if (products.length === 0 && !isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <h3 className={styles.emptyMessage}>Nenhum livro de amigo encontrado no momento!</h3>
        <p className={styles.emptySubMessage}>Convide seus amigos para criarem suas próprias histórias!</p>
      </div>
    );
  }


  return (
    <div>
        <motion.div
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <AnimatePresence mode="wait">
                {currentProducts.map(product => (
                    // Wrap the entire card with Link
                    <Link href={`/book-details/${product.id}`} passHref key={product.id}>
                        <motion.div
                            className={styles.bookCard}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            whileHover={{ y: -8, rotate: 1, scale: 1.03 }}
                            transition={{ type: 'spring', stiffness: 180, damping: 12 }}
                            style={{ backgroundColor: product.bgColor || 'white' }}
                        >
                            {/* Author info moved inside the Link for the card, but its own Link handles navigation. */}
                            <Link href={`/profile/${product.author.slug}`} passHref className={styles.authorLink} onClick={(e) => e.stopPropagation()}>
                                 <motion.div
                                    className={styles.authorInfo}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                 >
                                    <div className={styles.authorAvatarWrapper}>
                                        <Image
                                            src={product.author.avatarUrl || '/images/default-avatar.png'} // Use author.avatarUrl
                                            alt={`Avatar de ${product.author.nickname}`} // Use author.nickname
                                            width={35}
                                            height={35}
                                            className={styles.authorAvatar}
                                        />
                                    </div>
                                    <span className={styles.authorName}>por <strong>{product.author.nickname}</strong></span>
                                 </motion.div>
                            </Link>

                             <div className={styles.bookCoverWrapper}>
                                <Image
                                    src={product.coverUrl || '/images/book.png'} // Use coverUrl
                                    alt={`Capa do livro: ${product.title}`}
                                    width={250}
                                    height={310}
                                    className={styles.bookCover}
                                />
                             </div>

                            <h3 className={styles.bookTitle}>{product.title}</h3>
                            {product.variations?.[0]?.price ? (
                                <p className={styles.bookPrice}>R$ {product.variations[0].price.toFixed(2).replace('.', ',')}</p>
                            ) : (
                                <p className={styles.bookPrice}>Preço indisponível</p>
                            )}


                            <div className={styles.cardActions}>
                              <LikeButton initialLikes={product.totalLikes} /> {/* Use totalLikes */}
                               {product.variations?.[0] && ( // Only show button if there's a price
                                   <motion.button
                                        className={styles.addToCartButton}
                                        onClick={(e) => handleAddToCart(e, product)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                   >
                                        Adicionar ao Carrinho
                                   </motion.button>
                               )}
                            </div>

                        </motion.div>
                    </Link>
                ))}
            </AnimatePresence>
        </motion.div>

        {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}

    </div>
  );
};

export default FriendsProductGrid;