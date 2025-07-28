// src/app/login/page.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; // Importa os ícones do olho

import { authService } from '../../services/api';
import { useAuth } from '@/contexts/AuthContext';

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
        <h1 className={styles.welcomeTitle}>Acesse sua Plataforma Criativa</h1>
        <p className={styles.welcomeText}>
            Faça login para gerenciar seus modelos de IA, criar conteúdo oficial e dar vida a novas aventuras mágicas.
        </p>
    </motion.div>
);

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Novo estado para o "olhinho"
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await authService.login(email, password);
            login(data.user, data.token);
            
            if (data.user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }

        } catch (err) {
            setError(err.message || 'Falha ao fazer login. Verifique suas credenciais.');
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
                    <h2 className={styles.formTitle}>Bem-vindo</h2>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email"><FaEnvelope /> Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Digite seu email"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password"><FaLock /> Senha</label>
                            {/* NOVO: Container para o input de senha e o ícone */}
                            <div className={styles.passwordInputWrapper}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Digite sua senha"
                                    required
                                    minLength="8"
                                    disabled={isLoading}
                                />
                                <span 
                                    className={styles.passwordToggleIcon} 
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <motion.button
                            type="submit"
                            className={styles.submitButton}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </motion.button>
                    </form>
                    <p className={styles.signUpPrompt}>
                        Não tem uma conta? <Link href="/register" className={styles.signUpLink}>Cadastre-se</Link>
                    </p>
                </motion.div>
            </div>
        </main>
    );
}