// src/app/profile/[slug]/page.js
'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation'; // Importar o hook useParams
import styles from './page.module.css';
import { FaBirthdayCake, FaPen, FaTrophy, FaGamepad, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import CharacterDetailModal from '@/components/CharacterDetailModal/CharacterDetailModal';

// --- DADOS MOCKADOS ENRIQUECIDOS ---
const mockUsers = {
  'pequeno-artista': {
    name: 'Pequeno Artista',
    slug: 'pequeno-artista',
    avatarUrl: '/images/character-generated.png',
    birthDate: '15/07/2018',
    bio: 'Amo desenhar dinossauros, robôs e criar histórias de aventura no espaço!',
    createdCharacters: [
      { id: 'char1', name: 'Robô-Tron', imageUrl: '/images/character-generated.png' },
      { id: 'char2', name: 'Dino-Max', imageUrl: '/images/how-it-works/step1-draw.png' },
      { id: 'char3', name: 'Astro-Boo', imageUrl: '/images/hero-jackboo.png' },
      { id: 'char4', name: 'Urso Polar', imageUrl: '/images/bear-upload.png' },
      { id: 'char5', name: 'Dragão Fofinho', imageUrl: '/images/club-jackboo-hero.png' },
      { id: 'char6', name: 'Super Gato', imageUrl: '/images/friends-jackboo.png' },
    ],
    competitions: {
      participating: [
        { id: 'summer-challenge', name: 'Desafio de Verão', status: 'Semifinais' }
      ],
      won: [
        { id: 'art-cup-2024', name: 'JackBoo Art Cup 2024', rank: 1 },
        { id: 'monsters-cup', name: 'Copa dos Monstrinhos', rank: 3 }
      ]
    }
  },
  'livia-colorida': {
      name: 'Lívia Colorida',
      slug: 'livia-colorida',
      avatarUrl: '/images/jackboo-sad.png',
      birthDate: '01/01/2019',
      bio: 'Minha paixão é colorir flores e borboletas. Quero pintar o mundo todo!',
      createdCharacters: [
          { id: 'char_liv_1', name: 'Fada Flora', imageUrl: '/images/friends-jackboo.png' },
          { id: 'char_liv_2', name: 'Borboleta Brilhante', imageUrl: '/images/jackboo-coloring.png' },
      ],
      competitions: {
          participating: [],
          won: [
              { id: 'spring-cup', name: 'Copa da Primavera', rank: 2 }
          ]
      }
  }
};

const mockUserBooks = [
  { id: 1, userId: 'pequeno-artista', title: 'Aventura do Robô-Tron', type: 'História', price: 39.90, likes: 15, imageUrl: '/images/book.png', bgColor: 'var(--color-jackboo-blue-lightest)' },
  { id: 2, userId: 'pequeno-artista', title: 'Colorindo o Dino-Max', type: 'Colorir', price: 39.90, likes: 22, imageUrl: '/images/product-coloring-book.png', bgColor: 'var(--color-jackboo-green-lightest)' },
  { id: 3, userId: 'pequeno-artista', title: 'O Herói do Meu Quarto', type: 'História', price: 39.90, likes: 8, imageUrl: '/images/book.png', bgColor: 'var(--color-jackboo-pink-lightest)' },
  { id: 4, userId: 'pequeno-artista', title: 'Criaturas Fantásticas', type: 'Colorir', price: 39.90, likes: 25, imageUrl: '/images/product-coloring-book.png', bgColor: 'var(--color-jackboo-orange-lightest)' },
  { id: 9, userId: 'livia-colorida', title: 'Flores e Borboletas', type: 'Colorir', price: 39.90, likes: 55, imageUrl: '/images/product-coloring-book.png', bgColor: 'var(--color-jackboo-blue-lightest)' },
  { id: 10, userId: 'livia-colorida', title: 'O Jardim da Fada Flora', type: 'História', price: 39.90, likes: 30, imageUrl: '/images/book.png', bgColor: 'var(--color-jackboo-green-lightest)' },
];


// --- VARIANTES DE ANIMAÇÃO ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 18 } },
  exit: { opacity: 0, y: -50, scale: 0.8, transition: { duration: 0.3 } },
};


// --- Componente/Lógica de Botão de Like ---
const LikeButton = ({ initialLikes }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const handleLike = () => {
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
      transition={
        liked
          ? { duration: 0.4, type: 'spring', stiffness: 300 }
          : { type: 'spring', stiffness: 400, damping: 10 }
      }
    >
      <svg
        className={`${styles.heartIcon} ${liked ? styles.liked : ''}`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
        2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 
        4.5 2.09C13.09 3.81 14.76 3 16.5 3 
        19.58 3 22 5.42 22 8.5c0 3.78-3.4 
        6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <span>{likesCount}</span>
    </motion.div>
  );
};


// --- Componente principal da página ---
export default function ProfilePage() {
  const params = useParams(); // CORREÇÃO: Usar o hook
  const { slug } = params;
  const user = mockUsers[slug];

  const [activeTab, setActiveTab] = useState('História');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user ? user.bio : '');
  
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const charactersCarouselRef = useRef(null);
  const booksCarouselRef = useRef(null);

  if (!user) {
    return <main className={styles.main}><div className={styles.container}><p className={styles.emptyMessage}>Usuário não encontrado!</p></div></main>;
  }

  const userBooks = mockUserBooks.filter(book => book.userId === slug);
  const filteredBooks = userBooks.filter(book => book.type === activeTab);

  const handleSaveBio = () => {
    user.bio = bioText;
    setIsEditingBio(false);
  };

  const handleOpenModal = (character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };

  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = ref.current.offsetWidth * 0.8;
      ref.current.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
    }
  };

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <motion.h1 className={styles.pageTitle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            Meu Espaço <span className={styles.highlight}>JackBoo</span>
          </motion.h1>

          <motion.section className={styles.userInfo} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className={styles.avatarWrapper}>
              <Image src={user.avatarUrl} alt={`Avatar de ${user.name}`} width={150} height={150} className={styles.avatarImage} />
            </div>
            <div className={styles.userDetails}>
              <h2 className={styles.userName}>{user.name}</h2>
              <div className={styles.bioSection}>
                {isEditingBio ? (
                  <textarea className={styles.bioTextarea} value={bioText} onChange={(e) => setBioText(e.target.value)} maxLength={150} />
                ) : (
                  <p className={styles.bioText}>"{bioText || 'Clique no lápis para adicionar uma bio divertida!'}"</p>
                )}
                {isEditingBio ? (
                  <motion.button className={styles.editBioButton} onClick={handleSaveBio} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Salvar</motion.button>
                ) : (
                  <motion.button className={styles.editBioButton} onClick={() => setIsEditingBio(true)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><FaPen /></motion.button>
                )}
              </div>
              <p><FaBirthdayCake className={styles.detailIcon} /> Nascido em: {user.birthDate}</p>
            </div>
          </motion.section>
          
          <hr className={styles.sectionDivider} />

          <motion.section className={styles.extraSection} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <h2 className={styles.sectionTitle}>Meus Personagens</h2>
              <div className={styles.carouselContainer}>
                <motion.button className={styles.navArrow} onClick={() => scrollCarousel(charactersCarouselRef, -1)} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}><FaArrowLeft/></motion.button>
                <div className={styles.characterGallery} ref={charactersCarouselRef}>
                    {user.createdCharacters.map(char => (
                        <motion.div key={char.id} className={styles.characterCard} whileHover={{ y: -5, scale: 1.05 }} onClick={() => handleOpenModal(char)}>
                            <Image src={char.imageUrl} alt={char.name} width={100} height={100} className={styles.characterImage} />
                            <span className={styles.characterName}>{char.name}</span>
                        </motion.div>
                    ))}
                </div>
                <motion.button className={styles.navArrow} onClick={() => scrollCarousel(charactersCarouselRef, 1)} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}><FaArrowRight/></motion.button>
              </div>
          </motion.section>

          <hr className={styles.sectionDivider} />

          <motion.section className={styles.extraSection} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
               <h2 className={styles.sectionTitle}>Minhas Competições</h2>
               <div className={styles.competitionsGrid}>
                   <div className={styles.competitionColumn}>
                       <h3 className={styles.competitionTitle}><FaGamepad /> Em Andamento</h3>
                       {user.competitions.participating.length > 0 ? (
                           user.competitions.participating.map(comp => (
                               <div key={comp.id} className={styles.competitionCard}>
                                   <span className={styles.competitionName}>{comp.name}</span>
                                   <span className={styles.competitionStatus}>{comp.status}</span>
                               </div>
                           ))
                       ) : <p className={styles.emptyMessageSmall}>Nenhuma competição em andamento.</p>}
                   </div>
                   <div className={styles.competitionColumn}>
                       <h3 className={styles.competitionTitle}><FaTrophy /> Troféus</h3>
                       {user.competitions.won.length > 0 ? (
                           user.competitions.won.map(comp => (
                               <div key={comp.id} className={styles.competitionCard}>
                                   <span className={styles.competitionName}>{comp.name}</span>
                                   <span className={`${styles.competitionRank} ${styles[`rank${comp.rank}`]}`}>
                                       {comp.rank}º Lugar <FaTrophy />
                                   </span>
                               </div>
                           ))
                       ) : <p className={styles.emptyMessageSmall}>Participe para ganhar troféus!</p>}
                   </div>
               </div>
          </motion.section>

          <hr className={styles.sectionDivider} />

          <motion.section className={styles.booksSection} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
              <h2 className={styles.sectionTitle}>Meus Livros Mágicos</h2>
              <div className={styles.tabsContainer}>
                <motion.button className={`${styles.tabButton} ${activeTab === 'História' ? styles.active : ''}`} onClick={() => setActiveTab('História')}>Livros de História</motion.button>
                <motion.button className={`${styles.tabButton} ${activeTab === 'Colorir' ? styles.active : ''}`} onClick={() => setActiveTab('Colorir')}>Livros de Colorir</motion.button>
              </div>
              
              {filteredBooks.length === 0 ? (
                  <p className={styles.emptyMessage}>Você ainda não criou nenhum livro de {activeTab.toLowerCase()}.</p>
              ) : (
                  <div className={styles.booksCarouselContainer}>
                      <motion.button className={styles.navArrow} onClick={() => scrollCarousel(booksCarouselRef, -1)} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}><FaArrowLeft/></motion.button>
                      <div className={styles.booksGallery} ref={booksCarouselRef}>
                          {filteredBooks.map(book => (
                              <motion.div key={book.id} className={styles.bookCard} whileHover={{ scale: 1.03, y: -5 }} style={{ backgroundColor: book.bgColor || 'white' }}>
                                  <div className={styles.bookCoverWrapper}><Image src={book.imageUrl} alt={`Capa: ${book.title}`} width={200} height={250} className={styles.bookCover} /></div>
                                  <h3 className={styles.bookTitle}>{book.title}</h3>
                                  <p className={styles.bookPrice}>R$ {book.price.toFixed(2).replace('.', ',')}</p>
                                  <div className={styles.cardActions}>
                                    <LikeButton initialLikes={book.likes} />
                                    <motion.button className={styles.viewBookButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Ver Livro</motion.button>
                                  </div>
                              </motion.div>
                          ))}
                      </div>
                      <motion.button className={styles.navArrow} onClick={() => scrollCarousel(booksCarouselRef, 1)} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}><FaArrowRight/></motion.button>
                  </div>
              )}
          </motion.section>
        </div>
      </main>
      
      {isModalOpen && (
          <CharacterDetailModal 
              character={selectedCharacter} 
              userBooks={userBooks} 
              onClose={handleCloseModal} 
          />
      )}
    </>
  );
}