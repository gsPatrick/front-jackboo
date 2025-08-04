// src/components/StoryFormModal/StoryFormModal.js
'use client';

import React, { useState } from 'react';
import Modal from 'react-modal';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookOpen } from 'react-icons/fa'; // Importa o ícone
import { toast } from 'react-toastify'; // Importa o toast
import styles from './StoryFormModal.module.css';

Modal.setAppElement('body');

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
  hidden: { y: "-50%", x: "-50%", opacity: 0, scale: 0.9 },
  visible: { y: "-50%", x: "-50%", opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 150, damping: 20 } },
  exit: { y: "-50%", x: "-50%", opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};
const storyStyles = ['Aventura', 'Mistério', 'Suspense', 'Fantasia', 'Comédia', 'Fábula'];

// ✅ ATUALIZADO: onComplete agora recebe os dados do formulário { theme, summary }
export default function StoryFormModal({ show, onClose, onComplete, characterImage }) {
  const [formData, setFormData] = useState({
    theme: 'Aventura', // ✅ ATUALIZADO: Campo para o tema (selecionado do estilo)
    summary: '',       // ✅ ATUALIZADO: Campo para o resumo
    characterName: '',
    otherCharacters: '',
    location: '',
    style: 'Aventura', // Mantém o estilo para o radio group
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // ✅ ATUALIZADO: Se o estilo mudar, atualiza o tema principal
    if (name === 'style') {
      setFormData(prev => ({ ...prev, theme: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ ATUALIZADO: Valida tema e resumo
    if (!formData.theme.trim() || !formData.summary.trim()) {
      toast.warn('Por favor, preencha o tema e o resumo da história.');
      return;
    }

    setIsSubmitting(true);
    
    // ✅ ATUALIZADO: Chama onComplete passando o tema e o resumo
    onComplete({
      theme: formData.theme.trim(),
      summary: formData.summary.trim(),
      // Outros campos como characterName, otherCharacters, location podem ser passados se o backend precisar deles para refinar o prompt do GPT
    });
    
    // Limpa o formulário e fecha o modal
    setFormData({ theme: 'Aventura', summary: '', characterName: '', otherCharacters: '', location: '', style: 'Aventura' });
    onClose(); 
    setIsSubmitting(false); 
  };

  if (!show) return null;

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div className={styles.backdrop} variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}>
          <motion.div className={styles.modal} variants={modalVariants} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.characterPreview}>
                <Image src={characterImage || '/images/character-placeholder.png'} alt="Seu personagem gerado" width={150} height={150} unoptimized />
              </div>
              <h2>Minha história JackBoo</h2>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label><span>🧸</span> Nome do meu personagem (meu desenho):</label>
                <input type="text" name="characterName" value={formData.characterName} onChange={handleChange} placeholder="Ex: Jackzinho, Estelinha, Dino Max..." />
              </div>
              <div className={styles.formGroup}>
                <label><span>📌</span> Outros personagens da história:</label>
                <input type="text" name="otherCharacters" value={formData.otherCharacters} onChange={handleChange} placeholder="Ex: meu irmão, uma fada, um robô..." />
              </div>
              <div className={styles.formGroup}>
                <label><span>🎭</span> Lugar onde acontece:</label>
                <textarea name="location" value={formData.location} onChange={handleChange} placeholder="Ex: floresta encantada, castelo, fundo do mar..." rows={2}></textarea>
              </div>
              <div className={styles.formGroup}>
                <label><span>🎨</span> Estilo da história (escolha um):</label>
                <div className={styles.radioGroup}>
                  {storyStyles.map(style => (
                    <div key={style} className={styles.radioOption}>
                      <input type="radio" id={style} name="style" value={style} checked={formData.style === style} onChange={handleChange} />
                      <label htmlFor={style}>{style}</label>
                    </div>
                  ))}
                </div>
              </div>
              {/* ✅ ATUALIZADO: Campo para o resumo da história */}
              <div className={styles.formGroup}>
                <label><span>💬</span> Resumo da História (em poucas palavras):</label>
                <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="Descreva a ideia principal da sua história. Ex: Um coelho e um urso encontram um mapa do tesouro e embarcam em uma jornada cheia de desafios e novos amigos." rows={3}></textarea>
              </div>

              <motion.button type="submit" className={styles.submitButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={isSubmitting}>
                <FaBookOpen /> {isSubmitting ? 'Criando...' : 'Criar Livro de História'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};