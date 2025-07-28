// src/app/register/page.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';

import { authService } from '../../services/api';
import { useAuth } from '@/contexts/AuthContext'; // Importa o hook para auto-login

// Nova seção de boas-vindas para o cadastro
const WelcomeSection = () => (
    <motion.div
        className={styles.welcomeSection}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
    >
        <div className={styles.welcomeLogo}>
            <Image src="/images/jackboo-full-logo.png" alt="JackBoo Logo" width={180} height={48} priority />
        </div>
        <h1 className={styles.welcomeTitle}>Crie sua Conta Mágica</h1>
        <p className={styles.welcomeText}>
            Faça parte do universo JackBoo! Cadastre-se para começar a criar personagens, gerar livros e explorar um mundo de aventuras.
        </p>
    </motion.div>
);

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth(); // Obtém a função de login para o fluxo de auto-login
    const [formData, setFormData] = useState({
        fullName: '',
        nickname: '',
        email: '',
        password: '',
        birthDate: '',
        phone: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // 1. Registra o novo usuário
            await authService.register(formData);

            // 2. Tenta fazer o login automaticamente
            const loginData = await authService.login(formData.email, formData.password);

            // 3. Atualiza o estado global de autenticação
            login(loginData.user, loginData.token);

            // 4. Redireciona para o dashboard do usuário
            router.push('/dashboard'); 

        } catch (err) {
            setError(err.message || 'Falha no cadastro. Verifique os dados ou tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <WelcomeSection />
                <motion.div
                    className={styles.formContainer}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2 className={styles.formTitle}>Crie sua Conta</h2>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="fullName"><FaUser /> Nome Completo</label>
                            <input type="text" id="fullName" value={formData.fullName} onChange={handleChange} required disabled={isLoading} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="nickname">👤 Apelido</label>
                            <input type="text" id="nickname" value={formData.nickname} onChange={handleChange} required disabled={isLoading} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email"><FaEnvelope /> Email</label>
                            <input type="email" id="email" value={formData.email} onChange={handleChange} required disabled={isLoading} />
                        </div>
                         <div className={styles.formGroup}>
                            <label htmlFor="phone"><FaPhone /> Telefone</label>
                            <input type="tel" id="phone" value={formData.phone} onChange={handleChange} placeholder="(XX) XXXXX-XXXX" required disabled={isLoading} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="birthDate"><FaCalendarAlt /> Data de Nascimento</label>
                            <input type="date" id="birthDate" value={formData.birthDate} onChange={handleChange} required disabled={isLoading} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password"><FaLock /> Senha</label>
                            <div className={styles.passwordInputWrapper}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Mínimo 8 caracteres"
                                    required
                                    minLength="8"
                                    disabled={isLoading}
                                />
                                <span className={styles.passwordToggleIcon} onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <motion.button type="submit" className={styles.submitButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={isLoading}>
                            {isLoading ? 'Criando...' : 'Criar Conta'}
                        </motion.button>
                    </form>
                    <p className={styles.loginPrompt}>
                        Já tem uma conta? <Link href="/login" className={styles.loginLink}>Faça Login</Link>
                    </p>
                </motion.div>
            </div>
        </main>
    );
}