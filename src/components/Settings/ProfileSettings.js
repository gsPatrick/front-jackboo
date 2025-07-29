// src/components/Settings/ProfileSettings.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProfileSettings.module.css';
// Adicionado FaTimes aqui
import { FaCamera, FaImages, FaSave, FaEdit, FaCheckCircle, FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { authService, contentService } from '@/services/api';

const ProfileSettings = () => {
    const router = useRouter();
    const { user: loggedInUser, updateUserProfile: updateAuthUserProfile } = useAuth();

    const [editingName, setEditingName] = useState(false);
    const [userName, setUserName] = useState(loggedInUser?.nickname || '');
    const [tempUserName, setTempUserName] = useState(loggedInUser?.nickname || '');
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState(loggedInUser?.avatarUrl || '/images/default-avatar.png');
    const [selectedDrawingId, setSelectedDrawingId] = useState(null);
    const [drawings, setDrawings] = useState([]);
    
    const [isSavingName, setIsSavingName] = useState(false);
    const [isSavingAvatar, setIsSavingAvatar] = useState(false);
    const [avatarSaved, setAvatarSaved] = useState(false);
    const [isLoadingDrawings, setIsLoadingDrawings] = useState(true);
    const [drawingsError, setDrawingsError] = useState(null);

    const carouselRef = useRef(null);

    useEffect(() => {
        const fetchCharacters = async () => {
            setIsLoadingDrawings(true);
            setDrawingsError(null);
            try {
                const characters = await contentService.getMyCharacters();
                setDrawings(characters);
            } catch (err) {
                console.error("Erro ao buscar personagens:", err);
                setDrawingsError("Não foi possível carregar seus personagens.");
            } finally {
                setIsLoadingDrawings(false);
            }
        };

        if (loggedInUser) {
            fetchCharacters();
        }
    }, [loggedInUser]);

    useEffect(() => {
        setUserName(loggedInUser?.nickname || '');
        setTempUserName(loggedInUser?.nickname || '');
        setCurrentAvatarUrl(loggedInUser?.avatarUrl || '/images/default-avatar.png');
    }, [loggedInUser]);


    const handleSaveName = async () => {
         if (tempUserName.trim() === '' || tempUserName.trim() === userName) {
             alert("O nome não pode ser vazio ou igual ao atual.");
             return;
         }
        setIsSavingName(true);
        try {
            const updatedProfile = await authService.updateUserProfile({ nickname: tempUserName.trim() });
            updateAuthUserProfile({ nickname: updatedProfile.nickname });
            setUserName(updatedProfile.nickname);
            setEditingName(false);
            alert("Apelido atualizado com sucesso!");
        } catch (err) {
            console.error("Erro ao salvar apelido:", err);
            alert(err.message || "Erro ao salvar apelido. Tente novamente.");
        } finally {
            setIsSavingName(false);
        }
    };

     const handleCancelEditName = () => {
         setTempUserName(userName);
         setEditingName(false);
     }

    const handleSelectDrawing = (drawingId, imageUrl) => {
        if (selectedDrawingId === drawingId) {
             setSelectedDrawingId(null);
             setCurrentAvatarUrl(loggedInUser?.avatarUrl || '/images/default-avatar.png');
        } else {
            setSelectedDrawingId(drawingId);
            setCurrentAvatarUrl(imageUrl);
             setAvatarSaved(false);
        }
    };

     const handleSaveAvatar = async () => {
         if (!selectedDrawingId) {
             alert("Nenhum desenho selecionado para avatar.");
             return;
         }
         if (currentAvatarUrl === (loggedInUser?.avatarUrl || '/images/default-avatar.png')) {
             alert("Este já é o seu avatar atual.");
             return;
         }

         setIsSavingAvatar(true);
         try {
             const updatedProfile = await authService.updateUserProfile({ avatarUrl: currentAvatarUrl });
             updateAuthUserProfile({ avatarUrl: updatedProfile.avatarUrl });
             setAvatarSaved(true);
             alert("Avatar atualizado com sucesso!");
             setTimeout(() => setAvatarSaved(false), 3000);
             setSelectedDrawingId(null);
         } catch (err) {
             console.error("Erro ao salvar avatar:", err);
             alert(err.message || "Erro ao salvar avatar. Tente novamente.");
         } finally {
             setIsSavingAvatar(false);
         }
     };


     const handleUploadDrawing = () => {
         router.push('/create-character');
     };

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 200;
            carouselRef.current.scrollBy({
                left: direction * scrollAmount,
                behavior: 'smooth',
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

            <div className={styles.infoSection}>
                <div className={styles.avatarWrapper}>
                    <Image
                        src={currentAvatarUrl}
                        alt="Seu Avatar"
                        width={150}
                        height={150}
                        className={styles.avatarImage}
                        onError={(e) => { e.target.src = '/images/jackboo-full-logo-placeholder.png'; }} // Fallback
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
                                disabled={isSavingName}
                            />
                            <motion.button
                                className={styles.saveNameButton}
                                onClick={handleSaveName}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={isSavingName || tempUserName.trim() === '' || tempUserName.trim() === userName}
                            >
                                {isSavingName ? '...' : <FaCheckCircle />}
                            </motion.button>
                             <motion.button
                                 className={styles.cancelEditNameButton}
                                 onClick={handleCancelEditName}
                                 whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={isSavingName}
                             >
                                <FaTimes />
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

            <div className={styles.gallerySection}>
                 <h3 className={styles.galleryTitle}>Escolha um desenho para ser seu Avatar:</h3>

                 {isLoadingDrawings ? (
                    <div className={styles.loadingMessage}>Carregando desenhos...</div>
                 ) : drawingsError ? (
                    <p className={styles.errorMessage}>{drawingsError}</p>
                 ) : drawings.length === 0 ? (
                     <p className={styles.emptyMessage}>Você ainda não tem desenhos salvos na sua galeria.</p>
                 ) : (
                    <div className={styles.carouselContainer}>
                        <motion.button
                            className={`${styles.navButton} ${styles.navLeft}`}
                             onClick={() => scrollCarousel(-1)}
                             whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                             <FaArrowLeft size={20} />
                        </motion.button>

                        <div ref={carouselRef} className={styles.carouselWrapper}>
                            <AnimatePresence initial={false}>
                                {drawings.map(drawing => (
                                    <motion.div
                                        key={drawing.id}
                                        className={`${styles.drawingThumbnailWrapper} ${selectedDrawingId === drawing.id ? styles.selected : ''}`}
                                         onClick={() => handleSelectDrawing(drawing.id, drawing.generatedCharacterUrl || drawing.originalDrawingUrl)}
                                         whileHover={{ scale: 1.05, rotate: selectedDrawingId === drawing.id ? 0 : 2 }}
                                        whileTap={{ scale: 0.95 }}
                                         layout
                                    >
                                        <Image
                                            src={drawing.generatedCharacterUrl || drawing.originalDrawingUrl || '/images/jackboo-full-logo-placeholder.png'}
                                            alt={`Desenho: ${drawing.name}`}
                                            width={100}
                                            height={100}
                                            className={styles.drawingThumbnail}
                                            onError={(e) => { e.target.src = '/images/jackboo-full-logo-placeholder.png'; }} // Fallback
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

                        <motion.button
                             className={`${styles.navButton} ${styles.navRight}`}
                             onClick={() => scrollCarousel(1)}
                              whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                             <FaArrowRight size={20} />
                        </motion.button>
                    </div>
                 )}

                <motion.button
                     className={styles.saveAvatarButton}
                     onClick={handleSaveAvatar}
                     disabled={isSavingAvatar || !selectedDrawingId || currentAvatarUrl === (loggedInUser?.avatarUrl || '/images/default-avatar.png')}
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                >
                    {isSavingAvatar ? 'Salvando...' : 'Salvar Avatar Selecionado'}
                </motion.button>

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