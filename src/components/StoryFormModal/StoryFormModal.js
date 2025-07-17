// src/components/StoryFormModal/StoryFormModal.js
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './StoryFormModal.module.css';

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
  hidden: { y: "-50%", x: "-50%", opacity: 0, scale: 0.9 },
  visible: { y: "-50%", x: "-50%", opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 150, damping: 20 } },
  exit: { y: "-50%", x: "-50%", opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};
const storyStyles = ['Aventura', 'Mistério', 'Suspense', 'Fantasia', 'Comédia', 'Fábula'];

const StoryFormModal = ({ show, onClose, onComplete, characterImage }) => {
  const [storyData, setStoryData] = useState({
    characterName: '',
    otherCharacters: '',
    location: '',
    style: 'Aventura',
    specialMessage: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoryData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados da História:", storyData);
    alert("Sua história está sendo criada!");
    onComplete();
  };

  if (!show) return null;

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div className={styles.backdrop} variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}>
          <motion.div className={styles.modal} variants={modalVariants} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.characterPreview}>
                <Image src={characterImage} alt="Seu personagem gerado" width={150} height={150} />
              </div>
              <h2>Minha história JackBoo</h2>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label><span>🧸</span> Nome do meu personagem (meu desenho):</label>
                <input type="text" name="characterName" value={storyData.characterName} onChange={handleChange} placeholder="Ex: Jackzinho, Estelinha, Dino Max..." />
              </div>
              <div className={styles.formGroup}>
                <label><span>📌</span> Outros personagens da história:</label>
                <input type="text" name="otherCharacters" value={storyData.otherCharacters} onChange={handleChange} placeholder="Ex: meu irmão, uma fada, um robô..." />
              </div>
              <div className={styles.formGroup}>
                <label><span>🎭</span> Lugar onde acontece:</label>
                <textarea name="location" value={storyData.location} onChange={handleChange} placeholder="Ex: floresta encantada, castelo, fundo do mar..." rows={2}></textarea>
              </div>
              <div className={styles.formGroup}>
                <label><span>🎨</span> Estilo da história (escolha um):</label>
                <div className={styles.radioGroup}>
                  {storyStyles.map(style => (
                    <div key={style} className={styles.radioOption}>
                      <input type="radio" id={style} name="style" value={style} checked={storyData.style === style} onChange={handleChange} />
                      <label htmlFor={style}>{style}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label><span>💬</span> Mensagem especial (opcional):</label>
                <textarea name="specialMessage" value={storyData.specialMessage} onChange={handleChange} placeholder="Frase ou ideia que não pode faltar na história (até 120 caracteres)" rows={3} maxLength={120}></textarea>
              </div>

              <motion.button type="submit" className={styles.submitButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Criar Livro
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoryFormModal;