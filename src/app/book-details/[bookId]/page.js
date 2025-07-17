// src/app/book-details/[bookId]/page.js
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import styles from './page.module.css';
import BookPreviewCarousel from '@/components/BookPreviewCarousel/BookPreviewCarousel';
import CharacterMessage from '@/components/CharacterMessage/CharacterMessage';
import RelatedBooksGrid from '@/components/RelatedBooksGrid/RelatedBooksGrid';
import { FaMinus, FaPlus } from 'react-icons/fa';

// --- DADOS MOCKADOS DOS LIVROS (COMPLETOS E ATUALIZADOS) ---
const mockBooksDetails = [
  {
    id: 'livro-historia-1',
    title: 'Minha Primeira Aventura',
    description: 'Uma história emocionante e personalizada, onde o personagem principal é você!',
    authorType: 'jackboo',
    authorInfo: { name: 'JackBoo', slug: null, avatarUrl: '/images/jackboo.png' },
    protagonistInfo: { name: 'JackBoo Protagonista', imageUrl: '/images/jackboo-protagonist.png' },
    pageImages: [
      { src: '/images/Group 100.png' },
      { src: '/images/Group 100.png' },
      { src: '/images/Group 100.png' },
      { src: '/images/Group 100.png' }
    ],
    variations: [
      { id: 'physical', name: 'Livro Físico', price: 39.90, info: 'Capa dura, 20 páginas' },
      { id: 'digital', name: 'Livro Digital (PDF)', price: 19.90, info: 'Receba por e-mail na hora!' }
    ],
    message: 'Essa é a minha história favorita! Espero que você goste de ler tanto quanto eu gostei de viver essa aventura!',
    bgColor: 'var(--color-jackboo-blue-lightest)'
  },
  {
    id: 'livro-colorir-1',
    title: 'Desenhos Mágicos da Floresta',
    description: 'Um livro de colorir com desenhos incríveis de criaturas da floresta, todos baseados nos seus próprios desenhos!',
    authorType: 'jackboo',
    authorInfo: { name: 'JackBoo', slug: null, avatarUrl: '/images/jackboo.png' },
    protagonistInfo: { name: 'JackBoo Pintor', imageUrl: '/images/jackboo-coloring.png' },
    pageImages: [
      { src: '/images/Group 100.png' },
      { src: '/images/Group 100.png' },
      { src: '/images/Group 100.png' },
      { src: '/images/Group 100.png' }
    ],
    variations: [
      { id: 'physical', name: 'Livro Físico', price: 39.90, info: 'Papel especial para colorir' },
      { id: 'digital', name: 'Livro Digital (PDF)', price: 19.90, info: 'Imprima e pinte quantas vezes quiser!' }
    ],
    message: 'Pegue seus lápis de cor e solte a imaginação! Pinte tudo bem colorido!',
    bgColor: 'var(--color-jackboo-green-lightest)'
  },
   {
    id: 'amigo-historia-1',
    title: 'O Herói do Jardim Secreto',
    description: 'Uma aventura criada por Lívia Colorida, onde ela e seu personagem exploram um jardim mágico!',
    authorType: 'friend',
     authorInfo: { name: 'Lívia Colorida', slug: 'livia-colorida', avatarUrl: '/images/jackboo-sad.png' },
     protagonistInfo: { name: 'Herói do Jardim', imageUrl: '/images/character-generated.png' },
    pageImages: [
      { src: '/images/Group 100.png' },
      { src: '/images/Group 100.png' },
      { src: '/images/Group 100.png' }
    ],
    variations: [
      { id: 'physical', name: 'Livro Físico', price: 39.90, info: 'Capa dura, 20 páginas' },
      { id: 'digital', name: 'Livro Digital (PDF)', price: 19.90, info: 'Receba por e-mail na hora!' }
    ],
    message: 'Venha conhecer a minha história secreta! É super divertida!',
     bgColor: 'var(--color-jackboo-pink-lightest)'
  },
   {
    id: 'amigo-colorir-1',
    title: 'Criaturas Fantásticas Coloridas',
    description: 'Desenhos originais do Max Aventureiro para você colorir e se divertir!',
    authorType: 'friend',
     authorInfo: { name: 'Max Aventureiro', slug: 'max-aventureiro', avatarUrl: '/images/hero-jackboo.png' },
     protagonistInfo: { name: 'Criatura Estelar', imageUrl: '/images/bear-upload.png' },
    pageImages: [
      { src: '/images/Group 100.png' },
      { src: '/images/Group 100.png' },
    ],
    variations: [
      { id: 'physical', name: 'Livro Físico', price: 39.90, info: 'Capa dura, 20 páginas' },
      { id: 'digital', name: 'Livro Digital (PDF)', price: 19.90, info: 'Receba por e-mail na hora!' }
    ],
    message: 'Use as cores mais brilhantes que você tiver para pintar meus amigos!',
    bgColor: 'var(--color-jackboo-orange-lightest)'
  },
    // --- LIVROS ADICIONAIS PARA TESTAR RELACIONADOS (MIX DE JACKBOO E AMIGOS) ---
    {
      id: 'livro-historia-2',
      title: 'A Cidade Flutuante',
      description: 'Uma nova aventura espacial com JackBoo e seus amigos!',
      authorType: 'jackboo',
       authorInfo: { name: 'JackBoo', slug: null, avatarUrl: '/images/jackboo.png' },
       protagonistInfo: { name: 'JackBoo', imageUrl: '/images/jackboo.png' },
      pageImages: [{ src: '/images/Group 100.png' }],
      variations: [{ id: 'physical', name: 'Livro Físico', price: 44.90, info: 'Capa dura' }],
      message: 'Explorei as nuvens para encontrar essa história!',
      bgColor: 'var(--color-jackboo-lilac-light)'
    },
    {
      id: 'amigo-historia-2',
      title: 'O Dragão Amigo',
      description: 'Criado por Lívia Colorida. Um menino e um dragão se tornam melhores amigos.',
      authorType: 'friend',
       authorInfo: { name: 'Lívia Colorida', slug: 'livia-colorida', avatarUrl: '/images/jackboo-sad.png' },
       protagonistInfo: { name: 'Draguinho', imageUrl: '/images/club-jackboo-hero.png' },
      pageImages: [{ src: '/images/Group 100.png' }],
      variations: [{ id: 'physical', name: 'Livro Físico', price: 39.90, info: 'Capa dura' }],
      message: 'Meu dragão é muito legal e quer te conhecer!',
       bgColor: 'var(--color-jackboo-blue-lightest)'
    },
     {
      id: 'amigo-colorir-2',
      title: 'Animais da Selva',
      description: 'Desenhos de animais selvagens feitos por Max Aventureiro.',
      authorType: 'friend',
       authorInfo: { name: 'Max Aventureiro', slug: 'max-aventureiro', avatarUrl: '/images/hero-jackboo.png' },
       protagonistInfo: { name: 'Leãozinho', imageUrl: '/images/how-it-works/step1-draw.png' },
      pageImages: [{ src: '/images/Group 100.png' }],
      variations: [{ id: 'physical', name: 'Livro Físico', price: 39.90, info: 'Capa dura' }],
      message: 'Quero ver esses animais bem coloridos!',
       bgColor: 'var(--color-jackboo-green-lightest)'
    },
     {
      id: 'livro-colorir-2',
      title: 'Pintando o Espaço',
      description: 'Um livro de colorir sobre planetas e estrelas, feito pelo JackBoo.',
      authorType: 'jackboo',
       authorInfo: { name: 'JackBoo', slug: null, avatarUrl: '/images/jackboo.png' },
       protagonistInfo: { name: 'JackBoo', imageUrl: '/images/jackboo-coloring.png' },
      pageImages: [{ src: '/images/Group 100.png' }],
      variations: [{ id: 'physical', name: 'Livro Físico', price: 39.90, info: 'Capa dura' }],
      message: 'As estrelas esperam por você e suas cores!',
       bgColor: 'var(--color-jackboo-orange-lightest)'
    },
     {
      id: 'amigo-historia-3',
      title: 'A Fada e o Unicórnio',
      description: 'Uma história mágica sobre amizade, criada por Sophia Criativa.',
      authorType: 'friend',
       authorInfo: { name: 'Sophia Criativa', slug: 'sophia-criativa', avatarUrl: '/images/club-jackboo.png' },
       protagonistInfo: { name: 'Fada Estela', imageUrl: '/images/friends-jackboo.png' },
      pageImages: [{ src: '/images/Group 100.png' }],
      variations: [{ id: 'physical', name: 'Livro Físico', price: 39.90, info: 'Capa dura' }],
      message: 'Venha voar comigo e meu amigo unicórnio!',
       bgColor: 'var(--color-jackboo-pink-lightest)'
    },
];


export default function BookDetailsPage() {
  const params = useParams();
  const { bookId } = params;
  const book = mockBooksDetails.find(b => b.id === bookId);

  const [selectedVariation, setSelectedVariation] = useState(book ? book.variations[0] : null);
  const [quantity, setQuantity] = useState(1);

  if (!book) {
      return <main className={styles.main}><div className={styles.container}><p className={styles.notFoundMessage}>Livro não encontrado!</p></div></main>;
  }

  const handleVariationChange = (variation) => {
    setSelectedVariation(variation);
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
      console.log(`Adicionou ${quantity}x "${book.title} - ${selectedVariation.name}" (ID: ${book.id}) ao carrinho.`);
      alert(`${quantity}x ${book.title} (${selectedVariation.name}) adicionado ao carrinho!`);
  };

   const handleBuyNow = () => {
      console.log(`Comprou ${quantity}x "${book.title} - ${selectedVariation.name}" (ID: ${book.id}) agora.`);
      alert(`Comprando ${quantity}x ${book.title} (${selectedVariation.name}) agora!`);
   };

  // --- Lógica para Livros Relacionados ---
  let relatedBooksSource = [];
  let relatedSectionTitle = '';
  if (book.authorType === 'jackboo') {
      relatedBooksSource = mockBooksDetails.filter(b => b.authorType === 'jackboo' && b.id !== bookId);
      relatedSectionTitle = 'Mais Livros JackBoo que você pode gostar!';
  } else {
      relatedBooksSource = mockBooksDetails.filter(b => b.authorType === 'friend' && b.authorInfo.slug === book.authorInfo.slug && b.id !== bookId);
       relatedSectionTitle = `Outros Livros de ${book.authorInfo.name}!`;
       if (relatedBooksSource.length === 0) {
            relatedBooksSource = mockBooksDetails.filter(b => b.id !== bookId && b.authorType === 'friend');
             if (relatedBooksSource.length === 0) {
                  relatedBooksSource = mockBooksDetails.filter(b => b.id !== bookId && b.authorType === 'jackboo');
                   relatedSectionTitle = 'Descubra outros Livros Mágicos!';
             } else {
                 relatedSectionTitle = 'Confira outros Livros Incríveis de Amigos!';
             }
       }
  }
  const relatedBooksFinal = relatedBooksSource.slice(0, 5);


  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <motion.h1 className={styles.pageTitle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {book.title}
        </motion.h1>

        <div className={styles.contentLayout}>
          {/* --- SEÇÃO DA ESQUERDA (PERSONAGEM + CARROSSEL) --- */}
          <motion.div className={styles.carouselSection} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <div className={styles.characterAndCarouselWrapper}>
                <CharacterMessage
                    protagonistName={book.protagonistInfo.name}
                    protagonistImage={book.protagonistInfo.imageUrl}
                    message={book.message}
                    authorName={book.authorInfo.name}
                    authorSlug={book.authorInfo.slug}
                    authorType={book.authorType}
                />
                <BookPreviewCarousel pages={book.pageImages} />
            </div>
          </motion.div>

          {/* --- SEÇÃO DE DETALHES DA DIREITA --- */}
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
                    <label key={variation.id} className={`${styles.variationOption} ${selectedVariation.id === variation.id ? styles.selected : ''}`} onClick={() => handleVariationChange(variation)}>
                        <div className={styles.customRadio}>
                            {selectedVariation.id === variation.id && <motion.div className={styles.radioInner} layoutId="radio-selected" />}
                        </div>
                        <div className={styles.variationDetails}>
                            <span className={styles.variationName}>{variation.name}</span>
                            <span className={styles.variationInfo}>{variation.info}</span>
                        </div>
                        <span className={styles.variationPrice}>R$ {variation.price.toFixed(2).replace('.', ',')}</span>
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
        <RelatedBooksGrid books={relatedBooksFinal} title={relatedSectionTitle} />

      </div>
    </main>
  );
}