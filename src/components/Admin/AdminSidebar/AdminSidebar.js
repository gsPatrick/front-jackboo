// src/components/Admin/AdminSidebar/AdminSidebar.js
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './AdminSidebar.module.css';
import { 
    FaTachometerAlt, FaRobot, FaBookMedical, 
    FaUsers, FaGift, FaUserFriends, FaDollarSign, FaImages ,FaCogs
} from 'react-icons/fa';

const navItems = [
    { href: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { href: '/admin/earnings', icon: <FaDollarSign />, label: 'Ganhos' },
    { type: 'divider', label: 'Conteúdo' },
    { href: '/admin/create-book', icon: <FaBookMedical />, label: 'Criar Livro' },
    { href: '/admin/jackboo-books', icon: <FaGift />, label: 'Livros Oficiais' },
    { href: '/admin/friends-books', icon: <FaUserFriends />, label: 'Livros dos Amigos' },
    { href: '/admin/users', icon: <FaUsers />, label: 'Usuários' },
    { type: 'divider', label: 'Configurações' },
    { href: '/admin/ai-settings', icon: <FaRobot />, label: 'Configurações de IA' },
    { href: '/admin/assets', icon: <FaImages />, label: 'Assets de Estilo' },
        { href: '/admin/user-book-settings', icon: <FaCogs />, label: 'Livros dos Usuários' }, // <-- ADICIONE AQUI

];

const AdminSidebar = () => {
    const pathname = usePathname();

     return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <Link href="/admin">
                    <Image src="/images/jackboo-full-logo.png" alt="JackBoo Logo" width={150} height={32} style={{ cursor: 'pointer' }} />
                </Link>
                <span className={styles.adminBadge}>Admin</span>
            </div>
            <nav className={styles.sidebarNav}>
                <ul>
                    {navItems.map((item, index) => {
                        if (item.type === 'divider') {
                            return <li key={`divider-${index}`} className={styles.divider}>{item.label}</li>;
                        }
                        return (
                            <li key={item.href}>
                                <Link href={item.href} passHref>
                                    <motion.div
                                        className={`${styles.navLink} ${pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)) ? styles.active : ''}`}
                                        whileHover={{ x: 5 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <span className={styles.navIcon}>{item.icon}</span>
                                        <span className={styles.navLabel}>{item.label}</span>
                                    </motion.div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;