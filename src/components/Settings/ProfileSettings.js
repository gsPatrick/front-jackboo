// src/components/Settings/ProfileSettings.js
'use client';

import React, { useState, useRef } from 'react'; // Importar useRef
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProfileSettings.module.css';
import { FaCamera, FaImages, FaSave, FaEdit, FaCheckCircle, FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Importar setas

// Mock Data: Usuário e Desenhos Criados
const mockUser = {
    nickname: 'Pequeno Artista', // Nickname/Nome de usuário
    fullName: 'Arthur Silva', // Nome completo (usado em privacidade)
    avatarUrl: '/images/character-generated.png', // Avatar atual
    drawings: [ // Galeria de desenhos/personagens criados
        { id: 'char-1', imageUrl: '/images/character-generated.png', name: 'Herói Mágico' },
        { id: 'char-2', imageUrl: '/images/bear-upload.png', name: 'Urso Desenho' },
        { id: 'char-3', imageUrl: '/images/jackboo-sad.png', name: 'JackBoo Triste' },
        { id: 'char-4', imageUrl: '/images/how-it-works/step3-character.png', name: 'Personagem JackBoo' },
         { id: 'char-5', imageUrl: '/images/club-jackboo-hero.png', name: 'JackBoo Herói' },
         { id: 'char-6', imageUrl: '/images/friends-jackboo.png', name: 'Amigos JackBoo' },
          { id: 'char-7', imageUrl: '/images/how-it-works/step1-draw.png', name: 'Desenho Original' },
           { id: 'char-8', imageUrl: '/images/hero-jackboo.png', name: 'JackBoo Herói Pose' },
            { id: 'char-9', imageUrl: '/images/character-generated.png', name: 'Herói Mágico 2' }, // Mais alguns para simular scroll
             { id: 'char-10', imageUrl: '/images/bear-upload.png', name: 'Urso Desenho 2' },
    ]
};


const ProfileSettings = () => {
    const router = useRouter();
    const [editingName, setEditingName] = useState(false);
    const [userName, setUserName] = useState(mockUser.nickname); // Usar nickname aqui
    const [tempUserName, setTempUserName] = useState(mockUser.nickname);
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState(mockUser.avatarUrl);
    const [selectedDrawingId, setSelectedDrawingId] = useState(null);

    const [avatarSaved, setAvatarSaved] = useState(false);

     // Ref para o contêiner do carrossel para controlar a rolagem
    const carouselRef = useRef(null);


    const handleSaveName = () => {
         if (tempUserName.trim() === '') {
             alert("O nome não pode ser vazio.");
             return;
         }
        setUserName(tempUserName.trim());
        setEditingName(false);
        // TODO: Implementar lógica para salvar o nome no backend/estado global
        console.log("Nickname salvo:", tempUserName.trim());
    };

     const handleCancelEditName = () => {
         setTempUserName(userName);
         setEditingName(false);
     }

    const handleSelectDrawing = (drawingId, imageUrl) => {
        if (selectedDrawingId === drawingId) {
             setSelectedDrawingId(null);
             setCurrentAvatarUrl(mockUser.avatarUrl);
        } else {
            setSelectedDrawingId(drawingId);
            setCurrentAvatarUrl(imageUrl);
             setAvatarSaved(false);
        }
    };

     const handleSaveAvatar = () => {
         if (selectedDrawingId) {
             // A imagem já está em currentAvatarUrl por causa da pré-visualização
             // TODO: Implementar lógica para salvar o novo avatar (currentAvatarUrl) no backend/estado global
             console.log("Novo avatar salvo:", currentAvatarUrl, "do desenho ID:", selectedDrawingId);

             // Simula salvamento e mostra feedback visual
             setAvatarSaved(true);
             setTimeout(() => setAvatarSaved(false), 3000);

             // Opcional: Manter a seleção ou resetar após salvar
             // setSelectedDrawingId(null); // Descomente para resetar a seleção após salvar
         } else {
             console.log("Nenhum desenho selecionado para avatar.");
         }
     };


     const handleUploadDrawing = () => {
         router.push('/create-character'); // Redireciona
         console.log("Redirecionando para Criar Personagem");
     };

     // Função para rolar o carrossel
    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 200; // Quantidade de pixels para rolar
            carouselRef.current.scrollBy({
                left: direction * scrollAmount,
                behavior: 'smooth', // Rolagem suave
            });
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.profileContainer}
        >
            <h2 className={styles.sectionTitle}>Meu Perfil</h2>

            {/* --- Seção de Nome e Avatar --- */}
            <div className={styles.infoSection}>
                <div className={styles.avatarWrapper}>
                    <Image
                        src={currentAvatarUrl}
                        alt="Seu Avatar"
                        width={150}
                        height={150}
                        className={styles.avatarImage}
                    />
                     <AnimatePresence>
                         {avatarSaved && (
                             <motion.div
                                 key="avatar-saved-feedback"
                                 className={styles.avatarSavedFeedback}
                                 initial={{ opacity: 0, scale: 0.8 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 exit={{ opacity: 0, scale: 0.8 }}
                                 transition={{ duration: 0.3 }}
                             >
                                 <FaCheckCircle size={30} /> Salvo!
                             </motion.div>
                         )}
                     </AnimatePresence>
                </div>
                <div className={styles.nameSection}>
                    {editingName ? (
                        <div className={styles.nameInputGroup}>
                            <input
                                type="text"
                                value={tempUserName}
                                onChange={(e) => setTempUserName(e.target.value)}
                                onKeyPress={(e) => { if (e.key === 'Enter') handleSaveName(); }}
                                className={styles.nameInput}
                                placeholder="Novo apelido..."
                                autoFocus
                            />
                            <motion.button
                                className={styles.saveNameButton}
                                onClick={handleSaveName}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 9.9 }}
                                disabled={tempUserName.trim() === '' || tempUserName.trim() === userName}
                            >
                                <FaCheckCircle />
                            </motion.button>
                             <motion.button
                                 className={styles.cancelEditNameButton}
                                 onClick={handleCancelEditName}
                                 whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                             >
                                X
                             </motion.button>
                        </div>
                    ) : (
                        <div className={styles.currentName}>
                            <span className={styles.userName}>{userName}</span>
                             <motion.button
                                 className={styles.editNameButton}
                                 onClick={() => setEditingName(true)}
                                 whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaEdit />
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>

             <hr className={styles.divider} />

             {/* --- Seção de Galeria de Desenhos (AGORA CARROSSEL) --- */}
            <div className={styles.gallerySection}>
                 <h3 className={styles.galleryTitle}>Escolha um desenho para ser seu Avatar:</h3>

                 {mockUser.drawings.length === 0 ? (
                     <p className={styles.emptyMessage}>Você ainda não tem desenhos salvos na sua galeria.</p>
                 ) : (
                    <div className={styles.carouselContainer}> {/* Container para o carrossel e botões */}
                        {/* Botões de navegação */}
                         <motion.button
                            className={`${styles.navButton} ${styles.navLeft}`}
                             onClick={() => scrollCarousel(-1)} // Rola para a esquerda
                             whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                             <FaArrowLeft size={20} />
                        </motion.button>

                         {/* O wrapper que será o carrossel */}
                        <div ref={carouselRef} className={styles.carouselWrapper}>
                            <AnimatePresence initial={false}> {/* initial={false} para evitar animações na montagem */}
                                {mockUser.drawings.map(drawing => (
                                    <motion.div
                                        key={drawing.id}
                                        className={`${styles.drawingThumbnailWrapper} ${selectedDrawingId === drawing.id ? styles.selected : ''}`}
                                         onClick={() => handleSelectDrawing(drawing.id, drawing.imageUrl)}
                                         whileHover={{ scale: 1.05, rotate: selectedDrawingId === drawing.id ? 0 : 2 }}
                                        whileTap={{ scale: 0.95 }}
                                         layout // Ajuda com animações de layout
                                    >
                                        <Image
                                            src={drawing.imageUrl}
                                            alt={`Desenho: ${drawing.name}`}
                                            width={100} // Tamanho do thumbnail no carrossel
                                            height={100}
                                            className={styles.drawingThumbnail}
                                        />
                                         {selectedDrawingId === drawing.id && (
                                             <motion.div
                                                 className={styles.selectedOverlay}
                                                 initial={{ opacity: 0, scale: 0.5 }}
                                                 animate={{ opacity: 1, scale: 1 }}
                                                 exit={{ opacity: 0, scale: 0.5 }}
                                             >
                                                 <FaCheckCircle size={30} />
                                             </motion.div>
                                         )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                         {/* Botões de navegação */}
                        <motion.button
                             className={`${styles.navButton} ${styles.navRight}`}
                             onClick={() => scrollCarousel(1)} // Rola para a direita
                              whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                             <FaArrowRight size={20} />
                        </motion.button>
                    </div>
                 )}

                {/* Botão para salvar o avatar selecionado */}
                <motion.button
                     className={styles.saveAvatarButton}
                     onClick={handleSaveAvatar}
                     disabled={!selectedDrawingId || currentAvatarUrl === mockUser.avatarUrl}
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                >
                    Salvar Avatar Selecionado
                </motion.button>

                {/* Botão para fazer upload de um novo desenho */}
                <motion.button
                    className={styles.uploadNewDrawingButton}
                    onClick={handleUploadDrawing}
                     whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaImages /> Upload Novo Desenho
                </motion.button>

             </div>

        </motion.div>
    );
};

export default ProfileSettings;