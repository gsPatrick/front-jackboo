// src/components/Admin/AdminSidebar/AdminSidebar.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './AdminSidebar.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTachometerAlt,
  FaMagic,
  FaBook,
  FaUserAstronaut,
  FaCogs,
  FaBrain,
  FaLayerGroup,
  FaCubes,
  FaCommentDots,
  FaPaintBrush,
  FaChevronDown,
  FaTools,
  FaRulerCombined // Ícone para Formatos de Impressão
} from 'react-icons/fa';

// Links principais da navegação
const mainLinks = [
  { href: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
  { href: '/admin/books', icon: <FaBook />, label: 'Livros Oficiais' },
  { href: '/admin/create-book', icon: <FaMagic />, label: 'Criar Livro Oficial' },
  { href: '/admin/characters', icon: <FaUserAstronaut />, label: 'Personagens Oficiais' },
];

// Links do submenu de Configurações de Geração
const settingsLinks = [
  { href: '/admin/gpt-auxiliaries', icon: <FaCommentDots />, label: 'GPT Auxiliares' },
  { href: '/admin/generation-templates', icon: <FaPaintBrush />, label: 'Templates de Geração' },
  { href: '/admin/user-generation-settings', icon: <FaTools />, label: 'Padrões para Usuários' },
  // CORREÇÃO: Link para Formatos de Impressão adicionado de volta
  { href: '/admin/print-formats', icon: <FaRulerCombined />, label: 'Formatos de Impressão' },
];

// Links para o submenu Leonardo.AI
const leonardoLinks = [
    { href: '/admin/leonardo/datasets', icon: <FaLayerGroup />, label: 'Datasets' },
    { href: '/admin/leonardo/elements', icon: <FaCubes />, label: 'Elements (Modelos)' },
];


const AdminSidebar = () => {
  const pathname = usePathname();
  const isParentActive = (links) => links.some(link => pathname.startsWith(link.href));

  const [isSettingsOpen, setIsSettingsOpen] = useState(isParentActive(settingsLinks));
  const [isLeonardoOpen, setIsLeonardoOpen] = useState(isParentActive(leonardoLinks));

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <Link href="/admin">
          <Image
            src="/images/jackboo-full-logo.png"
            alt="JackBoo Logo"
            width={150}
            height={40}
            priority
          />
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {mainLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} passHref>
                <div className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}>
                  <span className={styles.icon}>{link.icon}</span>
                  <span className={styles.label}>{link.label}</span>
                </div>
              </Link>
            </li>
          ))}

          {/* Menu de Configurações de Geração */}
          <li>
            <div
              className={`${styles.navLink} ${styles.dropdownToggle} ${isParentActive(settingsLinks) ? styles.parentActive : ''}`}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <span className={styles.icon}><FaCogs /></span>
              <span className={styles.label}>Config. de Geração</span>
              <FaChevronDown className={`${styles.chevron} ${isSettingsOpen ? styles.open : ''}`} />
            </div>
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.ul
                  className={styles.submenu}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  {settingsLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} passHref>
                        <div className={`${styles.navLink} ${styles.submenuLink} ${pathname.startsWith(link.href) ? styles.active : ''}`}>
                          <span className={styles.icon}>{link.icon}</span>
                          <span className={styles.label}>{link.label}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>

          {/* Menu Leonardo.AI */}
          <li>
            <div
              className={`${styles.navLink} ${styles.dropdownToggle} ${isParentActive(leonardoLinks) ? styles.parentActive : ''}`}
              onClick={() => setIsLeonardoOpen(!isLeonardoOpen)}
            >
              <span className={styles.icon}><FaBrain /></span>
              <span className={styles.label}>Leonardo.AI</span>
              <FaChevronDown className={`${styles.chevron} ${isLeonardoOpen ? styles.open : ''}`} />
            </div>
            <AnimatePresence>
              {isLeonardoOpen && (
                <motion.ul
                  className={styles.submenu}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  {leonardoLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} passHref>
                        <div className={`${styles.navLink} ${styles.submenuLink} ${pathname.startsWith(link.href) ? styles.active : ''}`}>
                          <span className={styles.icon}>{link.icon}</span>
                          <span className={styles.label}>{link.label}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        </ul>
      </nav>
      <div className={styles.footer}>
        <p>© 2025 JackBoo Admin</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;