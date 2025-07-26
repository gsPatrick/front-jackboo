// src/components/Admin/AdminSidebar/AdminSidebar.js
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './AdminSidebar.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTachometerAlt, FaMagic, FaBook, FaUserAstronaut, FaCogs, FaBrain,
  FaLayerGroup, FaCubes, FaRulerCombined, FaTools, FaChevronDown,
  FaUsers, FaBars, FaTimes,
} from 'react-icons/fa';

// --- SEÇÕES DE LINKS (INALTERADAS) ---
const mainLinks = [
  { href: '/admin', icon: <FaTachometerAlt />, label: 'Painel' },
  { href: '/admin/books', icon: <FaBook />, label: 'Livros Oficiais' },
  { href: '/admin/create-book', icon: <FaMagic />, label: 'Criar Livro Oficial' },
  { href: '/admin/characters', icon: <FaUserAstronaut />, label: 'Personagens Oficiais' },
  { href: '/admin/friends-books', icon: <FaUsers />, label: 'Livros dos Amigos' },
];

const settingsLinks = [
  { href: '/admin/user-generation-settings', icon: <FaTools />, label: 'Configuração para usuarios' },
  { href: '/admin/print-formats', icon: <FaRulerCombined />, label: 'Formatos de Impressão' },
];

const leonardoLinks = [
    { href: '/admin/leonardo/datasets', icon: <FaLayerGroup />, label: 'Imagens do Leonardo' },
    { href: '/admin/leonardo/elements', icon: <FaCubes />, label: 'Modelos do Leonardo' },
];

// --- VARIANTES DE ANIMAÇÃO PARA FRAMER MOTION ---
const sidebarVariants = {
  closed: { x: '-100%' },
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};


const AdminSidebar = () => {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // Fecha o menu mobile se o pathname mudar (navegação)
  useEffect(() => {
    if (isMobileNavOpen) {
      setIsMobileNavOpen(false);
    }
  }, [pathname]);

  const isParentActive = (links) => links.some(link => pathname.startsWith(link.href));

  // Estados dos dropdowns, com a lógica para abri-los se estiverem ativos
  const [isSettingsOpen, setIsSettingsOpen] = useState(isParentActive(settingsLinks));
  const [isLeonardoOpen, setIsLeonardoOpen] = useState(isParentActive(leonardoLinks));

  const SidebarContent = () => (
    <>
      <div className={styles.logoContainer}>
        <Link href="/admin"><Image src="/images/jackboo-full-logo.png" alt="JackBoo Logo" width={150} height={40} priority /></Link>
        <button className={styles.closeButton} onClick={() => setIsMobileNavOpen(false)}>
            <FaTimes/>
        </button>
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
          <li>
            <div className={`${styles.navLink} ${styles.dropdownToggle} ${isParentActive(settingsLinks) ? styles.parentActive : ''}`} onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
              <span className={styles.icon}><FaCogs /></span>
              <span className={styles.label}>Configurações</span>
              <FaChevronDown className={`${styles.chevron} ${isSettingsOpen ? styles.open : ''}`} />
            </div>
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.ul className={styles.submenu} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
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
          <li>
            <div className={`${styles.navLink} ${styles.dropdownToggle} ${isParentActive(leonardoLinks) ? styles.parentActive : ''}`} onClick={() => setIsLeonardoOpen(!isLeonardoOpen)}>
              <span className={styles.icon}><FaBrain /></span>
              <span className={styles.label}>Leonardo.AI</span>
              <FaChevronDown className={`${styles.chevron} ${isLeonardoOpen ? styles.open : ''}`} />
            </div>
            <AnimatePresence>
              {isLeonardoOpen && (
                <motion.ul className={styles.submenu} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
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
      <div className={styles.footer}><p>© 2025 JackBoo Admin</p></div>
    </>
  );

  return (
    <>
      {/* --- BOTÃO HAMBÚRGUER (APENAS MOBILE) --- */}
      <button className={styles.hamburgerButton} onClick={() => setIsMobileNavOpen(true)}>
        <FaBars />
      </button>

      {/* --- SIDEBAR PARA DESKTOP --- */}
      <aside className={`${styles.sidebar} ${styles.desktopSidebar}`}>
        <SidebarContent />
      </aside>

      {/* --- SIDEBAR PARA MOBILE (COM ANIMAÇÃO) --- */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div
              className={styles.backdrop}
              onClick={() => setIsMobileNavOpen(false)}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            />
            <motion.aside
              className={`${styles.sidebar} ${styles.mobileSidebar}`}
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;