// src/components/FriendsShop/FriendsShop.js
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Importado o Link
import { motion } from 'framer-motion';
import styles from './FriendsShop.module.css';

// Componente para o ícone de coração interativo
const HeartIcon = ({ initialLikes }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikesCount(likesCount + 1);
    } else {
      // Opcional: permitir descurtir
      // setLiked(false);
      // setLikesCount(likesCount - 1);
    }
  };

  return (
    <motion.div 
      className={styles.likesWrapper} 
      onClick={handleLike}
      whileTap={{ scale: liked ? 1 : 1.2 }} // Efeito de "pulsar" ao clicar
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <svg className={`${styles.heartIcon} ${liked ? styles.liked : ''}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <span>{likesCount}</span>
    </motion.div>
  );
};

// Dados mockados dos livros dos amigos (AGORA COM DADOS DO AUTOR E TÍTULO)
const friendsBooks = [
  { id: 1, title: 'Cores da Amizade', userSlug: 'livia-colorida', userName: 'Lívia Colorida', userAvatarUrl: '/images/jackboo-sad.png', imageUrl: '/images/book.png', likes: 34, price: '31,50' },
  { id: 2, title: 'A Grande Expedição', userSlug: 'max-aventureiro', userName: 'Max Aventureiro', userAvatarUrl: '/images/hero-jackboo.png', imageUrl: '/images/book.png', likes: 82, price: '29,90' },
  { id: 3, title: 'Mundo dos Sonhos', userSlug: 'sophia-criativa', userName: 'Sophia Criativa', userAvatarUrl: '/images/club-jackboo.png', imageUrl: '/images/book.png', likes: 105, price: '34,90' },
  { id: 4, title: 'Era dos Dinos', userSlug: 'dino-desenhista', userName: 'Dino Desenhista', userAvatarUrl: '/images/bear-upload.png', imageUrl: '/images/book.png', likes: 56, price: '31,50' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const FriendsShop = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            A Lojinha dos <span className={styles.highlight}>amigos</span>
          </h2>
          <motion.button 
            className={styles.viewAllButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver a Lojinha
          </motion.button>
        </div>
        
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {friendsBooks.map((book) => (
            <motion.div
              key={book.id}
              className={styles.bookCard}
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              {/* --- INÍCIO: BLOCO DO AUTOR ADICIONADO --- */}
              <Link href={`/profile/${book.userSlug}`} passHref className={styles.authorLink}>
                <motion.div
                    className={styles.authorInfo}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className={styles.authorAvatarWrapper}>
                        <Image
                            src={book.userAvatarUrl}
                            alt={`Avatar de ${book.userName}`}
                            width={35}
                            height={35}
                            className={styles.authorAvatar}
                        />
                    </div>
                    <span className={styles.authorName}>por <strong>{book.userName}</strong></span>
                </motion.div>
              </Link>
              {/* --- FIM: BLOCO DO AUTOR ADICIONADO --- */}
              
              <div className={styles.imageWrapper}>
                <Image
                  src={book.imageUrl}
                  alt={`Livro: ${book.title}`}
                  width={250}
                  height={300}
                  className={styles.bookImage}
                />
              </div>
              
              {/* --- TÍTULO DO LIVRO ADICIONADO --- */}
              <h3 className={styles.bookTitle}>{book.title}</h3>

              <p className={styles.bookPrice}>R$ {book.price}</p>
              
              <div className={styles.cardActions}>
                <HeartIcon initialLikes={book.likes} />
                <motion.button 
                  className={styles.viewBookButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver Livro
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FriendsShop; 