// src/components/HeroSection/HeroSection.js
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Importar Link
import { motion } from 'framer-motion';
import styles from './HeroSection.module.css';

// Componente para as estrelas cintilantes
const TwinklingStar = ({ top, left, size, delay }) => (
  <motion.span
    className={styles.star}
    style={{ top, left, width: size, height: size }}
    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
    transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror', delay }}
  />
);

const HeroSection = () => {
  return (
    <section className={styles.section}> {/* padding-top adicionado aqui via CSS */}
      <div className={styles.background}>
        <Image
          src="/images/fundo.jpg"
          alt="Cenário de fundo do mundo JackBoo"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>

      {/* Estrelas reposicionadas para o novo layout */}
      {/* Estrelas posicionadas com % base no viewport, não no container específico, ajusta se necessário */}
      <TwinklingStar top="10%" left="30%" size={25} delay={0.2} /> {/* Ajustada posição left */}
      <TwinklingStar top="15%" left="85%" size={20} delay={0.8} /> {/* Ajustada posição left/top */}
      <TwinklingStar top="5%" left="70%" size={15} delay={0.5} />  {/* Ajustada posição left/top */}

      <div className={styles.container}> {/* align-items: start */}
        {/* --- CONTENT WRAPPER ATUALIZADO (deslocamento para a direita) --- */}
        <div className={styles.contentWrapper}> {/* padding-left adicionado aqui via CSS */}
           {/* Contêiner para o Título e Botão próximos */}
           <motion.div
                className={styles.headlineContent}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
           >
              <h1 className={styles.title}>
                Transforme <br/> seu <span className={styles.highlight}>desenho</span> <br/> em um <span className={styles.highlight}>personagem!</span>
              </h1>

              {/* --- BOTÃO DE CTA MAIS CHAMATIVO NO TOPO --- */}
              <Link href="/create-character" passHref> {/* Usando Link com passHref */}
                <motion.button
                  className={styles.ctaButton}
                  whileHover={{ scale: 1.05, y: -5 }} // Move mais para cima no hover
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 120 }}
                >
                  Crie seu personagem
                </motion.button>
              </Link>

           </motion.div>
        </div>

        <div className={styles.illustrationWrapper}>
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
          >
            <motion.div
              animate={{ y: ['0%', '-4%', '0%'] }}
              // @ts-ignore
              transition={{ duration: 6, repeat: Infinity, repeatType: 'yoyo', ease: 'easeInOut' }}
            >
              <Image
                src="/images/hero-jackboo.png"
                alt="JackBoo segurando um desenho que virou personagem"
                width={600}
                height={600}
                className={styles.mainImage}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;