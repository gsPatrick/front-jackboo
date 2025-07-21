// src/components/CharacterCreator/CharacterCreator.js

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CharacterCreator.module.css';
import { FaCamera, FaImages, FaCheck } from 'react-icons/fa';
import InfoModal from '../InfoModal/InfoModal';
import StoryFormModal from '../StoryFormModal/StoryFormModal';
import WarningModal from '../WarningModal/WarningModal';
import { useAuth } from '@/contexts/AuthContext';
import { authService, contentService } from '@/services/api';

const API_BASE_URL = 'https://geral-jackboo.r954jc.easypanel.host';

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
  const fileInputRef = useRef(null);

  const [step1Substate, setStep1Substate] = useState('upload');
  const [currentStep, setCurrentStep] = useState(1);
  const [characterName, setCharacterName] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [isInitialInfoModalOpen, setIsInitialInfoModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const submitCharacter = async (file) => {
    if (!file) {
      alert("Nenhum arquivo selecionado para upload.");
      return;
    }

    setStep1Substate('loading');
    
    // CORREÇÃO: Criação robusta do FormData
    const formData = new FormData();
    // O nome do campo 'drawing' DEVE corresponder ao que o Multer espera no backend.
    formData.append('drawing', file, file.name);

    try {
      const newCharacter = await contentService.createCharacter(formData);
      
      console.log('Personagem criado com sucesso:', newCharacter);
      // REMOVIDO: O nome do personagem não é mais definido automaticamente.
      // setCharacterName(newCharacter.name);

      // CORREÇÃO: Construção da URL completa para exibição
      if (newCharacter.generatedCharacterUrl && newCharacter.generatedCharacterUrl.startsWith('/uploads')) {
        setGeneratedImageUrl(`${API_BASE_URL}${newCharacter.generatedCharacterUrl}`);
      } else {
        setGeneratedImageUrl('/images/character-placeholder.png');
        console.warn("URL da imagem gerada é inválida:", newCharacter.generatedCharacterUrl);
      }
      
      setStep1Substate('reveal');
    } catch (error) {
      console.error("Erro ao criar personagem:", error);
      alert(`Falha ao criar o personagem: ${error.message}`);
      handleTryAgain();
    }
  };

  useEffect(() => {
    if (selectedFile && !isAuthLoading) {
      if (user) {
        submitCharacter(selectedFile);
      } else {
        setIsInitialInfoModalOpen(true);
      }
    }
  }, [selectedFile, isAuthLoading, user]);

  useEffect(() => {
    if (step1Substate === 'reveal') {
      const timer = setTimeout(() => {
        setStep1Substate('naming');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step1Substate]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Arquivo selecionado pelo usuário:", file);
      setSelectedFile(file);
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
      console.error("Erro no fluxo de cadastro/criação:", error);
      alert(`Falha no processo: ${error.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleInitialInfoClose = () => {
    setIsInitialInfoModalOpen(false);
    setSelectedFile(null);
  };

  const handleCreateCharacter = () => {
    if (characterName && characterName.trim() !== '') {
      setCurrentStep(2);
    }
  };

  const handleTryAgain = () => {
    setCharacterName('');
    setGeneratedImageUrl('');
    setSelectedFile(null);
    setStep1Substate('upload');
  };

  const handleWarningConfirm = () => {
    setIsWarningModalOpen(false);
    setIsStoryModalOpen(true);
  };

  const handleStoryFormComplete = () => {
    setIsStoryModalOpen(false);
    onCreationComplete();
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
        {currentStep === 1 && (
            <motion.div
                key="step1-main-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <AnimatePresence mode="wait">
                    {step1Substate === 'reveal' ? (
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
                    ) : (
                        <motion.div
                            key="grid-state-single"
                             className={styles.grid}
                             variants={mainStep1Variants}
                             initial="initial"
                             animate="animate"
                             exit="exit"
                        >
                            <div className={styles.leftColumn}>
                                {step1Substate === 'upload' || step1Substate === 'loading' ? (
                                    <Image src="/images/bear-upload.png" alt="JackBoo pedindo para enviar um desenho" width={300} height={300} className={styles.mainImage} />
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                                         <Image src={generatedImageUrl || '/images/character-placeholder.png'} alt="Personagem gerado" width={250} height={250} className={styles.mainImage} unoptimized />
                                    </motion.div>
                                )}

                                {step1Substate === 'upload' && (
                                    <motion.div className={styles.actionButtons} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                        <motion.button className={styles.primaryButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => fileInputRef.current.click()} disabled={isAuthLoading}>
                                          <FaCamera/><span>{isAuthLoading ? 'Verificando...' : 'Tirar Foto'}</span>
                                        </motion.button>
                                        <motion.button className={styles.secondaryButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => fileInputRef.current.click()} disabled={isAuthLoading}>
                                          <FaImages/><span>{isAuthLoading ? 'Verificando...' : 'Galeria'}</span>
                                        </motion.button>
                                    </motion.div>
                                )}

                                {step1Substate === 'naming' && (
                                     <motion.div className={styles.actionButtons} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                         <motion.button
                                             className={styles.secondaryButton}
                                             whileHover={{ scale: 1.05 }}
                                             whileTap={{ scale: 0.95 }}
                                             onClick={handleTryAgain}
                                         >
                                             Tentar Novamente
                                         </motion.button>
                                     </motion.div>
                                 )}

                                {step1Substate === 'naming' && (
                                    <motion.button
                                        className={styles.mainCtaButton}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCreateCharacter}
                                        disabled={!characterName || characterName.trim() === ''}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                                    >
                                        Criar Livro
                                    </motion.button>
                                )}
                            </div>

                            <div className={`${styles.rightColumn} ${styles.nameCard}`}>
                                <AnimatePresence mode="wait">
                                    {step1Substate === 'upload' && (
                                        <motion.div key="upload-card" className={styles.placeholderText} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            Envie ou tire uma foto do seu desenho para começar a mágica!
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
                </AnimatePresence>
            </motion.div>
        )}

        {currentStep === 2 && (
            <motion.div key="step2" className={styles.productChoiceGrid} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <div className={styles.productCard}>
                    <h3 className={styles.productTitle}>Livro de Colorir</h3>
                    <Image src="/images/book-coloring.png" alt="Livro de Colorir" width={180} height={180}/>
                    <p className={styles.productDescription}>Use o desenho da criança para gerar um livro cheio de páginas para colorir</p>
                    <motion.button className={styles.productButton} onClick={onCreationComplete} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Criar</motion.button>
                </div>
                <div className={styles.productCard}>
                    <h3 className={styles.productTitle}>História Ilustrada</h3>
                    <Image src="/images/book-story.png" alt="História Ilustrada" width={180} height={180}/>
                    <p className={styles.productDescription}>Transforme seu personagem em uma história ilustrada e personalizada.</p>
                    <motion.button className={styles.productButton} onClick={() => setIsWarningModalOpen(true)} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Conte sua história</motion.button>
                </div>
            </motion.div>
        )}
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
        characterImage="/images/character-generated.png"
      />
    </>
  );
};

export default CharacterCreator;