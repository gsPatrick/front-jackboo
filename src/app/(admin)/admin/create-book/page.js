// src/app/(admin)/admin/create-book/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaPalette, FaFeatherAlt, FaMagic } from 'react-icons/fa';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    adminBookGeneratorService,
    adminLeonardoService,
    adminAISettingsService,
    adminCharactersService,
    adminTaxonomiesService
} from '@/services/api';
import styles from './page.module.css';

// ✅ CORREÇÃO: Adicionando a URL base para construir os links das imagens.
const API_BASE_URL = 'https://geral-jackboo.r954jc.easypanel.host';

export default function CreateOfficialBookPage() {
    const router = useRouter();

    const [bookType, setBookType] = useState('historia');
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [title, setTitle] = useState('');
    const [theme, setTheme] = useState('');
    const [summary, setSummary] = useState('');
    const [printFormatId, setPrintFormatId] = useState('');
    const [elementId, setElementId] = useState('');
    const [coverElementId, setCoverElementId] = useState('');
    const [pageCount, setPageCount] = useState(10);

    const [allCharacters, setAllCharacters] = useState([]);
    const [allElements, setAllElements] = useState([]);
    const [allPrintFormats, setAllPrintFormats] = useState([]);
    const [defaultSettings, setDefaultSettings] = useState({});

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadInitialData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [charactersData, elementsData, printFormatsData, settingsData] = await Promise.all([
                adminCharactersService.listCharacters(),
                adminLeonardoService.listElements(),
                adminTaxonomiesService.listPrintFormats(),
                adminAISettingsService.listSettings(),
            ]);

            setAllCharacters(charactersData?.characters || []);
            setAllElements(elementsData || []);
            setAllPrintFormats(printFormatsData || []);

            const settingsMap = {};
            // Ajuste para usar 'purpose' como chave
            (settingsData || []).forEach(s => { settingsMap[s.purpose] = s; });
            setDefaultSettings(settingsMap);

        } catch (error) {
            toast.error(`Falha ao carregar dados iniciais: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    useEffect(() => {
        if (Object.keys(defaultSettings).length > 0) {
            const settingType = bookType === 'historia' ? 'USER_STORY_BOOK_GENERATION' : 'USER_COLORING_BOOK_GENERATION';
            const defaults = defaultSettings[settingType];
            if (defaults) {
                // Usa o ID do nosso banco (chave primária), não o do Leonardo
                setElementId(defaults.defaultElementId || '');
                setCoverElementId(defaults.coverElementId || '');
            } else {
                setElementId('');
                setCoverElementId('');
            }
        }
    }, [bookType, defaultSettings]);

    const handleCharacterToggle = (charId) => {
        setSelectedCharacters(prev =>
            prev.includes(charId) ? prev.filter(id => id !== charId) : [...prev, charId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedCharacters.length === 0 || !title || !theme || !printFormatId || !elementId || !coverElementId) {
            toast.warn('Por favor, preencha todos os campos, incluindo os estilos de IA.');
            return;
        }
        if (bookType === 'historia' && !summary) {
            toast.warn('O resumo da história é obrigatório para livros de história.');
            return;
        }

        setIsSubmitting(true);

        const generationData = {
            characterIds: selectedCharacters,
            title,
            theme,
            summary: bookType === 'historia' ? summary : undefined,
            printFormatId,
            elementId,
            coverElementId,
            pageCount: parseInt(pageCount, 10),
        };

        try {
            const response = await adminBookGeneratorService.generateBookPreview(bookType, generationData);
            toast.info('Iniciando o processo de criação...');
            router.push(`/admin/create-book/generating?bookId=${response.id}`);
        } catch (error) {
            toast.error(`Erro ao iniciar geração: ${error.message}`);
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Carregando editor de livros...</div>
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ToastContainer position="bottom-right" theme="colored" />
            <h1 className={styles.title}>Criar Livro Oficial</h1>
            <p className={styles.subtitle}>Dê vida a uma nova aventura JackBoo! Escolha os estilos ou use os padrões.</p>

            <form onSubmit={handleSubmit} className={styles.formWrapper}>
                {/* Seção 1: Tipo de Livro */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. Qual o tipo de livro?</h2>
                    <div className={styles.typeSelector}>
                        <div className={`${styles.typeOption} ${bookType === 'historia' ? styles.active : ''}`} onClick={() => setBookType('historia')}>
                            <FaFeatherAlt /><span>Livro de História</span>
                        </div>
                        <div className={`${styles.typeOption} ${bookType === 'colorir' ? styles.active : ''}`} onClick={() => setBookType('colorir')}>
                            <FaPalette /><span>Livro de Colorir</span>
                        </div>
                    </div>
                </div>

                {/* Seção 2: Personagens */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. Escolha os personagens</h2>
                    {allCharacters.length > 0 ? (
                        <div className={styles.characterGrid}>
                            {allCharacters.map(char => (
                                <div key={char.id} className={`${styles.characterCard} ${selectedCharacters.includes(char.id) ? styles.selected : ''}`} onClick={() => handleCharacterToggle(char.id)}>
                                    {/* ✅ CORREÇÃO: URL da imagem construída corretamente */}
                                    <Image
                                        src={`${API_BASE_URL}${char.generatedCharacterUrl || char.originalDrawingUrl}`}
                                        alt={char.name}
                                        width={80}
                                        height={80}
                                        className={styles.characterAvatar}
                                        unoptimized
                                    />
                                    <p className={styles.characterName}>{char.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p>Nenhum personagem oficial encontrado. Crie um na página de Personagens.</p>}
                </div>

                {/* Seção 3: Detalhes da História */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. Defina os detalhes</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="title">Título do Livro</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: JackBoo e o Tesouro Perdido" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="theme">Tema</label>
                            <input type="text" id="theme" value={theme} onChange={e => setTheme(e.target.value)} placeholder="Ex: Aventura Pirata" required />
                        </div>
                        {bookType === 'historia' && (
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label htmlFor="summary">Resumo da História</label>
                                <textarea id="summary" value={summary} onChange={e => setSummary(e.target.value)} rows="4" placeholder="Descreva em poucas palavras o que acontece na história..." required={bookType === 'historia'} />
                            </div>
                        )}
                        <div className={styles.formGroup}>
                            <label htmlFor="printFormatId">Formato de Impressão</label>
                            <select id="printFormatId" value={printFormatId} onChange={e => setPrintFormatId(e.target.value)} required>
                                <option value="" disabled>Selecione...</option>
                                {allPrintFormats.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="pageCount">
                                {bookType === 'historia' ? 'Nº de Cenas (Miolo)' : 'Nº de Páginas (Miolo)'}
                            </label>
                            <input type="number" id="pageCount" value={pageCount} onChange={e => setPageCount(e.target.value)} min="1" max="20" required />
                        </div>
                    </div>
                </div>

                {/* Seção 4: Estilos de IA */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. Escolha os estilos de IA (Elements)</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="elementId">Estilo do Miolo</label>
                            {/* No dropdown, usamos o ID do nosso banco (chave primária) */}
                            <select id="elementId" value={elementId} onChange={e => setElementId(e.target.value)} required>
                                <option value="" disabled>Selecione um estilo...</option>
                                {allElements.filter(el => el.status === 'COMPLETE').map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="coverElementId">Estilo da Capa e Contracapa</label>
                            <select id="coverElementId" value={coverElementId} onChange={e => setCoverElementId(e.target.value)} required>
                                <option value="" disabled>Selecione um estilo...</option>
                                {allElements.filter(el => el.status === 'COMPLETE').map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.submitContainer}>
                    <button type="submit" className={styles.submitButton} disabled={isSubmitting || isLoading}>
                        <FaMagic /> {isSubmitting ? 'Gerando...' : 'Iniciar Geração Mágica'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}