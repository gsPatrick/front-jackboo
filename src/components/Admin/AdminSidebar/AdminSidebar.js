'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './AdminSidebar.module.css';
import {
  FaTachometerAlt,
  FaUserAstronaut,
  FaFileInvoice,
  FaMagic,
  FaBook,
  FaTrophy,
  FaUsers,
  FaMoneyBillWave,
  FaCogs, // Mantido para futuras "Configurações Gerais"
} from 'react-icons/fa';

// Array com os links de navegação do painel de admin
const navLinks = [
  {
    href: '/admin',
    icon: <FaTachometerAlt />,
    label: 'Dashboard',
  },
  {
    href: '/admin/books',
    icon: <FaBook />,
    label: 'Livros Oficiais',
},
  {
    href: '/admin/create-book',
    icon: <FaMagic />,
    label: 'Criar Livro Oficial',
  },
  {
    href: '/admin/characters',
    icon: <FaUserAstronaut />,
    label: 'Personagens Oficiais',
  },
  {
    href: '/admin/print-formats',
    icon: <FaFileInvoice />,
    label: 'Formatos de Impressão',
  },
  // Adicione outros links de gerenciamento aqui conforme necessário
  // Exemplo:
  // {
  //   href: '/admin/taxonomies',
  //   icon: <FaTags />,
  //   label: 'Categorias',
  // },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <Image
          src="/images/jackboo-full-logo.png" // Certifique-se que o caminho está correto
          alt="JackBoo Logo"
          width={150}
          height={40}
          priority
        />
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} passHref>
                <div 
                  className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                >
                  <span className={styles.icon}>{link.icon}</span>
                  <span className={styles.label}>{link.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.footer}>
        {/* Pode ser usado para um link de perfil de admin ou logout no futuro */}
        <p>© 2024 JackBoo Admin</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;