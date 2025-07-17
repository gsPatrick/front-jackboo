// src/components/Settings/PrivacySettings.js
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './PrivacySettings.module.css';
import { FaEnvelope, FaPhone, FaLock, FaSave, FaUserCircle } from 'react-icons/fa'; // Adicionado FaUserCircle para o nome completo

// Mock Data: Dados de Privacidade do Usuário (Adicionado fullName)
const mockUserPrivacy = {
    fullName: 'Arthur Silva', // Nome completo (usado em privacidade)
    email: 'artista.jackboo@email.com',
    phone: '(99) 99999-9999',
    // Password is not displayed, only a change option
};

const PrivacySettings = () => {
    const [userFullName, setUserFullName] = useState(mockUserPrivacy.fullName);
    const [userEmail, setUserEmail] = useState(mockUserPrivacy.email);
    const [userPhone, setUserPhone] = useState(mockUserPrivacy.phone);
    // State for password change could be here (e.g., isPasswordModalOpen)

    const handleSave = () => {
        // TODO: Implementar lógica para salvar Nome Completo, Email, Telefone no backend/estado global
        console.log("Dados de privacidade salvos:", { fullName: userFullName, email: userEmail, phone: userPhone });
        alert("Configurações de privacidade salvas!");
    };

    const handleChangePassword = () => {
        // TODO: Implementar lógica para abrir modal de mudança de senha
        alert("Funcionalidade de mudar senha ainda não implementada :)");
        console.log("Clicou em Mudar Senha");
    };

    return (
        <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             className={styles.privacyContainer}
        >
            <h2 className={styles.sectionTitle}>Privacidade e Segurança</h2>

            {/* Campo Nome Completo */}
             <div className={styles.formGroup}>
                <label htmlFor="fullName"><FaUserCircle className={styles.icon} /> Nome Completo:</label>
                <input
                    type="text"
                    id="fullName"
                    value={userFullName}
                    onChange={(e) => setUserFullName(e.target.value)}
                    className={styles.input}
                />
            </div>

            {/* Campo E-mail */}
            <div className={styles.formGroup}>
                <label htmlFor="email"><FaEnvelope className={styles.icon} /> E-mail:</label>
                <input
                    type="email"
                    id="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className={styles.input}
                />
            </div>

            {/* Campo Telefone */}
            <div className={styles.formGroup}>
                 <label htmlFor="phone"><FaPhone className={styles.icon} /> Telefone:</label>
                 <input
                    type="tel"
                    id="phone"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className={styles.input}
                />
            </div>

            {/* Campo Senha */}
            <div className={styles.formGroup}>
                 <label><FaLock className={styles.icon} /> Senha:</label>
                 <motion.button
                     className={styles.changePasswordButton}
                     onClick={handleChangePassword}
                     whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                 >
                     Mudar Senha
                 </motion.button>
            </div>

             {/* Botão Salvar */}
             <motion.button
                className={styles.saveButton}
                onClick={handleSave}
                 whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FaSave /> Salvar Alterações
            </motion.button>

            {/* TODO: Adicionar seção de controle de dados, exclusão de conta, etc. */}

        </motion.div>
    );
};

export default PrivacySettings;