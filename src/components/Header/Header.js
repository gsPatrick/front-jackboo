// src/components/Header/Header.js
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import { FaShoppingCart, FaUserCircle, FaCog, FaSignOutAlt, FaChevronDown, FaBars, FaTools } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

// Ícone Hamburger
const HamburgerIcon = ({ isOpen }) => (
  <svg className={styles.hamburgerIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <motion.path stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" variants={{ closed: { d: "M3 12H21" }, open: { d: "M18 6L6 18" } }} initial="closed" animate={isOpen ? "open" : "closed"} transition={{ duration: 0.2 }} />
    <motion.path stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" variants={{ closed: { d: "M3 6H21" }, open: { d: "M6 6L18 18" } }} initial="closed" animate={isOpen ? "open" : "closed"} transition={{ duration: 0.2 }} />
    <motion.path stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" variants={{ closed: { d: "M3 18H21" }, open: { d: "M6 18L18 6" } }} initial="closed" animate={isOpen ? "open" : "closed"} transition={{ duration: 0.2 }} />
  </svg>
);

const Header = () => {
  const router = useRouter();
  const { user, token, logout, isLoading } = useAuth();
  const { cartItems } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsShopDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsShopDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };

  const handleShopDropdownToggle = () => {
    setIsShopDropdownOpen(!isShopDropdownOpen);
    setIsUserDropdownOpen(false);
  };

  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsShopDropdownOpen(false);
  };

  const handleLogout = () => {
    console.log("Deslogando...");
    logout();
    closeAllMenus();
    alert("Você foi deslogado!");
  };

  const handleAdminDashboard = () => {
    router.push('/admin');
    closeAllMenus();
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
  };

  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 30 } },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
  };

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
          <Image src="/images/jackboo-full-logo.png" alt="JackBoo Logo" width={212} height={45} priority className={styles.logoImage} />
        </Link>

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

          {user ? (
            user.role === 'admin' ? (
                <motion.div className={styles.userMenuWrapper} onMouseEnter={() => setIsUserDropdownOpen(true)} onMouseLeave={() => setIsUserDropdownOpen(false)}>
                  <div className={styles.userIconToggle}>
                    <div className={styles.userAvatarWrapper}>
                      <Image 
                        src={user.avatarUrl || '/default-avatar.png'} 
                        alt={`Avatar de ${user.nickname}`} 
                        width={40} 
                        height={40} 
                        className={styles.userAvatarImage} // Usar userAvatarImage
                        onError={(e) => { e.target.src = '/images/jackboo-full-logo-placeholder.png'; }} // Fallback
                      />
                    </div>
                    <FaChevronDown className={`${styles.dropdownArrow} ${isUserDropdownOpen ? styles.rotated : ''}`} />
                  </div>
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div className={styles.userDropdownMenu} variants={dropdownVariants} initial="hidden" animate="visible" exit="exit">
                        <button className={styles.userDropdownItemButton} onClick={handleAdminDashboard}>
                            <FaTools /> Painel Admin
                        </button>
                        <button className={`${styles.userDropdownItemButton} ${styles.logoutButton}`} onClick={handleLogout}>
                            <FaSignOutAlt /> Sair
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
            ) : (
                <motion.div className={styles.userMenuWrapper} onMouseEnter={() => setIsUserDropdownOpen(true)} onMouseLeave={() => setIsUserDropdownOpen(false)}>
                  <div className={styles.userIconToggle}>
                    <div className={styles.userAvatarWrapper}>
                      <Image 
                        src={user.avatarUrl || '/default-avatar.png'} 
                        alt={`Avatar de ${user.nickname}`} 
                        width={40} 
                        height={40} 
                        className={styles.userAvatarImage} // Usar userAvatarImage
                        onError={(e) => { e.target.src = '/images/jackboo-full-logo-placeholder.png'; }} // Fallback
                      />
                    </div>
                    <FaChevronDown className={`${styles.dropdownArrow} ${isUserDropdownOpen ? styles.rotated : ''}`} />
                  </div>
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div className={styles.userDropdownMenu} variants={dropdownVariants} initial="hidden" animate="visible" exit="exit">
                        <Link href={`/profile/${user.slug || '#'}`} className={styles.userDropdownItemLink} onClick={closeAllMenus}>Perfil</Link>
                        <Link href="/settings" className={styles.userDropdownItemLink} onClick={closeAllMenus}>Configurações</Link>
                        <button className={`${styles.userDropdownItemButton} ${styles.logoutButton}`} onClick={handleLogout}>Sair</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
            )
          ) : (
            <Link href="/login" passHref>
                <motion.button className={styles.loginButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
                    Login
                </motion.button>
            </Link>
          )}
        </div>

        <div className={styles.mobileRightActions}>
          <Link href="/cart" passHref>
            <div className={styles.mobileCartIcon}>
              <FaShoppingCart className={styles.icon} />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.div key="cart-badge-mobile" className={styles.cartBadge} variants={badgeVariants} initial="hidden" animate="visible" exit="exit">
                    {cartItemCount}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Link>
          {user && (
            user.role === 'admin' ? (
                <Link href="/admin" passHref>
                    <div className={styles.mobileUserAvatar}>
                        <FaTools className={styles.icon} />
                    </div>
                </Link>
            ) : (
                <Link href={`/profile/${user.slug || '#'}`} passHref>
                    <div className={styles.mobileUserAvatar}>
                        <Image 
                            src={user.avatarUrl || '/default-avatar.png'} 
                            alt={`Avatar de ${user.nickname}`} 
                            width={32} 
                            height={32} 
                            className={styles.mobileUserAvatarImage} // Usar mobileUserAvatarImage
                            onError={(e) => { e.target.src = '/images/jackboo-full-logo-placeholder.png'; }} // Fallback
                        />
                    </div>
                </Link>
            )
          )}
          <div className={styles.hamburgerMenuButton} onClick={toggleMobileMenu}>
            <HamburgerIcon isOpen={isMobileMenuOpen} />
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav className={styles.navMobile} variants={{ hidden: { x: '100%' }, visible: { x: 0, transition: { type: 'spring', stiffness: 100, damping: 20, staggerChildren: 0.08, delayChildren: 0.1 } }, exit: { x: '100%', transition: { duration: 0.3 } } }} initial="hidden" animate="visible" exit="exit">
              <ul>
                <motion.li variants={listItemVariants}><Link href="/" onClick={closeAllMenus}>Início</Link></motion.li>
                <motion.li variants={listItemVariants}><Link href="/create-character" onClick={closeAllMenus}>Crie seu Personagem</Link></motion.li>
                <motion.li variants={listItemVariants}><Link href="/shop" onClick={closeAllMenus}>Lojinha JackBoo</Link></motion.li>
                <motion.li variants={listItemVariants}><Link href="/friends-shop" onClick={closeAllMenus}>Lojinha dos Amigos</Link></motion.li>
                <motion.li variants={listItemVariants}><Link href="/championship" onClick={closeAllMenus}>Campeonato</Link></motion.li>
                {user ? (
                  user.role === 'admin' ? (
                    <>
                      <motion.li variants={listItemVariants}><button className={styles.mobileNavLinkButton} onClick={handleAdminDashboard}><FaTools /> Painel Admin</button></motion.li>
                      <motion.li variants={listItemVariants}><button className={`${styles.mobileNavLinkButton} ${styles.logoutButton}`} onClick={handleLogout}><FaSignOutAlt /> Sair</button></motion.li>
                    </>
                  ) : (
                    <>
                      <motion.li variants={listItemVariants}><Link href={`/profile/${user.slug || '#'}`} onClick={closeAllMenus}>Perfil</Link></motion.li>
                      <motion.li variants={listItemVariants}><Link href="/settings" className={styles.mobileNavLinkButton} onClick={closeAllMenus}>Configurações</Link></motion.li>
                      <motion.li variants={listItemVariants}><button className={`${styles.mobileNavLinkButton} ${styles.logoutButton}`} onClick={handleLogout}>Sair</button></motion.li>
                    </>
                  )
                ) : (
                  <motion.li variants={listItemVariants}>
                    <Link href="/login" className={styles.mobileNavLinkButton}>Login</Link>
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