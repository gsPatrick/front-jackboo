// src/components/Settings/PrivacySettings.js
'use client';

import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import { motion } from 'framer-motion';
import styles from './PrivacySettings.module.css';
import { FaEnvelope, FaPhone, FaLock, FaSave, FaUserCircle, FaSpinner } from 'react-icons/fa'; // Adicionado FaSpinner para loading
import { useAuth } from '@/contexts/AuthContext'; // Importar useAuth
import { authService } from '@/services/api'; // Importar authService

const PrivacySettings = () => {
    const { user: loggedInUser, updateUserProfile: updateAuthUserProfile } = useAuth();

    const [userFullName, setUserFullName] = useState(loggedInUser?.fullName || '');
    const [userEmail, setUserEmail] = useState(loggedInUser?.email || '');
    const [userPhone, setUserPhone] = useState(loggedInUser?.phone || '');
    
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false); // Para controlar o estado do botão "Salvar"

    // Sincroniza dados do contexto com o estado local
    useEffect(() => {
        setUserFullName(loggedInUser?.fullName || '');
        setUserEmail(loggedInUser?.email || '');
        setUserPhone(loggedInUser?.phone || '');
    }, [loggedInUser]);

    // Verifica se houve mudanças para habilitar o botão Salvar
    useEffect(() => {
        const changed = 
            userFullName !== (loggedInUser?.fullName || '') ||
            userEmail !== (loggedInUser?.email || '') ||
            userPhone !== (loggedInUser?.phone || '');
        setHasChanges(changed);
    }, [userFullName, userEmail, userPhone, loggedInUser]);


    const handleSave = async () => {
        if (!hasChanges) {
            alert("Nenhuma alteração para salvar.");
            return;
        }

        setIsSaving(true);
        try {
            const updates = {
                fullName: userFullName,
                email: userEmail,
                phone: userPhone,
            };
            const updatedProfile = await authService.updateUserProfile(updates);
            updateAuthUserProfile(updatedProfile); // Atualiza o contexto global
            alert("Configurações de privacidade salvas!");
        } catch (error) {
            console.error("Erro ao salvar dados de privacidade:", error);
            alert(error.message || "Erro ao salvar configurações de privacidade. Tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = () => {
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

            <div className={styles.formGroup}>
                <label htmlFor="fullName"><FaUserCircle className={styles.icon} /> Nome Completo:</label>
                <input
                    type="text"
                    id="fullName"
                    value={userFullName}
                    onChange={(e) => setUserFullName(e.target.value)}
                    className={styles.input}
                    disabled={isSaving}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="email"><FaEnvelope className={styles.icon} /> E-mail:</label>
                <input
                    type="email"
                    id="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className={styles.input}
                    disabled={isSaving}
                />
            </div>

            <div className={styles.formGroup}>
                 <label htmlFor="phone"><FaPhone className={styles.icon} /> Telefone:</label>
                 <input
                    type="tel"
                    id="phone"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className={styles.input}
                    disabled={isSaving}
                />
            </div>

            <div className={styles.formGroup}>
                 <label><FaLock className={styles.icon} /> Senha:</label>
                 <motion.button
                     className={styles.changePasswordButton}
                     onClick={handleChangePassword}
                     whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSaving}
                 >
                     Mudar Senha
                 </motion.button>
            </div>

             <motion.button
                className={styles.saveButton}
                onClick={handleSave}
                 whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSaving || !hasChanges}
            >
                {isSaving ? <FaSpinner className={styles.spinner} /> : <FaSave />} Salvar Alterações
            </motion.button>

        </motion.div>
    );
};

export default PrivacySettings;