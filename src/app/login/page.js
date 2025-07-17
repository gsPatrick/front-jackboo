// src/app/login/page.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Necessário para redirecionamento
import styles from './page.module.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';

// --- Importe o serviço de API ---
import { authService } from '../../services/api';
// --- Importe o serviço de API ---

const LoginHero = () => (
    <div className={styles.hero}>
        <motion.div
            className={styles.heroImageWrapper}
            animate={{ y: ['0%', '-3%', '0%'], rotate: [-1, 1, -1] }}
            transition={{
                y: { duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
                rotate: { duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
            }}
        >
            <Image src="/images/jackboo-login.png" alt="JackBoo convidando para o login" width={300} height={300} className={styles.heroImage} />
        </motion.div>
        <motion.div className={styles.heroText} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className={styles.heroTitle}>Bem-vindo de volta!</h1>
            <p className={styles.heroSubtitle}>Entre na sua conta e continue a jornada mágica!</p>
        </motion.div>
    </div>
);

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await authService.login(email, password);

            console.log('Login bem-sucedido:', data);

            // Simulação de sucesso: Salvar token e dados do usuário (realmente necessário em uma app)
            // localStorage.setItem('token', data.token);
            // localStorage.setItem('user', JSON.stringify(data.user));
            alert('Login bem-sucedido! (Na aplicação real, você seria redirecionado)');

            // Redireciona para a área administrativa após o login
            router.push('/admin');

        } catch (err) {
            console.error('Erro no login:', err);
            setError(err.message || 'Falha ao fazer login. Verifique suas credenciais.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <LoginHero />
                <motion.div
                    className={styles.formContainer}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h2 className={styles.formTitle}>Login</h2>
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
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite sua senha"
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
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </motion.button>
                    </form>
                    <p className={styles.signUpPrompt}>
                        Não tem conta? <Link href="/register" className={styles.signUpLink}>Cadastre-se!</Link>
                    </p>
                </motion.div>
            </div>
        </main>
    );
}