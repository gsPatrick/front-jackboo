// src/app/profile/[slug]/page.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import styles from './page.module.css';
import { FaBirthdayCake, FaPen, FaTrophy, FaGamepad, FaArrowLeft, FaArrowRight, FaHeart } from 'react-icons/fa';
import CharacterDetailModal from '@/components/CharacterDetailModal/CharacterDetailModal';
import { useAuth } from '@/contexts/AuthContext';
import { authService, contentService, shopService, popularityService } from '@/services/api';

// --- VARIANTES DE ANIMAÇÃO ---
const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 18 } },
  exit: { opacity: 0, y: -50, scale: 0.8, transition: { duration: 0.3 } },
};

// --- Componente/Lógica de Botão de Like ---
const LikeButton = ({ likableType, likableId, initialLikes, initialUserLiked, isAuthenticated }) => {
  const [liked, setLiked] = useState(initialUserLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isUpdatingLike, setIsUpdatingLike] = useState(false);

  useEffect(() => {
    setLiked(initialUserLiked);
    setLikesCount(initialLikes);
  }, [initialLikes, initialUserLiked]);


  const handleLike = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
        alert("Faça login para curtir livros e personagens!");
        return;
    }
    if (isUpdatingLike) return;

    setIsUpdatingLike(true);
    try {
        const result = await popularityService.toggleLike(likableType, likableId);
        setLiked(result.liked);
        setLikesCount(prev => result.liked ? prev + 1 : prev - 1);
    } catch (error) {
        console.error("Erro ao curtir:", error);
        alert("Erro ao curtir. Tente novamente.");
    } finally {
        setIsUpdatingLike(false);
    }
  };

  return (
    <motion.div
      className={`${styles.likesWrapper} ${isUpdatingLike ? styles.disabled : ''}`}
      onClick={handleLike}
      whileTap={{ scale: 0.9 }}
      animate={liked ? { scale: [1, 1.2, 1] } : {}}
      transition={
        liked
          ? { duration: 0.4, type: 'spring', stiffness: 300 }
          : { type: 'spring', stiffness: 400, damping: 10 }
      }
    >
      <FaHeart className={`${styles.heartIcon} ${liked ? styles.liked : ''}`} />
      <span>{likesCount}</span>
    </motion.div>
  );
};


// --- Componente principal da página ---
export default function ProfilePage() {
  const params = useParams();
  const { slug } = params;
  // CORREÇÃO AQUI: Destruturar updateUserProfile diretamente do useAuth()
  const { user: loggedInUser, isLoading: authLoading, token, updateUserProfile } = useAuth(); 

  const [profileUser, setProfileUser] = useState(null);
  const [userCharacters, setUserCharacters] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('historia'); // Corrigido para 'historia' e 'colorir' (backend Enum)
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const charactersCarouselRef = useRef(null);
  const booksCarouselRef = useRef(null);

  const isMyProfile = loggedInUser && loggedInUser.slug === slug;

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoadingProfile(true);
      setError(null);
      try {
        let fetchedUser = null;
        let fetchedCharacters = [];
        let fetchedBooks = [];

        if (isMyProfile) {
          fetchedUser = await authService.getUserProfile();
          fetchedCharacters = await contentService.getMyCharacters();
          fetchedBooks = await contentService.getMyBooks();
        } else {
          // Para outros perfis, a API de perfil pública `/users/:slug` não existe.
          // Vamos assumir que `profileUser` para perfis públicos terá apenas `nickname`, `avatarUrl`, `slug` e `birthDate`.
          // Os outros dados (personagens, livros) não seriam acessíveis sem autenticação
          // e sem uma rota específica para isso no backend.
          // Para demonstração, usaremos o mock para simular esses dados.
          const mockPublicUsers = {
            'pequeno-artista': {
              id: 1, nickname: 'Pequeno Artista', fullName: 'Arthur Silva', avatarUrl: '/images/character-generated.png',
              birthDate: '2018-07-15', bio: 'Amo desenhar dinossauros, robôs e criar histórias de aventura no espaço!',
              slug: 'pequeno-artista', email: 'pequeno@email.com', phone: '9999999999', isSystemUser: false
            },
            'livia-colorida': {
              id: 2, nickname: 'Lívia Colorida', fullName: 'Livia Oliveira', avatarUrl: '/images/jackboo-sad.png',
              birthDate: '2019-01-01', bio: 'Minha paixão é colorir flores e borboletas. Quero pintar o mundo todo!',
              slug: 'livia-colorida', email: 'livia@email.com', phone: '9999999999', isSystemUser: false
            }
          };
          fetchedUser = mockPublicUsers[slug];
          // Para perfis públicos, os personagens e livros viriam de rotas específicas (ex: /users/:id/characters, /users/:id/books)
          // Que não existem no backend. Então, para demo, usaremos os mocks que filtram pelo userId do mock.
          const mockCharactersData = [
            { id: 'char1', userId: 1, name: 'Robô-Tron', originalDrawingUrl: '/images/character-generated.png', generatedCharacterUrl: '/images/character-generated.png' },
            { id: 'char2', userId: 1, name: 'Dino-Max', originalDrawingUrl: '/images/how-it-works/step1-draw.png', generatedCharacterUrl: '/images/how-it-works/step1-draw.png' },
            { id: 'char_liv_1', userId: 2, name: 'Fada Flora', originalDrawingUrl: '/images/friends-jackboo.png', generatedCharacterUrl: '/images/friends-jackboo.png' },
            { id: 'char_liv_2', userId: 2, name: 'Borboleta Brilhante', originalDrawingUrl: '/images/jackboo-coloring.png', generatedCharacterUrl: '/images/jackboo-coloring.png' },
          ];
          const mockBooksData = [
            { id: 1, authorId: 1, title: 'Aventura do Robô-Tron', type: 'historia', variations: [{ price: 39.90, coverUrl: '/images/book.png' }], totalLikes: 15, userLiked: false },
            { id: 2, authorId: 1, title: 'Colorindo o Dino-Max', type: 'colorir', variations: [{ price: 39.90, coverUrl: '/images/product-coloring-book.png' }], totalLikes: 22, userLiked: false },
            { id: 9, authorId: 2, title: 'Flores e Borboletas', type: 'colorir', variations: [{ price: 39.90, coverUrl: '/images/product-coloring-book.png' }], totalLikes: 55, userLiked: false },
            { id: 10, authorId: 2, title: 'O Jardim da Fada Flora', type: 'historia', variations: [{ price: 39.90, coverUrl: '/images/book.png' }], totalLikes: 30, userLiked: false },
          ];
          if (fetchedUser) {
              fetchedCharacters = mockCharactersData.filter(char => char.userId === fetchedUser.id);
              fetchedBooks = mockBooksData.filter(book => book.authorId === fetchedUser.id);
              // Mockar likes e isSystemUser para books se o fetchedUser for mockado
              fetchedBooks = await Promise.all(fetchedBooks.map(async book => {
                  const likesData = await popularityService.getLikesCount('Book', book.id);
                  return {
                      ...book,
                      totalLikes: likesData.totalLikes,
                      userLiked: likesData.userLiked,
                      author: { isSystemUser: false } // Mock para autores de amigos
                  };
              }));
          }
        }
        
        setProfileUser(fetchedUser);
        setUserCharacters(fetchedCharacters);
        setUserBooks(fetchedBooks);
        setBioText(fetchedUser?.bio || '');

      } catch (err) {
        console.error("Erro ao carregar dados do perfil:", err);
        setError(err.message || 'Erro ao carregar dados do perfil.');
      } finally {
        setLoadingProfile(false);
      }
    };

    if (!authLoading && slug) {
      fetchProfileData();
    }
  }, [slug, authLoading, isMyProfile, loggedInUser?.slug, loggedInUser, updateUserProfile]); // Adicionado updateUserProfile nas dependências

  const userCompetitions = {
      participating: [
        { id: 'summer-challenge', name: 'Desafio de Verão', status: 'Semifinais' }
      ],
      won: [
        { id: 'art-cup-2024', name: 'JackBoo Art Cup 2024', rank: 1 },
        { id: 'monsters-cup', name: 'Copa dos Monstrinhos', rank: 3 }
      ]
  };

  const filteredBooks = userBooks.filter(book => book.type === activeTab);

  const handleSaveBio = async () => {
    if (bioText.trim() === '') {
        alert("A bio não pode ser vazia.");
        return;
    }
    if (!isMyProfile) return;

    try {
        const updatedProfile = await authService.updateUserProfile({ bio: bioText });
        // CORREÇÃO AQUI: Chamar updateUserProfile diretamente
        updateUserProfile({ bio: updatedProfile.bio }); 
        setIsEditingBio(false);
        alert("Bio atualizada com sucesso!");
    } catch (err) {
        console.error("Erro ao salvar bio:", err);
        alert(err.message || "Erro ao salvar a bio. Tente novamente.");
    }
  };

  const handleCancelEditBio = () => {
    setBioText(profileUser?.bio || '');
    setIsEditingBio(false);
  };

  const handleOpenModal = (character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCharacter(null);
    setIsModalOpen(false);
  };

  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = ref.current.offsetWidth * 0.8;
      ref.current.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
    }
  };

  if (loadingProfile || authLoading) {
    return <main className={styles.main}><div className={styles.container}><p className={styles.loadingMessage}>Carregando perfil mágico...</p></div></main>;
  }

  if (error || !profileUser) {
    return <main className={styles.main}><div className={styles.container}><p className={styles.emptyMessage}>{error || 'Usuário não encontrado!'}</p></div></main>;
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <motion.h1 className={styles.pageTitle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            Meu Espaço <span className={styles.highlight}>JackBoo</span>
          </motion.h1>

          <motion.section className={styles.userInfo} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className={styles.avatarWrapper}>
              <Image 
                src={profileUser.avatarUrl || '/default-avatar.png'} 
                alt={`Avatar de ${profileUser.nickname}`} 
                width={150} 
                height={150} 
                className={styles.avatarImage} 
                onError={(e) => { e.target.src = '/images/jackboo-full-logo-placeholder.png'; }} // Fallback
              />
            </div>
            <div className={styles.userDetails}>
              <h2 className={styles.userName}>{profileUser.nickname}</h2>
              <div className={styles.bioSection}>
                {isEditingBio && isMyProfile ? (
                  <textarea className={styles.bioTextarea} value={bioText} onChange={(e) => setBioText(e.target.value)} maxLength={150} />
                ) : (
                  <p className={styles.bioText}>"{bioText || (isMyProfile ? 'Clique no lápis para adicionar uma bio divertida!' : 'Este usuário ainda não adicionou uma bio.')}"</p>
                )}
                {isMyProfile && (
                    isEditingBio ? (
                      <>
                        <motion.button className={styles.editBioButton} onClick={handleSaveBio} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Salvar</motion.button>
                        <motion.button className={styles.editBioButton} onClick={handleCancelEditBio} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Cancelar</motion.button>
                      </>
                    ) : (
                      <motion.button className={styles.editBioButton} onClick={() => setIsEditingBio(true)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><FaPen /></motion.button>
                    )
                )}
              </div>
              <p><FaBirthdayCake className={styles.detailIcon} /> Nascido em: {new Date(profileUser.birthDate).toLocaleDateString('pt-BR')}</p>
            </div>
          </motion.section>
          
          <hr className={styles.sectionDivider} />

          <motion.section className={styles.extraSection} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <h2 className={styles.sectionTitle}>Meus Personagens</h2>
              {userCharacters.length === 0 ? (
                  <p className={styles.emptyMessageSmall}>Você ainda não criou nenhum personagem. Comece sua aventura agora!</p>
              ) : (
                  <div className={styles.carouselContainer}>
                    <motion.button className={styles.navArrow} onClick={() => scrollCarousel(charactersCarouselRef, -1)} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}><FaArrowLeft/></motion.button>
                    <div className={styles.characterGallery} ref={charactersCarouselRef}>
                        {userCharacters.map(char => (
                            <motion.div key={char.id} className={styles.characterCard} whileHover={{ y: -5, scale: 1.05 }} onClick={() => handleOpenModal(char)}>
                                <Image 
                                    src={char.generatedCharacterUrl || char.originalDrawingUrl || '/images/jackboo-full-logo-placeholder.png'} 
                                    alt={char.name} 
                                    width={100} 
                                    height={100} 
                                    className={styles.characterImage} 
                                    onError={(e) => { e.target.src = '/images/jackboo-full-logo-placeholder.png'; }} // Fallback
                                />
                                <span className={styles.characterName}>{char.name}</span>
                            </motion.div>
                        ))}
                    </div>
                    <motion.button className={styles.navArrow} onClick={() => scrollCarousel(charactersCarouselRef, 1)} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}><FaArrowRight/></motion.button>
                  </div>
              )}
          </motion.section>

          <hr className={styles.sectionDivider} />

          <motion.section className={styles.extraSection} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
               <h2 className={styles.sectionTitle}>Minhas Competições</h2>
               <div className={styles.competitionsGrid}>
                   <div className={styles.competitionColumn}>
                       <h3 className={styles.competitionTitle}><FaGamepad /> Em Andamento</h3>
                       {userCompetitions.participating.length > 0 ? (
                           userCompetitions.participating.map(comp => (
                               <div key={comp.id} className={styles.competitionCard}>
                                   <span className={styles.competitionName}>{comp.name}</span>
                                   <span className={styles.competitionStatus}>{comp.status}</span>
                               </div>
                           ))
                       ) : <p className={styles.emptyMessageSmall}>Nenhuma competição em andamento.</p>}
                   </div>
                   <div className={styles.competitionColumn}>
                       <h3 className={styles.competitionTitle}><FaTrophy /> Troféus</h3>
                       {userCompetitions.won.length > 0 ? (
                           userCompetitions.won.map(comp => (
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
                <motion.button className={`${styles.tabButton} ${activeTab === 'historia' ? styles.active : ''}`} onClick={() => setActiveTab('historia')}>Livros de História</motion.button>
                <motion.button className={`${styles.tabButton} ${activeTab === 'colorir' ? styles.active : ''}`} onClick={() => setActiveTab('colorir')}>Livros de Colorir</motion.button>
              </div>
              
              {filteredBooks.length === 0 ? (
                  <p className={styles.emptyMessage}>Você ainda não criou nenhum livro de {activeTab.toLowerCase()}.</p>
              ) : (
                  <div className={styles.booksCarouselContainer}>
                      <motion.button className={styles.navArrow} onClick={() => scrollCarousel(booksCarouselRef, -1)} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}><FaArrowLeft/></motion.button>
                      <div className={styles.booksGallery} ref={booksCarouselRef}>
                          {filteredBooks.map(book => (
                              <motion.div key={book.id} className={styles.bookCard} whileHover={{ scale: 1.03, y: -5 }} style={{ backgroundColor: book.bgColor || 'white' }}>
                                  <div className={styles.bookCoverWrapper}>
                                      <Image 
                                        src={book.variations?.[0]?.coverUrl || '/images/jackboo-full-logo-placeholder.png'} 
                                        alt={`Capa: ${book.title}`} 
                                        width={200} 
                                        height={250} 
                                        className={styles.bookCover} 
                                        onError={(e) => { e.target.src = '/images/jackboo-full-logo-placeholder.png'; }} // Fallback
                                    />
                                  </div>
                                  <h3 className={styles.bookTitle}>{book.title}</h3>
                                  <p className={styles.bookPrice}>R$ {book.variations?.[0]?.price?.toFixed(2).replace('.', ',')}</p>
                                  <div className={styles.cardActions}>
                                    <LikeButton 
                                        likableType="Book" 
                                        likableId={book.id} 
                                        initialLikes={book.totalLikes} 
                                        initialUserLiked={book.userLiked}
                                        isAuthenticated={!!loggedInUser}
                                    />
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