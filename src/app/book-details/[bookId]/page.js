// src/app/book-details/[bookId]/page.js
'use client';

import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation'; // Adicionado useRouter
import styles from './page.module.css';
import BookPreviewCarousel from '@/components/BookPreviewCarousel/BookPreviewCarousel';
import CharacterMessage from '@/components/CharacterMessage/CharacterMessage';
import RelatedBooksGrid from '@/components/RelatedBooksGrid/RelatedBooksGrid';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { shopService } from '@/services/api'; // Importa o serviço de shop
import { useCart } from '@/contexts/CartContext'; // Importa o hook do carrinho

// --- DADOS MOCKADOS DOS LIVROS (AGORA OBTIDOS PELA API) ---
// Removemos a necessidade deste mock, pois a API Shop.service.js já fornece os detalhes.
// Vamos usar um estado para o livro e carregá-lo.


export default function BookDetailsPage() {
  const params = useParams();
  const { bookId } = params;
  const router = useRouter(); // Para redirecionar para o carrinho
  const { addToCart } = useCart(); // Obtém a função addToCart do contexto

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedVariation, setSelectedVariation] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Efeito para carregar os detalhes do livro
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await shopService.getBookDetails(bookId);
        setBook(data);
        if (data.variations && data.variations.length > 0) {
            // Seleciona a primeira variação como padrão
            setSelectedVariation(data.variations[0]);
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes do livro:", err);
        setError("Livro não encontrado ou erro ao carregar os detalhes.");
      } finally {
        setIsLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  if (isLoading) {
    return <main className={styles.main}><div className={styles.container}><p className={styles.loadingMessage}>Carregando livro mágico...</p></div></main>;
  }

  if (error) {
    return <main className={styles.main}><div className={styles.container}><p className={styles.notFoundMessage}>{error}</p></div></main>;
  }

  if (!book) { // Caso não encontre o livro mesmo sem erro aparente
      return <main className={styles.main}><div className={styles.container}><p className={styles.notFoundMessage}>Livro não encontrado!</p></div></main>;
  }

  const handleVariationChange = (variation) => {
    setSelectedVariation(variation);
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
      if (!selectedVariation) {
          alert("Por favor, selecione uma variação do livro.");
          return;
      }
      addToCart(book, selectedVariation, quantity);
  };

   const handleBuyNow = () => {
      if (!selectedVariation) {
          alert("Por favor, selecione uma variação do livro.");
          return;
      }
      addToCart(book, selectedVariation, quantity);
      router.push('/cart'); // Redireciona para o carrinho após adicionar
   };

  // --- Lógica para Livros Relacionados ---
  let relatedBooksFinal = [];
  let relatedSectionTitle = '';
  // Assumimos que a API getBookDetails retorna `book.author.isSystemUser`
  // Se for um livro do sistema (JackBoo), buscar outros livros do JackBoo.
  // Se for um livro de usuário, buscar outros livros do mesmo autor.
  // Se não encontrar do mesmo autor, buscar outros livros de amigos.
  // Se ainda não encontrar, buscar outros livros do JackBoo.

  useEffect(() => {
    const fetchRelatedBooks = async () => {
      if (!book) return;

      const baseParams = { excludeBookId: book.id };
      let books = [];

      try {
        if (book.author.isSystemUser) { // Se for livro do JackBoo (isSystemUser)
          relatedSectionTitle = 'Mais Livros JackBoo que você pode gostar!';
          books = await shopService.getRelatedBooks({
            ...baseParams,
            authorId: book.author.id,
            bookType: book.type // Usar o tipo do livro para relevância
          });
        } else { // Se for livro de amigo
          relatedSectionTitle = `Outros Livros de ${book.author.nickname}!`;
          books = await shopService.getRelatedBooks({
            ...baseParams,
            authorId: book.author.id,
            bookType: book.type // Usar o tipo do livro para relevância
          });

          if (books.length === 0) { // Se não houver do mesmo autor
            relatedSectionTitle = 'Confira outros Livros Incríveis de Amigos!';
            books = await shopService.getFriendsShelf({ limit: 5 }); // Pegar 5 da prateleira de amigos
            books = books.books.filter(b => b.id !== book.id).slice(0,5); // Filtrar o livro atual e limitar
          }
          if (books.length === 0) { // Se ainda não houver nenhum de amigos
              relatedSectionTitle = 'Descubra outros Livros Mágicos!';
              books = await shopService.getJackbooShelf({ limit: 5 }); // Pegar 5 da prateleira JackBoo
              books = books.books.filter(b => b.id !== book.id).slice(0,5); // Filtrar o livro atual e limitar
          }
        }
        relatedBooksFinal = books; // Atualiza a variável para ser usada no JSX
      } catch (relatedError) {
        console.error("Erro ao buscar livros relacionados:", relatedError);
        relatedBooksFinal = [];
      }
    };

    fetchRelatedBooks();
  }, [book]); // Recarrega os relacionados quando o livro principal muda


  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <motion.h1 className={styles.pageTitle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {book.title}
        </motion.h1>

        <div className={styles.contentLayout}>
          <motion.div className={styles.carouselSection} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <div className={styles.characterAndCarouselWrapper}>
                <CharacterMessage
                    protagonistName={book.mainCharacter?.name || 'Personagem'} // Usar mainCharacter
                    protagonistImage={book.mainCharacter?.generatedCharacterUrl || '/images/default-avatar.png'} // Usar generatedCharacterUrl
                    message={book.storyPrompt?.summary || 'Um livro incrível para a sua imaginação!'} // Usar storyPrompt.summary para a mensagem
                    authorName={book.author?.nickname || 'Autor Desconhecido'} // Usar author.nickname
                    authorSlug={book.author?.slug}
                    authorType={book.author?.isSystemUser ? 'jackboo' : 'friend'} // Determinar tipo de autor
                />
                {book.variations?.[0]?.pages?.length > 0 && (
                    <BookPreviewCarousel pages={book.variations[0].pages.map(p => ({ src: p.imageUrl }))} />
                )}
            </div>
          </motion.div>

          <motion.div className={styles.detailsSection} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}>

            <p className={styles.bookDescription}>{book.description}</p>

            <div className={styles.jackAdvice}>
                <Image src="/images/jackboo.png" alt="JackBoo pensativo" width={100} height={100} />
                <div className={styles.speechBubbleSmall}>
                    Prefere ler na tela ou sentir o cheirinho de livro novo? Escolha o seu formato!
                </div>
            </div>

            <div className={styles.variationsContainer}>
                <h3 className={styles.variationsTitle}>Variações:</h3>
                {book.variations.map(variation => (
                    <label key={variation.id} className={`${styles.variationOption} ${selectedVariation?.id === variation.id ? styles.selected : ''}`} onClick={() => handleVariationChange(variation)}>
                        <div className={styles.customRadio}>
                            {selectedVariation?.id === variation.id && <motion.div className={styles.radioInner} layoutId="radio-selected" />}
                        </div>
                        <div className={styles.variationDetails}>
                            <span className={styles.variationName}>{variation.name}</span>
                            <span className={styles.variationInfo}>{variation.info || ''}</span> {/* Usar info se existir */}
                        </div>
                        <span className={styles.variationPrice}>R$ {parseFloat(variation.price).toFixed(2).replace('.', ',')}</span>
                    </label>
                ))}
            </div>

             <div className={styles.quantitySelector}>
                 <motion.button onClick={() => handleQuantityChange(-1)} whileTap={{ scale: 0.9 }} className={styles.quantityButton}><FaMinus /></motion.button>
                 <span className={styles.quantityDisplay}>{quantity}</span>
                 <motion.button onClick={() => handleQuantityChange(1)} whileTap={{ scale: 0.9 }} className={styles.quantityButton}><FaPlus /></motion.button>
             </div>

            <div className={styles.actionButtons}>
              <motion.button className={styles.addToCartButton} onClick={handleAddToCart} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Adicionar ao Carrinho</motion.button>
              <motion.button className={styles.buyNowButton} onClick={handleBuyNow} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Comprar Agora</motion.button>
            </div>
            
          </motion.div>
        </div>

        {/* --- SEÇÃO DE LIVROS RELACIONADOS --- */}
        {relatedBooksFinal.length > 0 && (
          <RelatedBooksGrid books={relatedBooksFinal} title={relatedSectionTitle} />
        )}

      </div>
    </main>
  );
}