// src/components/Header/Header.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Importar Link
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Header.module.css';
import { FaShoppingCart, FaUserCircle, FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa'; // Importar ícones de Font Awesome e a seta

// Hamburger Icon (com animação Framer Motion)
const HamburgerIcon = ({ isOpen }) => (
  <svg
    className={styles.hamburgerIcon}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      stroke="#000" // Cor preta para o menu sanduíche
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={{
        closed: { d: "M3 12H21" },
        open: { d: "M18 6L6 18" }
      }}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      transition={{ duration: 0.2 }}
    />
    <motion.path
      stroke="#000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={{
        closed: { d: "M3 6H21" },
        open: { d: "M6 6L18 18" }
      }}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      transition={{ duration: 0.2 }}
    />
    <motion.path
      stroke="#000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={{
        closed: { d: "M3 18H21" },
        open: { d: "M6 18L18 6" }
      }}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      transition={{ duration: 0.2 }}
    />
  </svg>
);

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // --- ESTADOS MOCKADOS (SIMULAM LOGIN E CARRINHO) ---
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simular logado: true, deslogado: false
  const [cartItemCount, setCartItemCount] = useState(3); // Simular 3 itens no carrinho
  const [userName, setUserName] = useState('Pequeno Artista'); // Simular nome do usuário
  const [userSlug, setUserSlug] = useState('pequeno-artista'); // Simular slug do usuário para o link do perfil
  const [userAvatarUrl, setUserAvatarUrl] = useState('/images/character-generated.png'); // NOVO: Avatar do usuário
  // --- FIM ESTADOS MOCKADOS ---


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Fecha outros dropdowns ao abrir/fechar o menu mobile
    setIsShopDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };

  const closeAllMenus = () => {
      setIsMobileMenuOpen(false);
      setIsShopDropdownOpen(false);
      setIsUserDropdownOpen(false);
  };

  const handleShopDropdownToggle = () => {
      setIsShopDropdownOpen(!isShopDropdownOpen);
      setIsUserDropdownOpen(false); // Fecha o menu de usuário ao abrir o da loja
  };

  const handleUserDropdownToggle = () => {
      setIsUserDropdownOpen(!isUserDropdownOpen);
      setIsShopDropdownOpen(false); // Fecha o menu da loja ao abrir o de usuário
  };

   // Placeholder functions for user actions
   const handleLogout = () => {
       console.log("Simulando Sair da Conta");
       setIsLoggedIn(false); // Simula logout
       closeAllMenus();
   };

   // MODIFICADO: handleSettings agora navega
   const handleSettings = () => {
        console.log("Navegando para Configurações");
        closeAllMenus();
        // A navegação será feita pelo Link, apenas garantimos que os menus fechem
   };


  // Variantes para animação de entrada/saída dos dropdowns
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
  };

   // Variantes para animação do badge do carrinho
   const badgeVariants = {
       hidden: { scale: 0, opacity: 0 },
       visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 30 } },
        exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
   };

    // Variantes para os itens do menu mobile (para animação de entrada escalonada)
   const listItemVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 }
   };


  return (
    <motion.header
      className={styles.header}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={closeAllMenus}>
          <Image
            src="/images/jackboo-full-logo.png"
            alt="JackBoo Logo"
            width={212}
            height={45}
            priority
            className={styles.logoImage}
          />
        </Link>

        {/* Navegação Desktop (visível apenas em desktop) */}
        <nav className={styles.navDesktop}>
          <ul>
            <motion.li whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Link href="/" onClick={closeAllMenus}>Início</Link>
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Link href="/create-character" onClick={closeAllMenus}>Crie seu Personagem</Link>
            </motion.li>
            <motion.li
                className={styles.navItemWithDropdown}
                onMouseEnter={() => setIsShopDropdownOpen(true)}
                onMouseLeave={() => setIsShopDropdownOpen(false)}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className={styles.dropdownToggle}>
                  Lojinha <FaChevronDown className={`${styles.dropdownArrow} ${isShopDropdownOpen ? styles.rotated : ''}`} />
              </span>
              <AnimatePresence>
                {isShopDropdownOpen && (
                  <motion.div className={styles.dropdownMenu} variants={dropdownVariants} initial="hidden" animate="visible" exit="exit">
                    <Link href="/shop" className={styles.dropdownItemLink} onClick={closeAllMenus}>Lojinha JackBoo</Link>
                    <Link href="/friends-shop" className={styles.dropdownItemLink} onClick={closeAllMenus}>Lojinha dos Amigos</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Link href="/championship" onClick={closeAllMenus}>Campeonato</Link>
            </motion.li>
          </ul>
        </nav>

        {/* Ações Desktop (visível apenas em desktop) */}
        <div className={styles.actionsDesktop}>
           <Link href="/cart" passHref>
             <motion.div className={styles.iconWrapper} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: 'spring', stiffness: 300 }}>
               <FaShoppingCart className={styles.icon} />
               <AnimatePresence>
                 {cartItemCount > 0 && (
                    <motion.div key="cart-badge" className={styles.cartBadge} variants={badgeVariants} initial="hidden" animate="visible" exit="exit">
                        {cartItemCount}
                    </motion.div>
                 )}
               </AnimatePresence>
             </motion.div>
           </Link>

           {isLoggedIn ? (
                <motion.div className={styles.userMenuWrapper} onMouseEnter={() => setIsUserDropdownOpen(true)} onMouseLeave={() => setIsUserDropdownOpen(false)}>
                   <div className={styles.userIconToggle}>
                       {/* --- AVATAR DO USUÁRIO AQUI --- */}
                       <div className={styles.userAvatarWrapper}>
                           <Image src={userAvatarUrl} alt={`Avatar de ${userName}`} width={40} height={40} />
                       </div>
                       <FaChevronDown className={`${styles.dropdownArrow} ${isUserDropdownOpen ? styles.rotated : ''}`} />
                   </div>
                   <AnimatePresence>
                       {isUserDropdownOpen && (
                           <motion.div className={styles.userDropdownMenu} variants={dropdownVariants} initial="hidden" animate="visible" exit="exit">
                               <Link href={`/profile/${userSlug}`} className={styles.userDropdownItemLink} onClick={closeAllMenus}>Perfil</Link>
                               <Link href="/settings" className={styles.userDropdownItemLink} onClick={closeAllMenus}>Configurações</Link>
                               <button className={`${styles.userDropdownItemButton} ${styles.logoutButton}`} onClick={handleLogout}>Sair</button>
                           </motion.div>
                       )}
                   </AnimatePresence>
                </motion.div>
           ) : (
                <motion.button className={styles.loginButton} whileHover={{ scale: 1.05, boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)' }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 10 }} onClick={() => { setIsLoggedIn(true); closeAllMenus(); }}>
                   Login
               </motion.button>
           )}
        </div>

        {/* --- NOVO: AÇÕES E HAMBURGER PARA MOBILE --- */}
        <div className={styles.mobileRightActions}>
            {/* Ações Visíveis no Mobile */}
            <div className={styles.actionsMobile}>
                <Link href="/cart" passHref>
                    <div className={styles.mobileCartIcon}>
                        <FaShoppingCart className={styles.icon}/>
                        <AnimatePresence>
                            {cartItemCount > 0 && (
                                <motion.div className={styles.cartBadge} variants={badgeVariants} initial="hidden" animate="visible" exit="exit">
                                    {cartItemCount}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Link>
                {isLoggedIn && (
                    <Link href={`/profile/${userSlug}`} passHref>
                        <div className={styles.mobileUserAvatar}>
                             <Image src={userAvatarUrl} alt={`Avatar de ${userName}`} width={32} height={32} />
                        </div>
                    </Link>
                )}
            </div>

            {/* Botão do Hamburger Menu */}
            <div className={styles.hamburgerMenuButton} onClick={toggleMobileMenu}>
                <HamburgerIcon isOpen={isMobileMenuOpen} />
            </div>
        </div>


        {/* Navegação Mobile (painel lateral) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav className={styles.navMobile} variants={{ hidden: { x: '100%' }, visible: { x: 0, transition: { type: 'spring', stiffness: 100, damping: 20, staggerChildren: 0.08, delayChildren: 0.1 } }, exit: { x: '100%', transition: { duration: 0.3 } } }} initial="hidden" animate="visible" exit="exit">
              <ul>
                <motion.li variants={listItemVariants}><Link href="/" onClick={closeAllMenus}>Início</Link></motion.li>
                <motion.li variants={listItemVariants}><Link href="/create-character" onClick={closeAllMenus}>Crie seu Personagem</Link></motion.li>
                 <motion.li variants={listItemVariants}><Link href="/shop" onClick={closeAllMenus}>Lojinha JackBoo</Link></motion.li>
                  <motion.li variants={listItemVariants}><Link href="/friends-shop" onClick={closeAllMenus}>Lojinha dos Amigos</Link></motion.li>
                 <motion.li variants={listItemVariants}><Link href="/championship" onClick={closeAllMenus}>Campeonato</Link></motion.li>
                {isLoggedIn ? (
                     <>
                         <motion.li variants={listItemVariants}><Link href={`/profile/${userSlug}`} onClick={closeAllMenus}>Perfil</Link></motion.li>
                         <motion.li variants={listItemVariants}><Link href="/settings" className={styles.mobileNavLinkButton} onClick={closeAllMenus}>Configurações</Link></motion.li>
                         <motion.li variants={listItemVariants}><button className={`${styles.mobileNavLinkButton} ${styles.logoutButton}`} onClick={handleLogout}>Sair</button></motion.li>
                     </>
                ) : (
                    <motion.li variants={listItemVariants}>
                        <button className={styles.mobileNavLinkButton} onClick={() => { setIsLoggedIn(true); closeAllMenus(); }}>
                           Login
                       </button>
                    </motion.li>
                )}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;