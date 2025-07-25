// /app/(admin)/admin/create-book/page.js
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { adminBookGeneratorService, adminCharactersService, adminTaxonomiesService } from '@/services/api';
import styles from './CreateBook.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMagic, FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const CreateBookPage = () => {
    const [formData, setFormData] = useState({
        bookType: 'coloring',
        theme: '',
        title: '',
        characterId: '',
        printFormatId: '',
        pageCount: '10',
        aiTemplateId: '' // Voltamos a usar aiTemplateId
    });

    const [characters, setCharacters] = useState([]);
    const [printFormats, setPrintFormats] = useState([]);
    const [aiTemplates, setAiTemplates] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [charData, formatData, templateData] = await Promise.all([
                    adminCharactersService.listCharacters(),
                    adminTaxonomiesService.listPrintFormats(),
                    adminTaxonomiesService.listAiTemplates()
                ]);

                setCharacters(charData.characters || []);
                setPrintFormats(formatData || []);
                setAiTemplates(templateData || []);
                
            } catch (error) {
                toast.error(`Erro ao carregar dados iniciais: ${error.message}`);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { bookType, characterId, printFormatId, aiTemplateId, title, theme } = formData;
        if (!bookType || !characterId || !printFormatId || !aiTemplateId || !title.trim() || !theme.trim()) {
            toast.warn('Todos os campos são obrigatórios.');
            return;
        }

        setIsSubmitting(true);
        try {
            await adminBookGeneratorService.generateBookPreview(bookType, formData);
            toast.success(`Geração do livro "${formData.title}" iniciada! Você será redirecionado.`);
            
            setTimeout(() => {
                router.push('/admin/books');
            }, 2000);

        } catch (error) {
            toast.error(`Falha ao iniciar geração: ${error.message}`);
            setIsSubmitting(false);
        }
    };
    
    // O filtro volta a ser específico para o tipo de livro
    const filteredTemplates = useMemo(() => {
        if (!aiTemplates || aiTemplates.length === 0) return [];
        const filterType = formData.bookType;
        return aiTemplates.filter(t => 
            t.type && t.type.startsWith('ADMIN_') && t.type.includes(filterType)
        );
    }, [aiTemplates, formData.bookType]);


    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <ToastContainer position="bottom-right" theme="colored" />
            <h1 className={styles.title}>Criar Livro Oficial</h1>
            <p className={styles.subtitle}>
                Use este formulário para gerar um novo livro para o catálogo oficial da JackBoo. A geração ocorrerá em segundo plano.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>1. Tipo e Título</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="bookType">Tipo de Livro</label>
                            <select id="bookType" name="bookType" value={formData.bookType} onChange={handleChange}>
                                <option value="coloring">Livro de Colorir</option>
                                <option value="story">Livro de História</option>
                            </select>
                        </div>
                         <div className={styles.formGroup}>
                            <label htmlFor="title">Título do Livro</label>
                            <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} placeholder="Ex: A Aventura de Fagulha na Floresta"/>
                        </div>
                         <div className={styles.formGroup}>
                            <label htmlFor="theme">Tema Principal</label>
                            <input id="theme" name="theme" type="text" value={formData.theme} onChange={handleChange} placeholder="Ex: Amizade e Coragem"/>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>2. Conteúdo e Personagem</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="characterId">Personagem Principal</label>
                            <select id="characterId" name="characterId" value={formData.characterId} onChange={handleChange}>
                                <option value="" disabled>Selecione um personagem...</option>
                                {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="pageCount">Número de Páginas</label>
                            <input id="pageCount" name="pageCount" type="number" value={formData.pageCount} onChange={handleChange} min="4" max="40"/>
                        </div>
                    </div>
                </div>
                
                 <div className={styles.card}>
                    <h2 className={styles.cardTitle}>3. Configuração Técnica e de IA</h2>
                     <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="printFormatId">Formato de Impressão</label>
                            <select id="printFormatId" name="printFormatId" value={formData.printFormatId} onChange={handleChange}>
                                <option value="" disabled>Selecione um formato...</option>
                                {printFormats.map(f => <option key={f.id} value={f.id}>{f.name} ({f.pageWidth}x{f.pageHeight}cm)</option>)}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="aiTemplateId">Template de Geração de IA</label>
                            <select id="aiTemplateId" name="aiTemplateId" value={formData.aiTemplateId} onChange={handleChange}>
                                <option value="" disabled>Selecione um template...</option>
                                {filteredTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                             <small>Apenas templates com tipo `ADMIN_{formData.bookType}` são exibidos.</small>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                        {isSubmitting ? <FaSpinner className={styles.spinner} /> : <FaMagic />}
                        {isSubmitting ? 'Iniciando Geração...' : 'Gerar Livro'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default CreateBookPage;