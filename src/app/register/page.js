// src/app/register/page.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaPhone } from 'react-icons/fa';

// --- Importe o serviço de API ---
import { authService } from '../../services/api';
// --- Importe o serviço de API ---

const RegisterHero = () => (
    <div className={styles.hero}>
        <motion.div
            className={styles.heroImageWrapper}
            animate={{ y: ['0%', '-3%', '0%'], rotate: [-1, 1, -1] }}
            transition={{
                y: { duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
                rotate: { duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
            }}
        >
            <Image src="/images/jackboo-login.png" alt="JackBoo convidando para o cadastro" width={300} height={300} className={styles.heroImage} />
        </motion.div>
        <motion.div className={styles.heroText} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className={styles.heroTitle}>Junte-se à Magia!</h1>
            <p className={styles.heroSubtitle}>Crie sua conta e comece a dar vida às suas criações.</p>
        </motion.div>
    </div>
);

export default function RegisterPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validação simples do formato do telefone
        const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
        if (!phoneRegex.test(phone)) {
            setError('Formato de telefone inválido. Use (XX) XXXXX-XXXX ou XX XXXXX XXXX.');
            setIsLoading(false);
            return;
        }

        try {
            const userData = { fullName, nickname, email, password, birthDate, phone };
            await authService.register(userData);

            alert('Cadastro realizado com sucesso! Você pode fazer login agora.');
            router.push('/login');

        } catch (err) {
            console.error('Erro no cadastro:', err);
            setError(err.message || 'Falha no cadastro. Verifique os dados ou tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <RegisterHero />
                <motion.div
                    className={styles.formContainer}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h2 className={styles.formTitle}>Cadastro</h2>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="fullName"><FaUser /> Nome Completo</label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Seu nome completo"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="nickname">👤 Apelido</label>
                            <input
                                type="text"
                                id="nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="Escolha um apelido único"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email"><FaEnvelope /> Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Seu melhor email"
                                required
                                disabled={isLoading}
                            />
                        </div>
                         <div className={styles.formGroup}>
                            <label htmlFor="phone"><FaPhone /> Telefone</label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="(XX) XXXXX-XXXX"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="birthDate"><FaCalendarAlt /> Data de Nascimento</label>
                            <input
                                type="date"
                                id="birthDate"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                placeholder="DD/MM/AAAA"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password"><FaLock /> Senha</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                required
                                minLength="8"
                                disabled={isLoading}
                            />
                        </div>
                        <motion.button
                            type="submit"
                            className={styles.submitButton}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                        </motion.button>
                    </form>
                    <p className={styles.loginPrompt}>
                        Já tem conta? <Link href="/login" className={styles.loginLink}>Faça Login!</Link>
                    </p>
                </motion.div>
            </div>
        </main>
    );
}