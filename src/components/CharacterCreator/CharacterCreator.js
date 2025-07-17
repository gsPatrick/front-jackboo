// src/components/CharacterCreator/CharacterCreator.js
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CharacterCreator.module.css';
import { FaCamera, FaImages, FaCheck } from 'react-icons/fa';
import InfoModal from '../InfoModal/InfoModal';
import StoryFormModal from '../StoryFormModal/StoryFormModal';
import WarningModal from '../WarningModal/WarningModal';

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
  // step1Substate: 'upload', 'loading', 'reveal', 'naming'
  const [step1Substate, setStep1Substate] = useState('upload');
  const [currentStep, setCurrentStep] = useState(1); // 1: Passo 1, 2: Escolha de Livro
  const [characterName, setCharacterName] = useState(''); // Nome final do personagem/criança

  // Estado para controlar a abertura do InfoModal NA ETAPA 1 (mantido)
  const [isInitialInfoModalOpen, setIsInitialInfoModalOpen] = useState(false);

  // Estados existentes para outros modais (na Etapa 2)
  // REMOVIDO: const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // Este era o InfoModal NA ETAPA 2
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  // REMOVIDO: Estado para saber qual livro foi escolhido antes do InfoModal (Etapa 2)
  // const [chosenBookType, setChosenBookType] = useState(null);


  // Efeito para controlar o timer da revelação
  useEffect(() => {
    if (step1Substate === 'reveal') {
      const timer = setTimeout(() => {
        setStep1Substate('naming'); // Vai para a etapa de dar nome após a revelação
      }, 5000); // 5 segundos

      return () => clearTimeout(timer);
    }
  }, [step1Substate]);

  // handleUpload AGORA abre o InfoModal inicial (mantido)
  const handleUpload = () => {
    setIsInitialInfoModalOpen(true); // Abre o InfoModal inicial
    // O fluxo continua no onComplete do modal
  };

  // Função callback para quando o InfoModal INICIAL for concluído (mantido)
  const handleInitialInfoComplete = (formData) => { // Recebe os dados do modal
      console.log("Dados iniciais do modal:", formData);
      setIsInitialInfoModalOpen(false); // Fecha o modal inicial
      setCharacterName(formData.name.trim()); // Salva o nome da criança
      // Aqui você pode salvar outros dados do formData se necessário

      setStep1Substate('loading'); // Inicia o estado de loading

      // Simula o upload/processamento após o nome e dados serem confirmados
      setTimeout(() => {
        setStep1Substate('reveal'); // Transita para o estado de revelação
      }, 2500); // Tempo de carregamento simulado
  };

  // Função callback para quando o InfoModal INICIAL for fechado (cancelado) (mantido)
  const handleInitialInfoClose = () => {
      console.log("InfoModal inicial fechado/cancelado");
      setIsInitialInfoModalOpen(false); // Fecha o modal
      // O estado do substate deve permanecer 'upload' se ele clicou em upload e cancelou
      // Não precisa fazer nada aqui, o estado já está como 'upload'
  };


  const handleCreateCharacter = () => {
    // Este botão agora só aparece no subestado 'naming'
    if (characterName.trim() !== '') { // O nome já foi validado e salvo antes
      setCurrentStep(2); // Avança para o Passo 2 (Escolha de Livro)
    }
  };

  // REMOVIDO: Funções que iniciavam o fluxo dos modais na ETAPA 2
  // const handleOpenInfoModalForColoring = () => { ... }
  // const handleOpenInfoModalForStory = () => { ... }
  // REMOVIDO: Lógica de prosseguimento após o InfoModal (ETAPA 2)
  // const handleInfoModalComplete = (formData) => { ... }


  // Confirmação do WarningModal: abre o StoryFormModal (mantida)
  const handleWarningConfirm = () => {
    setIsWarningModalOpen(false);
    setIsStoryModalOpen(true);
  };

  // Finalização do StoryFormModal: vai para o BookPreview (mantida)
  const handleStoryFormComplete = () => {
    setIsStoryModalOpen(false);
    onCreationComplete(); // Vai para o preview
  };

  // Lógica para "Tentar Novamente" (mantida)
  const handleTryAgain = () => {
      console.log("Tentar novamente clicado");
      // Reseta os estados relevantes para voltar à tela inicial do Passo 1
      setCharacterName('');
      setStep1Substate('upload'); // Volta para a tela de upload
  };


  return (
    <>
      <AnimatePresence mode="wait">
        {/* Container principal do Passo 1 */}
        {/* Usamos uma única AnimatePresence e motion.div para o conteúdo principal do Passo 1 */}
        {currentStep === 1 && (
            <motion.div
                key="step1-main-content" // Chave para a AnimatePresence externa
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                {/* --- Conteúdo que muda DENTRO do Passo 1 (Baseado no step1Substate) --- */}
                <AnimatePresence mode="wait">
                    {step1Substate === 'reveal' ? (
                        // --- SUB-ESTADO: REVELAÇÃO (Full-width) ---
                        <motion.div
                            key="reveal-state-single" // Chave única dentro desta AnimatePresence
                            className={styles.characterRevealContainer}
                            variants={mainStep1Variants} // Usa as variantes para a transição
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                             <Confetti />
                             <motion.div
                                 animate={{ y: ['0%', '-3%', '0%'], rotate: [-0.5, 0.5, -0.5] }}
                                 transition={{ y: { duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }, rotate: { duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } }}
                             >
                                 {/* Usando imagem gerada mockada */}
                                 <Image src="/images/character-generated.png" alt="Seu Personagem Mágico!" width={400} height={400} className={styles.characterRevealImage} />
                             </motion.div>
                             <motion.p // Mensagem personalizada com o nome
                                 initial={{ opacity: 0, y: 20 }}
                                 animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5 } }}
                                 className={styles.revealMessage}
                             >
                                 {/* Usa o nome da criança aqui! */}
                                 Oi, <span className={styles.highlightName}>{characterName}</span>! <br/>Estava ansioso pra te conhecer... Vamos brincar juntos?!
                             </motion.p>
                        </motion.div>
                    ) : (
                        // --- SUB-ESTADOS: UPLOAD, LOADING, NAMING (Grid Layout) ---
                         // Renders when not in 'reveal' state
                        <motion.div
                            key="grid-state-single" // Chave única dentro desta AnimatePresence
                             className={styles.grid}
                             variants={mainStep1Variants} // Usa as variantes para a transição
                             initial="initial"
                             animate="animate"
                             exit="exit"
                        >
                            <div className={styles.leftColumn}>
                                {/* Exibe imagem correta dependendo do sub-estado */}
                                {step1Substate === 'upload' || step1Substate === 'loading' ? (
                                    <Image src="/images/bear-upload.png" alt="JackBoo pedindo para enviar um desenho" width={300} height={300} className={styles.mainImage} />
                                ) : ( // step1Substate === 'naming'
                                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                                         <Image src="/images/character-generated.png" alt="Personagem gerado" width={250} height={250} className={styles.mainImage} />
                                    </motion.div>
                                )}

                                {/* Botões de upload só aparecem no subestado 'upload' */}
                                {step1Substate === 'upload' && (
                                    <motion.div className={styles.actionButtons} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                        {/* Alterado onClick para chamar handleUpload diretamente */}
                                        <motion.button className={styles.primaryButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleUpload}><FaCamera/><span>Tirar Foto</span></motion.button>
                                        <motion.button className={styles.secondaryButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleUpload}><FaImages/><span>Galeria</span></motion.button>
                                    </motion.div>
                                )}

                                {/* Botão Tentar Novamente só aparece no subestado 'naming' */}
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

                                {/* Botão principal "Criar Livro" só aparece na etapa 'naming' */}
                                {step1Substate === 'naming' && (
                                    <motion.button
                                        className={styles.mainCtaButton}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCreateCharacter}
                                        disabled={characterName.trim() === ''} // Desabilita se o nome estiver vazio
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                                    >
                                        Criar Livro
                                    </motion.button>
                                )}
                            </div>

                            <div className={`${styles.rightColumn} ${styles.nameCard}`}>
                                {/* AnimatePresence INTERNA para animar o conteúdo DENTRO do NameCard */}
                                <AnimatePresence mode="wait">
                                    {step1Substate === 'upload' && (
                                        <motion.div key="upload-card" className={styles.placeholderText} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            Envie ou tire uma foto do seu desenho para começar a mágica!
                                        </motion.div>
                                    )}
                                    {step1Substate === 'loading' && <LoadingSpinner key="loading-card" />}
                                    {step1Substate === 'naming' && (
                                        <motion.div key="naming-card-input" className={styles.generatedContent} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                                            <label htmlFor="characterName" className={styles.nameLabel}>Nome do seu personagem:</label>
                                            <input
                                                id="characterName"
                                                type="text"
                                                className={styles.nameInput}
                                                value={characterName} // Usa o nome final aqui
                                                onChange={(e) => setCharacterName(e.target.value)} // Permite editar
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

        {/* Passo 2: Escolha do Livro (mantido em outra AnimatePresence pois é um passo diferente) */}
        {currentStep === 2 && (
            <motion.div key="step2" className={styles.productChoiceGrid} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <div className={styles.productCard}>
                    <h3 className={styles.productTitle}>Livro de Colorir</h3>
                    <Image src="/images/book-coloring.png" alt="Livro de Colorir" width={180} height={180}/>
                    <p className={styles.productDescription}>Use o desenho da criança para gerar um livro cheio de páginas para colorir</p>
                    {/* Alterado onClick para chamar onCreationComplete diretamente */}
                    <motion.button className={styles.productButton} onClick={onCreationComplete} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Criar</motion.button>
                </div>
                <div className={styles.productCard}>
                    <h3 className={styles.productTitle}>História Ilustrada</h3>
                    <Image src="/images/book-story.png" alt="História Ilustrada" width={180} height={180}/>
                    <p className={styles.productDescription}>Transforme seu personagem em uma história ilustrada e personalizada.</p>
                    {/* Alterado onClick para chamar setIsWarningModalOpen(true) diretamente */}
                    <motion.button className={styles.productButton} onClick={() => setIsWarningModalOpen(true)} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Conte sua história</motion.button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Modais (renderizados condicionalmente E FORA da AnimatePresence principal do passo) */}
      {/* InfoModal para a etapa INICIAL (Passo 1) (mantido) */}
      <InfoModal
        show={isInitialInfoModalOpen}
        onClose={handleInitialInfoClose} // Usa a função de fechar específica para a etapa inicial
        onComplete={handleInitialInfoComplete} // Usa a função de completar específica para a etapa inicial
      />
      {/* REMOVIDO: InfoModal para a etapa SECUNDÁRIA (Passo 2) */}
      {/*
      <InfoModal
        show={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        onComplete={handleInfoModalComplete}
      />
      */}
      <WarningModal
        show={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        onConfirm={handleWarningConfirm}
      />
      <StoryFormModal
        show={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)} // Corrigido nome da função
        onComplete={handleStoryFormComplete}
        characterImage="/images/character-generated.png" // Passa a imagem gerada mockada
      />
    </>
  );
};

export default CharacterCreator;