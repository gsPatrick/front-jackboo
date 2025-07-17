// src/components/CharacterMessage/CharacterMessage.js
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './CharacterMessage.module.css';

// Este componente agora recebe a imagem e nome DO PROTAGONISTA
// E, OPCIONALMENTE, as infos do AUTOR (para linkar pro perfil se for amigo)
const CharacterMessage = ({ protagonistName, protagonistImage, message, authorName, authorSlug, authorType }) => {

  const characterContent = (
    <div className={styles.characterInfo}>
        <motion.div
            className={styles.characterImageWrapper}
            animate={{ y: ['0%', '-3%', '0%'] }}
            transition={{ y: { duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } }}
        >
            <Image
                src={protagonistImage}
                alt={protagonistName || 'Personagem'}
                width={150}
                height={150}
                className={styles.characterImage}
            />
        </motion.div>
         {/* Conteúdo à direita da imagem */}
         <div className={styles.textContainer}>
            <div className={styles.speechBubble}>
                {message}
            </div>
             {/* Exibe o nome do AUTOR aqui, para dar crédito */}
             {authorType === 'friend' ? (
                 <p className={styles.authorCredit}>
                     Uma história criada por <Link href={`/profile/${authorSlug}`} className={styles.authorLink}>{authorName}</Link>!
                 </p>
             ) : (
                 <p className={styles.protagonistName}>
                     <span className={styles.nameLabel}>Sou eu,</span> {protagonistName}!
                 </p>
             )}
        </div>
    </div>
  );


  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
    >
      {characterContent}
    </motion.div>
  );
};

export default CharacterMessage;