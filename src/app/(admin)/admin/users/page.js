// src/app/(admin)/admin/users/page.js
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { FaUserEdit, FaTrash, FaSearch } from 'react-icons/fa';

// --- DADOS MOCKADOS (Reutilizando e adaptando do /profile/[slug]) ---
const mockUsers = [
  {
    id: 'user001',
    name: 'Pequeno Artista',
    slug: 'pequeno-artista',
    email: 'artista@email.com',
    avatarUrl: '/images/character-generated.png',
    booksCreated: 4,
    lastLogin: '2024-07-28',
  },
  {
    id: 'user002',
    name: 'Lívia Colorida',
    slug: 'livia-colorida',
    email: 'livia.c@email.com',
    avatarUrl: '/images/jackboo-sad.png',
    booksCreated: 2,
    lastLogin: '2024-07-27',
  },
  {
    id: 'user003',
    name: 'Max Aventureiro',
    slug: 'max-aventureiro',
    email: 'max.a@email.com',
    avatarUrl: '/images/hero-jackboo.png',
    booksCreated: 5,
    lastLogin: '2024-07-28',
  },
    {
    id: 'user004',
    name: 'Sophia Criativa',
    slug: 'sophia-criativa',
    email: 'sophia.c@email.com',
    avatarUrl: '/images/club-jackboo.png',
    booksCreated: 1,
    lastLogin: '2024-07-25',
  },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function UsersDashboardPage() {
    const [users, setUsers] = useState(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleViewProfile = (slug) => {
        router.push(`/profile/${slug}`);
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm("Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.")) {
            setUsers(users.filter(u => u.id !== userId));
            // API call para deletar
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.main
            className={styles.main}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>Gerenciamento de Usuários</h1>
                <div className={styles.searchWrapper}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou e-mail..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Usuário</th>
                            <th>E-mail</th>
                            <th>Livros Criados</th>
                            <th>Último Login</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                        {filteredUsers.map(user => (
                            <motion.tr key={user.id} variants={itemVariants}>
                                <td className={styles.userCell}>
                                    <Image src={user.avatarUrl} alt={user.name} width={40} height={40} className={styles.avatar} />
                                    <span>{user.name}</span>
                                </td>
                                <td>{user.email}</td>
                                <td>{user.booksCreated}</td>
                                <td>{new Date(user.lastLogin).toLocaleDateString('pt-BR')}</td>
                                <td className={styles.actionsCell}>
                                    <motion.button className={styles.actionButton} onClick={() => handleViewProfile(user.slug)} title="Ver Perfil Público">
                                        <FaUserEdit />
                                    </motion.button>
                                    <motion.button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDeleteUser(user.id)} title="Deletar Usuário">
                                        <FaTrash />
                                    </motion.button>
                                </td>
                            </motion.tr>
                        ))}
                    </motion.tbody>
                </table>
            </div>
        </motion.main>
    );
}