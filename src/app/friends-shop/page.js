// src/app/friends-shop/page.js
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import FriendsShopSidebar from '@/components/FriendsShopSidebar/FriendsShopSidebar';
import FriendsProductGrid from '@/components/FriendsProductGrid/FriendsProductGrid';

// --- DADOS MOCKADOS (Reutilizando e expandindo do perfil) ---
// Em uma aplicação real, esses dados viriam de uma API
const mockUsers = {
  'pequeno-artista': {
    name: 'Pequeno Artista',
    slug: 'pequeno-artista', // Adicionado slug
    avatarUrl: '/images/character-generated.png',
    ageGroup: '4-6', // Adicionado faixa etária para filtro
  },
  'livia-colorida': {
    name: 'Lívia Colorida',
    slug: 'livia-colorida', // Adicionado slug
    avatarUrl: '/images/jackboo-sad.png',
    ageGroup: '7+', // Adicionado faixa etária para filtro
  },
   'max-aventureiro': {
    name: 'Max Aventureiro',
    slug: 'max-aventureiro',
    avatarUrl: '/images/hero-jackboo.png',
    ageGroup: '0-3',
  },
    'sophia-criativa': {
    name: 'Sophia Criativa',
    slug: 'sophia-criativa',
    avatarUrl: '/images/club-jackboo.png',
    ageGroup: '4-6',
  },
    'dino-desenhista': {
    name: 'Dino Desenhista',
    slug: 'dino-desenhista',
    avatarUrl: '/images/bear-upload.png',
    ageGroup: '7+',
  },
  // Adicionar mais usuários mockados se necessário
};

// Adicionado userId (mapeia para slug), userName e userAvatarUrl para conveniência no grid
const allFriendsBooks = [
  { id: 1, userId: 'pequeno-artista', userSlug: 'pequeno-artista', userName: 'Pequeno Artista', userAvatarUrl: mockUsers['pequeno-artista'].avatarUrl, title: 'Minha Primeira Aventura', type: 'História', price: 39.90, likes: 15, imageUrl: '/images/book.png', bgColor: 'var(--color-jackboo-blue-lightest)' },
  { id: 2, userId: 'pequeno-artista', userSlug: 'pequeno-artista', userName: 'Pequeno Artista', userAvatarUrl: mockUsers['pequeno-artista'].avatarUrl, title: 'Desenhos Mágicos da Floresta', type: 'Colorir', price: 39.90, likes: 22, imageUrl: '/images/product-coloring-book.png', bgColor: 'var(--color-jackboo-green-lightest)' },
  { id: 3, userId: 'livia-colorida', userSlug: 'livia-colorida', userName: 'Lívia Colorida', userAvatarUrl: mockUsers['livia-colorida'].avatarUrl, title: 'O Herói do Jardim Secreto', type: 'História', price: 39.90, likes: 18, imageUrl: '/images/book.png', bgColor: 'var(--color-jackboo-pink-lightest)' },
  { id: 4, userId: 'livia-colorida', userSlug: 'livia-colorida', userName: 'Lívia Colorida', userAvatarUrl: mockUsers['livia-colorida'].avatarUrl, title: 'Criaturas Fantásticas Coloridas', type: 'Colorir', price: 39.90, likes: 35, imageUrl: '/images/product-coloring-book.png', bgColor: 'var(--color-jackboo-orange-lightest)' },
  { id: 5, userId: 'max-aventureiro', userSlug: 'max-aventureiro', userName: 'Max Aventureiro', userAvatarUrl: mockUsers['max-aventureiro'].avatarUrl, title: 'JackBoo e o Tesouro Submarino', type: 'História', price: 39.90, likes: 25, imageUrl: '/images/book.png', bgColor: 'var(--color-jackboo-lilac-light)' },
  { id: 6, userId: 'max-aventureiro', userSlug: 'max-aventureiro', userName: 'Max Aventureiro', userAvatarUrl: mockUsers['max-aventureiro'].avatarUrl, title: 'Colorindo o Espaço Sideral', type: 'Colorir', price: 39.90, likes: 20, imageUrl: '/images/product-coloring-book.png', bgColor: 'var(--color-jackboo-blue-lightest)' },
  { id: 7, userId: 'sophia-criativa', userSlug: 'sophia-criativa', userName: 'Sophia Criativa', userAvatarUrl: mockUsers['sophia-criativa'].avatarUrl, title: 'A Máquina do Tempo Mágica', type: 'História', price: 39.90, likes: 28, imageUrl: '/images/book.png', bgColor: 'var(--color-jackboo-green-lightest)' },
  { id: 8, userId: 'sophia-criativa', userSlug: 'sophia-criativa', userName: 'Sophia Criativa', userAvatarUrl: mockUsers['sophia-criativa'].avatarUrl, title: 'Amigos da Floresta para Colorir', type: 'Colorir', price: 39.90, likes: 17, imageUrl: '/images/product-coloring-book.png', bgColor: 'var(--color-jackboo-pink-lightest)' },
   { id: 9, userId: 'dino-desenhista', userSlug: 'dino-desenhista', userName: 'Dino Desenhista', userAvatarUrl: mockUsers['dino-desenhista'].avatarUrl, title: 'O Vulcão Divertido', type: 'História', price: 39.90, likes: 33, imageUrl: '/images/book.png', bgColor: 'var(--color-jackboo-blue-lightest)' },
   { id: 10, userId: 'dino-desenhista', userSlug: 'dino-desenhista', userName: 'Dino Desenhista', userAvatarUrl: mockUsers['dino-desenhista'].avatarUrl, title: 'Dinossauros para Colorir', type: 'Colorir', price: 39.90, likes: 40, imageUrl: '/images/product-coloring-book.png', bgColor: 'var(--color-jackboo-green-lightest)' },
    { id: 11, userId: 'pequeno-artista', userSlug: 'pequeno-artista', userName: 'Pequeno Artista', userAvatarUrl: mockUsers['pequeno-artista'].avatarUrl, title: 'O Robô Amigo', type: 'História', price: 39.90, likes: 9, imageUrl: '/images/book.png', bgColor: 'var(--color-jackboo-orange-lightest)' },
    { id: 12, userId: 'livia-colorida', userSlug: 'livia-colorida', userName: 'Lívia Colorida', userAvatarUrl: mockUsers['livia-colorida'].avatarUrl, title: 'Desenhos do Céu', type: 'Colorir', price: 39.90, likes: 28, imageUrl: '/images/product-coloring-book.png', bgColor: 'var(--color-jackboo-lilac-light)' },
];


const FriendsShopPage = () => {
  // Estado para os filtros ativos (simples mock)
  const [activeFilters, setActiveFilters] = useState({
      type: [], // Ex: ['História', 'Colorir']
      ageGroup: 'all', // Ex: '0-3', '4-6', '7+', 'all'
  });

  // Função placeholder para aplicar filtros (não implementada neste mock)
  const handleFilterChange = (newFilters) => {
      // Em uma app real, você atualizaria o estado dos filtros aqui
      console.log("Filtros mudaram:", newFilters);
      // setActiveFilters(newFilters);
  };

  // Lógica de filtragem dos livros (simples mock)
  const filteredBooks = allFriendsBooks.filter(book => {
      const user = mockUsers[book.userId];
      if (!user) return false; // Garante que o usuário do livro exista

      // Filtrar por tipo (se houver filtros de tipo selecionados)
      if (activeFilters.type.length > 0 && !activeFilters.type.includes(book.type)) {
          return false;
      }

      // Filtrar por faixa etária do autor (se não for 'all')
      if (activeFilters.ageGroup !== 'all' && user.ageGroup !== activeFilters.ageGroup) {
          return false;
      }

      return true; // Inclui o livro se passar por todos os filtros
  });


  return (
    <main className={styles.main}>
       {/* Confetes adaptados do ShopPage */}
        <Confetti />

      <div className={styles.container}>
        <h1 className={styles.pageTitle}>
            Explore a <span className={styles.highlight}>Lojinha</span> dos Amigos!
        </h1>
        <div className={styles.shopLayout}>
          {/* Passa a função de filtro para a Sidebar (mock) */}
          <FriendsShopSidebar onFilterChange={handleFilterChange} />
          {/* Passa a lista de livros filtrada para o Grid */}
          <FriendsProductGrid products={filteredBooks} />
        </div>
      </div>
    </main>
  );
};

// Componente para os confetes de fundo (adaptado)
const Confetti = () => {
    const confettiPieces = Array.from({ length: 25 }); // Mais confetes
    const colors = ['#FF8C00', '#5bbde4', '#E0F2F7', '#FFB35E', '#FF0000', '#E0A174', '#E8F7E0', '#F7E0E8', '#E2D0F0']; // Mais cores
    return (
        <div className={styles.confettiWrapper}>
            {confettiPieces.map((_, i) => {
                const style = {
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 5 + 5}s`, // Duração entre 5s e 10s
                animationDelay: `${Math.random() * 8}s`, // Atraso maior
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                width: `${Math.random() * 6 + 8}px`, // Tamanhos variados
                height: `${Math.random() * 12 + 16}px`,
                opacity: `${Math.random() * 0.4 + 0.6}`, // Opacidade variada
                };
                return <span key={i} className={styles.confettiPiece} style={style}></span>;
            })}
        </div>
    );
};


export default FriendsShopPage;