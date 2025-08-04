// src/components/CharacterCreator/CharacterCreator.js

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react'; // Importei useCallback
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CharacterCreator.module.css';
import { FaCamera, FaImages, FaCheck, FaBookOpen, FaBook, FaSpinner, FaHourglassHalf, FaTimesCircle, FaQuestionCircle } from 'react-icons/fa';
import InfoModal from '../InfoModal/InfoModal';
import WarningModal from '../WarningModal/WarningModal';
import StoryFormModal from '../StoryFormModal/StoryFormModal';
import { useAuth } from '@/contexts/AuthContext';
import { authService, contentService } from '@/services/api'; 

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
  const fileInputRef = useRef(null);

  const [step1Substate, setStep1Substate] = useState('upload');
  const [currentStep, setCurrentStep] = useState(1);
  const [characterName, setCharacterName] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [createdCharacterId, setCreatedCharacterId] = useState(null); 
  const [isNamingLoading, setIsNamingLoading] = useState(false);
  const [isBookCreating, setIsBookCreating] = useState(false); 
  const [isBookGenerating, setIsBookGenerating] = useState(false); 
  const [generatedBookData, setGeneratedBookData] = useState(null); 
  const [generationProgress, setGenerationProgress] = useState({ totalPages: 0, completedPages: 0 }); 

  const [isInitialInfoModalOpen, setIsInitialInfoModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Efeito para monitorar o progresso da geração do livro
  useEffect(() => {
    let intervalId;
    if (isBookGenerating && generatedBookData && generatedBookData.id) {
        console.log(`[CharacterCreator] Iniciando polling para o livro ID: ${generatedBookData.id}`);
        intervalId = setInterval(async () => {
            try {
                const bookData = await contentService.getBookStatus(generatedBookData.id); 
                
                setGeneratedBookData(bookData); 
                
                const pages = bookData.variations?.[0]?.pages || [];
                const completedPages = pages.filter(p => p.status === 'completed').length;
                const totalPages = bookData.variations?.[0]?.pageCount || 0;
                setGenerationProgress({ totalPages, completedPages });

                const allPagesSuccessfullyCompleted = pages.every(p => p.status === 'completed');
                const anyPageFailed = pages.some(p => p.status === 'failed');

                if (bookData.status === 'privado' || bookData.status === 'publicado') {
                    if (allPagesSuccessfullyCompleted) {
                        console.log(`[CharacterCreator] Livro ${generatedBookData.id} gerado com sucesso, todas as páginas prontas!`);
                        setIsBookGenerating(false); 
                        onCreationComplete(bookData); // Procede para o preview SOMENTE se TODAS as páginas estiverem completas
                        clearInterval(intervalId);
                    } else if (anyPageFailed) {
                        console.error(`[CharacterCreator] Geração do livro ${generatedBookData.id} concluída com falhas em algumas páginas.`);
                        alert('Algumas páginas do seu livro não puderam ser geradas. Por favor, tente novamente ou entre em contato com o suporte.');
                        setIsBookGenerating(false); 
                        clearInterval(intervalId);
                    }
                } else if (bookData.status === 'falha_geracao') {
                    console.error(`[CharacterCreator] Falha geral na geração do livro ${generatedBookData.id}.`);
                    alert('Ocorreu um erro crítico ao gerar seu livro. Por favor, tente novamente mais tarde.');
                    setIsBookGenerating(false); 
                    clearInterval(intervalId);
                }

            } catch (error) {
                console.error(`[CharacterCreator] Erro no polling do livro ${generatedBookData.id}:`, error);
                if (error.message.includes('401')) { 
                    console.log("[CharacterCreator] Erro 401 no polling, a sessão pode ter expirado. Executando logout.");
                }
                alert(`Ocorreu um erro ao verificar o progresso do seu livro: ${error.message}.`);
                setIsBookGenerating(false);
                clearInterval(intervalId);
            }
        }, 5000);
    }
    
    return () => {
        if (intervalId) {
            clearInterval(intervalId);
            console.log(`[CharacterCreator] Limpando polling para o livro ${generatedBookData?.id}`);
        }
    };
  }, [isBookGenerating, generatedBookData, onCreationComplete]); 

  // Efeito para chamar a API de criação após selecionar o arquivo e estar logado
  useEffect(() => {
    if (selectedFile && !isAuthLoading) {
      if (user) {
        submitCharacter(selectedFile);
      } else {
        setIsInitialInfoModalOpen(true);
      }
    }
  }, [selectedFile, isAuthLoading, user]);

  // Efeito para avançar de 'reveal' para 'naming'
  useEffect(() => {
    if (step1Substate === 'reveal') {
      const timer = setTimeout(() => {
        setStep1Substate('naming');
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [step1Substate]);

  const submitCharacter = async (file) => {
    if (!file) {
      alert("Nenhum arquivo selecionado para upload.");
      return;
    }

    setStep1Substate('loading');
    
    const formData = new FormData();
    formData.append('drawing', file, file.name);

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
      if (selectedFile) {
        submitCharacter(selectedFile);
      }
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
    setGeneratedImageUrl('');
    setSelectedFile(null);
    setCreatedCharacterId(null);
    setStep1Substate('upload');
    setIsBookGenerating(false); 
    setGeneratedBookData(null);
    setGenerationProgress({ totalPages: 0, completedPages: 0 });

    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleWarningConfirm = () => {
    setIsWarningModalOpen(false);
    setIsStoryModalOpen(true); // Abre o modal da história
  };

  // ✅ ATUALIZADO: Função para lidar com a conclusão do formulário de história
  const handleStoryFormComplete = async ({ theme, summary }) => {
    setIsStoryModalOpen(false); // Fecha o modal da história
    if (!createdCharacterId) {
      alert("Erro: ID do personagem não encontrado.");
      return;
    }
    
    setIsBookCreating(true); // Indica que a criação do livro está em progresso
    try {
      // Chama o serviço para criar o livro de história
      const result = await contentService.createStoryBook({
        characterIds: [createdCharacterId],
        theme,
        summary
      });
      setGeneratedBookData(result.book); // Salva os dados do livro gerado para o polling
      setIsBookGenerating(true); // Ativa o estado de geração do livro, que agora terá uma tela dedicada
      
    } catch (error) {
      console.error(`[ContentService] Erro ao iniciar a criação do livro de história: ${error.message}`);
      alert(`Falha ao iniciar a criação do livro de história: ${error.message}`);
    } finally {
      setIsBookCreating(false); // Finaliza o estado de criação do livro
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
        {isBookGenerating ? (
            <motion.div
                key="book-generating-full-screen"
                className={styles.bookGeneratingContainer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}
            >
                <Confetti /> 
                <LoadingSpinner /> 
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5 } }}
                    className={styles.generationMessage}
                >
                    Uhuul! ✨ Seu livro mágico está sendo criado!<br/>
                    {generationProgress.totalPages > 0 && `Página ${generationProgress.completedPages} de ${generationProgress.totalPages}...`}
                </motion.p>
            </motion.div>
        ) : (
          <motion.div
              key="main-content-flow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
              <AnimatePresence mode="wait">
                  {/* Estado de Revelação do Personagem (Passo 1.1) */}
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
                  
                  {/* Estados Principais (Upload, Loading, Naming) do Passo 1 */}
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
                              {step1Substate === 'upload' || step1Substate === 'loading' ? (
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
                                            <FaCamera/><span>{isAuthLoading ? 'Verificando...' : 'Tirar Foto'}</span>
                                          </motion.button>
                                          <motion.button className={styles.secondaryButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => fileInputRef.current.click()} disabled={isAuthLoading}>
                                            <FaImages/><span>{isAuthLoading ? 'Verificando...' : 'Galeria'}</span>
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

                  {/* Passo 2: Escolha do Tipo de Livro */}
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
                                  disabled={isBookCreating || isBookGenerating} 
                              >
                                  {isBookCreating || isBookGenerating ? 'Criando...' : 'Criar'}
                              </motion.button>
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
            </motion.div>
        )}
      </AnimatePresence>

      {/* Modais */}
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
        onComplete={handleStoryFormComplete} // ✅ ATUALIZADO: Passa o handler para o StoryFormModal
        characterImage={generatedImageUrl || '/images/character-placeholder.png'} 
      />
    </>
  );
};

export default CharacterCreator;

//teset