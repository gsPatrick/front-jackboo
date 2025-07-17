// src/components/FriendsProductGrid/FriendsProductGrid.js
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FriendsProductGrid.module.css';
import { FaHeart } from 'react-icons/fa';
import Pagination from '../Pagination/Pagination'; // Importa o componente de paginação


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
    // Opcional: permitir descurtir
    // else {
    //   setLiked(false);
    //   setLikesCount(likesCount - 1);
    // }
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


const FriendsProductGrid = ({ products }) => { // 'products' agora é a lista COMPLETA para paginação

  // --- PAGINAÇÃO ---
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6; // Quantidade de produtos por página
  const totalPages = Math.ceil(products.length / productsPerPage);

  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  // Resetar para a primeira página sempre que a lista de produtos (filtros) mudar
  React.useEffect(() => {
      setCurrentPage(1);
  }, [products]);


  // Função placeholder para lidar com o clique no botão "Ver Livro"
  const handleViewBookClick = (bookId) => {
      console.log(`Clicou em "Ver Livro" para o livro com ID: ${bookId}. Navegar para a página de detalhes.`);
      // Futuramente, usaria algo como: router.push(`/product-details/${bookId}`);
      alert(`Imagine que você navegou para a página de detalhes do Livro ${bookId}`);
  };


  return (
    <div> {/* Wrapper para conter o grid e a paginação */}
        <motion.div
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <AnimatePresence mode="wait">
                {currentProducts.map(product => (
                    <motion.div
                        key={product.id}
                        className={styles.bookCard}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover={{ y: -8, rotate: 1, scale: 1.03 }}
                        transition={{ type: 'spring', stiffness: 180, damping: 12 }}
                        style={{ backgroundColor: product.bgColor || 'white' }}
                    >
                        {/* --- SEÇÃO DO AUTOR (AGORA NO TOPO) --- */}
                        {/* O Link envolve APENAS o contêiner visual do autor */}
                        <Link href={`/profile/${product.userSlug}`} passHref className={styles.authorLink} onClick={(e) => e.stopPropagation()}>
                             <motion.div
                                className={styles.authorInfo}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                             >
                                <div className={styles.authorAvatarWrapper}>
                                    <Image
                                        src={product.userAvatarUrl}
                                        alt={`Avatar de ${product.userName}`}
                                        width={35} // Ajustado tamanho
                                        height={35}
                                        className={styles.authorAvatar}
                                    />
                                </div>
                                <span className={styles.authorName}>por <strong>{product.userName}</strong></span> {/* Negrito no nome */}
                             </motion.div>
                        </Link>


                        {/* --- CAPA DO LIVRO --- */}
                         <div className={styles.bookCoverWrapper}>
                            <Image
                                src={product.imageUrl}
                                alt={`Capa do livro: ${product.title}`}
                                width={250}
                                height={310}
                                className={styles.bookCover}
                            />
                         </div>

                        {/* --- DETALHES DO LIVRO --- */}
                        <h3 className={styles.bookTitle}>{product.title}</h3>
                        <p className={styles.bookPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</p>


                         {/* --- AÇÕES (Likes e Botão Ver Livro) --- */}
                        <div className={styles.cardActions}>
                          <LikeButton initialLikes={product.likes} />
                           <motion.button
                                className={styles.viewBookButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewBookClick(product.id);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                           >
                                Ver Livro
                           </motion.button>
                        </div>

                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>

        {/* --- PAGINAÇÃO --- */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

    </div>
  );
};

export default FriendsProductGrid;  