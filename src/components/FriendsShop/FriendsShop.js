// src/components/FriendsShop/FriendsShop.js
'use client';

import React, { useState, useEffect } from 'react'; // NOVO: Adicionado useState e useEffect
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './FriendsShop.module.css';
import { shopService } from '@/services/api'; // NOVO: Importa o serviço da loja

// Componente para o ícone de coração interativo (mantido como está)
const HeartIcon = ({ initialLikes }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const handleLike = (e) => {
    e.stopPropagation(); // Impede que o clique se propague para o link do card
    if (!liked) {
      setLiked(true);
      setLikesCount(likesCount + 1);
    }
  };

  return (
    <motion.div 
      className={styles.likesWrapper} 
      onClick={handleLike}
      whileTap={{ scale: liked ? 1 : 1.2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <svg className={`${styles.heartIcon} ${liked ? styles.liked : ''}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <span>{likesCount}</span>
    </motion.div>
  );
};

// REMOVIDO: Dados mockados não são mais necessários
// const friendsBooks = [ ... ];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const FriendsShop = () => {
  // NOVO: Estados para armazenar produtos, carregamento e erros
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // NOVO: Efeito para buscar os produtos da API
  useEffect(() => {
    const fetchFriendsBooks = async () => {
      try {
        // Busca os 4 livros mais recentes da loja dos amigos
        const data = await shopService.getFriendsShelf({ limit: 4 });
        setBooks(data.books);
      } catch (err) {
        console.error("Erro ao buscar livros dos amigos:", err);
        setError("A magia dos amigos encontrou um probleminha para carregar os livros.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriendsBooks();
  }, []);

  // NOVO: Renderização para o estado de carregamento
  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.loadingMessage}>Procurando as criações dos amigos...</p>
        </div>
      </section>
    );
  }

  // NOVO: Renderização para o estado de erro
  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.emptyMessage}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            A Lojinha dos <span className={styles.highlight}>amigos</span>
          </h2>
          {/* ALTERADO: Botão agora é um link para a página da loja dos amigos */}
          <Link href="/friends-shop" passHref>
            <motion.button 
              className={styles.viewAllButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver a Lojinha
            </motion.button>
          </Link>
        </div>
        
        {/* ALTERADO: Lógica para renderizar a grade ou a mensagem de vitrine vazia */}
        {books.length > 0 ? (
          <motion.div
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {books.map((book) => (
              // ALTERADO: O card inteiro agora é um link para a página de detalhes do livro
              <Link href={`/book-details/${book.id}`} passHref key={book.id}>
                <motion.div
                  className={styles.bookCard}
                  variants={cardVariants}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/profile/${book.author.slug}`} passHref className={styles.authorLink} onClick={(e) => e.stopPropagation()}>
                    <motion.div
                        className={styles.authorInfo}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className={styles.authorAvatarWrapper}>
                            <Image
                                src={book.author.avatarUrl || '/images/default-avatar.png'} // ALTERADO: Usa dados da API
                                alt={`Avatar de ${book.author.nickname}`}
                                width={35}
                                height={35}
                                className={styles.authorAvatar}
                            />
                        </div>
                        <span className={styles.authorName}>por <strong>{book.author.nickname}</strong></span>
                    </motion.div>
                  </Link>
                  
                  <div className={styles.imageWrapper}>
                    <Image
                      src={book.coverUrl || '/images/book.png'} // ALTERADO: Usa dados da API
                      alt={`Livro: ${book.title}`}
                      width={250}
                      height={300}
                      className={styles.bookImage}
                    />
                  </div>
                  
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <p className={styles.bookPrice}>R$ {book.variations[0]?.price.toFixed(2).replace('.', ',')}</p>
                  
                  <div className={styles.cardActions}>
                    <HeartIcon initialLikes={book.totalLikes} />
                    <motion.button 
                      className={styles.viewBookButton}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Ver Livro
                    </motion.button>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        ) : (
          // NOVO: Mensagem lúdica quando não há livros de amigos
          <div className={styles.emptyContainer}>
            <h3 className={styles.emptyMessage}>Chame seus amigos para criarem livros!</h3>
            <p className={styles.emptySubMessage}>Este espaço mágico está esperando pelas histórias deles!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FriendsShop;