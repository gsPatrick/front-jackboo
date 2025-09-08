// src/components/CharacterCreator/CharacterCreator.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CharacterCreator.module.css';
import { FaCamera, FaImages, FaSpinner } from 'react-icons/fa';
import InfoModal from '../InfoModal/InfoModal';
import WarningModal from '../WarningModal/WarningModal';
import StoryFormModal from '../StoryFormModal/StoryFormModal';
import { useAuth } from '@/contexts/AuthContext';
import { authService, contentService } from '@/services/api';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'https://geral-jackboo.r954jc.easypanel.host';
const APP_URL = 'https://geral-jackboo.r954jc.easypanel.host';

// Componente Spinner de Carregamento
const LoadingSpinner = () => (
    <motion.div className={styles.spinnerWrapper} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className={styles.spinner}></div>
      <p>Criando a mágica...</p>
    </motion.div>
);

// Componente Confetes
const Confetti = () => {
  const confettiPieces = Array.from({ length: 20 });
  const colors = ['var(--color-jackboo-primary-orange)', 'var(--color-jackboo-blue-lightest)', 'var(--color-jackboo-green-lightest)', 'var(--color-jackboo-light-orange)', 'var(--color-jackboo-lilac-light)'];

  return (
    <div className={styles.confettiOverlay}>
      {confettiPieces.map((_, i) => {
        const style = {
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 4}s`,
          animationDelay: `${Math.random() * 5}s`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        };
        return <span key={i} className={styles.confettiPiece} style={style}></span>;
      })}
    </div>
  );
};

// Variantes para transição suave entre os PRINCIPAIS sub-estados do Passo 1
const mainStep1Variants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
};

const CharacterCreator = ({ onCreationComplete }) => {
  const { user, login, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [step1Substate, setStep1Substate] = useState('upload');
  const [currentStep, setCurrentStep] = useState(1);
  const [characterName, setCharacterName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [createdCharacterId, setCreatedCharacterId] = useState(null);
  const [isNamingLoading, setIsNamingLoading] = useState(false);
  const [isBookCreating, setIsBookCreating] = useState(false);

  const [isInitialInfoModalOpen, setIsInitialInfoModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (step1Substate === 'reveal') {
      const timer = setTimeout(() => {
        setStep1Substate('naming');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step1Substate]);

  const submitCharacter = async () => {
    if (!selectedFile) {
      alert("Por favor, selecione um arquivo para upload.");
      return;
    }
    if (!characterDescription.trim()) {
      alert("Por favor, escreva uma pequena descrição para o seu personagem.");
      return;
    }

    setStep1Substate('loading');
    
    const formData = new FormData();
    formData.append('drawing', selectedFile, selectedFile.name);
    formData.append('description', characterDescription);

    try {
      const newCharacter = await contentService.createCharacter(formData);
      
      console.log('Personagem criado com sucesso:', newCharacter);
      setCreatedCharacterId(newCharacter.id);

      if (newCharacter.generatedCharacterUrl && newCharacter.generatedCharacterUrl.startsWith('/uploads')) {
        setGeneratedImageUrl(`${APP_URL}${newCharacter.generatedCharacterUrl}`);
      } else {
        setGeneratedImageUrl('/images/character-placeholder.png');
        console.warn("URL da imagem gerada é inválida:", newCharacter.generatedCharacterUrl);
      }
      
      setStep1Substate('reveal');
    } catch (error) {
      console.error(`[CharacterCreator] Erro ao criar personagem: ${error.message}`);
      alert(`Falha ao criar o personagem: ${error.message}`);
      handleTryAgain();
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setSelectedFile(file);
      if (!isAuthLoading && !user) {
        setIsInitialInfoModalOpen(true);
      }
    }
  };

  const handleInitialInfoComplete = async (formData) => {
    setIsRegistering(true);
    try {
      const registrationData = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        nickname: formData.name.split(' ')[0] + Math.floor(Math.random() * 100),
        password: 'password123',
      };
      await authService.register(registrationData);
      const loginData = await authService.login(registrationData.email, registrationData.password);
      login(loginData.user, loginData.token);
      
      setIsInitialInfoModalOpen(false);
    } catch (error) {
      console.error(`[ContentService] Erro no fluxo de cadastro/criação: ${error.message}`);
      alert(`Falha no processo: ${error.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleInitialInfoClose = () => {
    setIsInitialInfoModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl('');
    setStep1Substate('upload');
  };

  const handleCreateCharacter = async () => {
    if (!characterName || characterName.trim() === '' || !createdCharacterId) {
      alert("Por favor, digite um nome para o seu personagem.");
      return;
    }
    
    setIsNamingLoading(true);
    try {
      await contentService.updateCharacterName(createdCharacterId, characterName.trim());
      console.log(`Nome do personagem ${createdCharacterId} atualizado para: ${characterName.trim()}`);
      setCurrentStep(2);
    } catch (error) {
      console.error(`[ContentService] Erro ao atualizar o nome do personagem: ${error.message}`);
      alert(`Não foi possível salvar o nome: ${error.message}`);
    } finally {
      setIsNamingLoading(false);
    }
  };

  const handleTryAgain = () => {
    setCharacterName('');
    setCharacterDescription('');
    setGeneratedImageUrl('');
    setSelectedFile(null);
    setPreviewUrl('');
    setCreatedCharacterId(null);
    setStep1Substate('upload');

    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };
  
  const handleCreateColoringBook = async () => {
    if (!createdCharacterId) {
      alert("Erro: ID do personagem não encontrado.");
      return;
    }
    
    setIsBookCreating(true);
    try {
      const result = await contentService.createColoringBook({
        characterIds: [createdCharacterId],
        theme: "Aventura Divertida" // Pode ser customizável no futuro
      });
      onCreationComplete(result.book);
    } catch (error) {
      console.error(`[ContentService] Erro ao criar livro de colorir: ${error.message}`);
      alert(`Falha ao criar o livro de colorir: ${error.message}`);
    } finally {
      setIsBookCreating(false);
    }
  };

  const handleWarningConfirm = () => {
    setIsWarningModalOpen(false);
    setIsStoryModalOpen(true);
  };

  const handleStoryFormComplete = async ({ theme, summary }) => {
    setIsStoryModalOpen(false);
    if (!createdCharacterId) {
      alert("Erro: ID do personagem não encontrado.");
      return;
    }
    
    setIsBookCreating(true);
    try {
      const result = await contentService.createStoryBook({
        characterIds: [createdCharacterId],
        theme,
        summary
      });
      onCreationComplete(result.book);
    } catch (error) {
      console.error(`[ContentService] Erro ao criar livro de história: ${error.message}`);
      alert(`Falha ao criar livro de história: ${error.message}`);
    } finally {
      setIsBookCreating(false);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <AnimatePresence mode="wait">
        <motion.div
            key="main-content-flow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
            <AnimatePresence mode="wait">
                {step1Substate === 'reveal' && currentStep === 1 && (
                    <motion.div
                        key="reveal-state-single"
                        className={styles.characterRevealContainer}
                        variants={mainStep1Variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                         <Confetti />
                         <motion.div
                             animate={{ y: ['0%', '-3%', '0%'], rotate: [-0.5, 0.5, -0.5] }}
                             transition={{ y: { duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }, rotate: { duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } }}
                         >
                             <Image src={generatedImageUrl || '/images/character-placeholder.png'} alt="Seu Personagem Mágico!" width={400} height={400} className={styles.characterRevealImage} unoptimized />
                         </motion.div>
                         <motion.p
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5 } }}
                             className={styles.revealMessage}
                         >
                             Uau! Você me deu vida...<br/>Estou pronto para viver grandes aventuras com você!
                         </motion.p>
                    </motion.div>
                )}
                
                {(currentStep === 1 && step1Substate !== 'reveal') && (
                    <motion.div
                        key="main-step1-grid"
                         className={styles.grid}
                         variants={mainStep1Variants}
                         initial="initial"
                         animate="animate"
                         exit="exit"
                    >
                        <div className={styles.leftColumn}>
                            {previewUrl && step1Substate === 'upload' ? (
                                <Image src={previewUrl} alt="Preview do seu desenho" width={300} height={300} className={styles.mainImage} />
                            ) : (step1Substate === 'upload' || step1Substate === 'loading') ? (
                                <Image src="/images/bear-upload.png" alt="JackBoo pedindo para enviar um desenho" width={300} height={300} className={styles.mainImage} />
                            ) : (step1Substate === 'naming') && (
                                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                                     <Image src={generatedImageUrl || '/images/character-placeholder.png'} alt="Personagem gerado" width={250} height={250} className={styles.mainImage} unoptimized />
                                </motion.div>
                            )}

                            <div className={styles.actionButtons}>
                                {step1Substate === 'upload' && (
                                    <>
                                        <motion.button className={styles.primaryButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => fileInputRef.current.click()} disabled={isAuthLoading}>
                                          <FaImages/><span>{isAuthLoading ? 'Verificando...' : 'Escolher Desenho'}</span>
                                        </motion.button>
                                    </>
                                )}
                                 {step1Substate === 'naming' && (
                                     <motion.button
                                         className={styles.secondaryButton}
                                         whileHover={{ scale: 1.05 }}
                                         whileTap={{ scale: 0.95 }}
                                         onClick={handleTryAgain}
                                     >
                                         Tentar Novamente
                                     </motion.button>
                                )}
                            </div>
                            
                            {step1Substate === 'upload' && selectedFile && (
                                <motion.button
                                    className={styles.mainCtaButton}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={submitCharacter}
                                    disabled={!characterDescription.trim()}
                                >
                                    Gerar Personagem
                                </motion.button>
                            )}

                            {step1Substate === 'naming' && (
                                <motion.button
                                    className={styles.mainCtaButton}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCreateCharacter}
                                    disabled={!characterName || characterName.trim() === '' || isNamingLoading}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                                >
                                    {isNamingLoading ? 'Salvando nome...' : 'Confirmar Nome'}
                                </motion.button>
                            )}
                        </div>

                        <div className={`${styles.rightColumn} ${styles.nameCard}`}>
                            <AnimatePresence mode="wait">
                                {step1Substate === 'upload' && (
                                    <motion.div key="upload-card" className={styles.generatedContent} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <label htmlFor="characterDescription" className={styles.nameLabel}>Descreva seu personagem!</label>
                                        <textarea
                                            id="characterDescription"
                                            className={styles.nameInput}
                                            value={characterDescription}
                                            onChange={(e) => setCharacterDescription(e.target.value)}
                                            placeholder="Ex: um coelho azul com um chapéu de pirata e um sorriso amigável"
                                            rows={4}
                                        />
                                        <p className={styles.helperText}>Quanto mais detalhes, mais mágico será o resultado!</p>
                                    </motion.div>
                                )}
                                {step1Substate === 'loading' && <LoadingSpinner key="loading-card" />}
                                {step1Substate === 'naming' && (
                                    <motion.div key="naming-card-input" className={styles.generatedContent} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                                        <label htmlFor="characterName" className={styles.nameLabel}>Qual será o nome dele?</label>
                                        <input
                                            id="characterName"
                                            type="text"
                                            className={styles.nameInput}
                                            value={characterName}
                                            onChange={(e) => setCharacterName(e.target.value)}
                                            placeholder="Digite o nome aqui..."
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {currentStep === 2 && (
                    <motion.div key="step2" className={styles.productChoiceGrid} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                        <div className={styles.productCard}>
                            <h3 className={styles.productTitle}>Livro de Colorir</h3>
                            <Image src="/images/book-coloring.png" alt="Livro de Colorir" width={180} height={180}/>
                            <p className={styles.productDescription}>Use o desenho da criança para gerar um livro cheio de páginas para colorir</p>
                            <motion.button
                                className={styles.productButton}
                                onClick={handleCreateColoringBook}
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                disabled={isBookCreating}
                            >
                                {isBookCreating ? 'Criando...' : 'Criar'}
                            </motion.button>
                        </div>
                        <div className={styles.productCard}>
                            <h3 className={styles.productTitle}>História Ilustrada</h3>
                            <Image src="/images/book-story.png" alt="História Ilustrada" width={180} height={180}/>
                            <p className={styles.productDescription}>Transforme seu personagem em uma história ilustrada e personalizada.</p>
                            <motion.button className={styles.productButton} onClick={() => setIsWarningModalOpen(true)} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} disabled={isBookCreating}>
                              {isBookCreating ? 'Aguarde...' : 'Conte sua história'}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <InfoModal
        show={isInitialInfoModalOpen}
        onClose={handleInitialInfoClose}
        onComplete={handleInitialInfoComplete}
        isCompleting={isRegistering}
      />
      <WarningModal
        show={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        onConfirm={handleWarningConfirm}
      />
      <StoryFormModal
        show={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        onComplete={handleStoryFormComplete}
        characterImage={generatedImageUrl || '/images/character-placeholder.png'}
      />
    </>
  );
};

export default CharacterCreator;