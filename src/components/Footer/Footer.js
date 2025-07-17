// src/components/Footer/Footer.js
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';

const SocialIcon = ({ href, children }) => (
  <motion.a 
    href={href} 
    className={styles.socialIcon} 
    whileHover={{ scale: 1.1, y: -3, rotate: 5 }} 
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </motion.a>
);

const Footer = () => {
  return (
    <footer className={styles.section}>
      <div className={styles.jackbooWrapper}>
        <motion.div 
          className={styles.speechBubble}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 150, delay: 0.5 }}
        >
          Até logo, volte sempre para criar mais!
        </motion.div>
        
        <motion.div
            animate={{ rotate: [-1, 1.5, -1] }}
            // @ts-ignore
            transition={{ rotate: { duration: 6, repeat: Infinity, repeatType: 'yoyo', ease: 'easeInOut' } }}
        >
          <Image
            src="/images/footer-jackboo.png"
            alt="JackBoo acenando no rodapé"
            width={200}
            height={200}
            className={styles.jackbooImage}
          />
        </motion.div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.linkGroup}>
            <h3 className={styles.linkTitle}>Navegue</h3>
            <ul>
              <li><Link href="/">Início</Link></li>
              <li><Link href="/create-character">Crie seu Personagem</Link></li>
              <li><Link href="/shop">Lojinha</Link></li>
              <li><Link href="/championship">Campeonato</Link></li>
            </ul>
          </div>
          <div className={styles.linkGroup}>
            <h3 className={styles.linkTitle}>Ajuda</h3>
            <ul>
              <li><Link href="/faq">Dúvidas Frequentes</Link></li>
              <li><Link href="/contact">Contato</Link></li>
              <li><Link href="/terms">Termos de Uso</Link></li>
              <li><Link href="/privacy">Política de Privacidade</Link></li>
            </ul>
          </div>
          <div className={styles.linkGroup}>
            <h3 className={styles.linkTitle}>Siga a gente!</h3>
            <div className={styles.socials}>
              <SocialIcon href="#"><FaInstagram size={24} /></SocialIcon>
              <SocialIcon href="#"><FaFacebook size={24} /></SocialIcon>
              <SocialIcon href="#"><FaYoutube size={24} /></SocialIcon>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} JackBoo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;