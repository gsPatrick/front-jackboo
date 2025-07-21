'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import { FaPalette, FaFeatherAlt, FaArrowLeft, FaMagic } from 'react-icons/fa';
import { adminTaxonomiesService, adminBookGeneratorService, adminCharactersService } from '@/services/api';

// --- COMPONENTES INTERNOS DE FORMULÁRIO ---

const ColoringBookForm = ({ onBack, onGenerate, availablePrintFormats, officialCharacters }) => {
    const [formData, setFormData] = useState({
        title: '',
        mainCharacterId: '',
        theme: '',
        printFormatId: '',
        pageCount: 10,
    });
    const [formError, setFormError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(null);
        if (!formData.title || !formData.mainCharacterId || !formData.theme || !formData.printFormatId || !formData.pageCount) {
            setFormError("Por favor, preencha todos os campos obrigatórios.");
            return;
        }
        onGenerate('coloring', formData);
    };

    return (
        <motion.form onSubmit={handleSubmit} className={styles.formContainer} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button type="button" onClick={onBack} className={styles.backButton}><FaArrowLeft /> Mudar tipo de livro</button>
            <h2 className={styles.formTitle}>Novo Livro de Colorir</h2>
            {formError && <p className={styles.errorMessage}>{formError}</p>}
            <div className={styles.formGroup}>
                <label>Título do Livro</label>
                <input name="title" type="text" value={formData.title} onChange={handleChange} placeholder="Ex: O Jardim Secreto de JackBoo" required />
            </div>
            <div className={styles.formGroup}>
                <label>Personagem Principal</label>
                <select name="mainCharacterId" value={formData.mainCharacterId} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    {officialCharacters.map(char => <option key={char.id} value={char.id}>{char.name}</option>)}
                </select>
            </div>
            <div className={styles.formGroup}>
                <label>Tema Principal</label>
                <input name="theme" type="text" value={formData.theme} onChange={handleChange} placeholder="Ex: Aventura no Zoológico, Férias na Praia" required />
            </div>
            <div className={styles.grid}>
                <div className={styles.formGroup}>
                    <label>Formato de Impressão</label>
                    <select name="printFormatId" value={formData.printFormatId} onChange={handleChange} required>
                        <option value="">Selecione...</option>
                        {availablePrintFormats.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Quantidade de Páginas de Colorir</label>
                    <input name="pageCount" type="number" value={formData.pageCount} onChange={handleChange} min="1" required />
                </div>
            </div>
            <div className={styles.submitWrapper}>
                <button type="submit" className={styles.submitButton}><FaMagic /> Gerar Livro</button>
            </div>
        </motion.form>
    );
};

const StoryBookForm = ({ onBack, onGenerate, availablePrintFormats, officialCharacters }) => {
    const [formData, setFormData] = useState({
        title: '',
        mainCharacterId: '',
        theme: '',
        location: '',
        summary: '',
        printFormatId: '',
        pageCount: 8,
    });
    const [formError, setFormError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(null);
        if (!formData.title || !formData.mainCharacterId || !formData.theme || !formData.location || !formData.summary || !formData.printFormatId || !formData.pageCount) {
            setFormError("Por favor, preencha todos os campos obrigatórios.");
            return;
        }
        onGenerate('story', formData);
    };

    return (
        <motion.form onSubmit={handleSubmit} className={styles.formContainer} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button type="button" onClick={onBack} className={styles.backButton}><FaArrowLeft /> Mudar tipo de livro</button>
            <h2 className={styles.formTitle}>Novo Livro de História</h2>
            {formError && <p className={styles.errorMessage}>{formError}</p>}
            <div className={styles.formGroup}>
                <label>Título do Livro</label>
                <input name="title" type="text" value={formData.title} onChange={handleChange} placeholder="Ex: A Grande Aventura na Floresta Encantada" required />
            </div>
            <div className={styles.formGroup}>
                <label>Personagem Principal</label>
                <select name="mainCharacterId" value={formData.mainCharacterId} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    {officialCharacters.map(char => <option key={char.id} value={char.id}>{char.name}</option>)}
                </select>
            </div>
            <div className={styles.formGroup}>
                <label>Tema da História</label>
                <input name="theme" type="text" value={formData.theme} onChange={handleChange} placeholder="Ex: Uma jornada sobre coragem, O mistério da floresta" required />
            </div>
            <div className={styles.formGroup}>
                <label>Onde a história se passa?</label>
                <input name="location" type="text" value={formData.location} onChange={handleChange} placeholder="Ex: Numa cidade flutuante, num reino subaquático" required />
            </div>
            <div className={styles.formGroup}>
                <label>Mini-resumo para guiar a história</label>
                <textarea name="summary" rows="3" value={formData.summary} onChange={handleChange} placeholder="Ex: JackBoo encontra um mapa antigo e decide procurar um tesouro perdido, mas descobre que a maior riqueza é a amizade." required />
            </div>
            <div className={styles.grid}>
                <div className={styles.formGroup}>
                    <label>Formato de Impressão</label>
                    <select name="printFormatId" value={formData.printFormatId} onChange={handleChange} required>
                        <option value="">Selecione...</option>
                        {availablePrintFormats.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Quantidade de Cenas (1 cena = 1 ilust. + 1 texto)</label>
                    <input name="pageCount" type="number" value={formData.pageCount} onChange={handleChange} min="1" required />
                </div>
            </div>
            <div className={styles.submitWrapper}>
                <button type="submit" className={styles.submitButton}><FaMagic /> Gerar Livro</button>
            </div>
        </motion.form>
    );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---

export default function CreateBookPage() {
    const [bookType, setBookType] = useState(null);
    const [availablePrintFormats, setAvailablePrintFormats] = useState([]);
    const [officialCharacters, setOfficialCharacters] = useState([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);
    const [errorOptions, setErrorOptions] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false); // Mantido para feedback visual no botão, se desejar
    const router = useRouter();

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setIsLoadingOptions(true);
                setErrorOptions(null);

                const [printFormatsRes, charactersRes] = await Promise.all([
                    adminTaxonomiesService.listPrintFormats(),
                    adminCharactersService.listOfficialCharacters(),
                ]);
                
                setAvailablePrintFormats(printFormatsRes);
                setOfficialCharacters(charactersRes);

            } catch (err) {
                console.error("Erro ao carregar opções para geração de livro:", err);
                setErrorOptions("Falha ao carregar opções: " + err.message);
            } finally {
                setIsLoadingOptions(false);
            }
        };
        fetchOptions();
    }, []);

    const handleGenerate = (type, formData) => {
        // Define o estado de geração para desabilitar o botão e evitar múltiplos cliques
        setIsGenerating(true);
        try {
            // 1. Cria um objeto URLSearchParams para construir a query string
            const params = new URLSearchParams();
            
            params.append('bookType', type);
            params.append('title', formData.title);
            params.append('characterId', formData.mainCharacterId);
            params.append('printFormatId', formData.printFormatId);
            params.append('pageCount', formData.pageCount);
            params.append('theme', formData.theme);

            // Adiciona parâmetros específicos de livro de história se existirem
            if (type === 'story') {
                params.append('location', formData.location || '');
                params.append('summary', formData.summary || '');
            }
            
            // 2. Redireciona para a nova página de geração com os parâmetros na URL
            router.push(`/admin/create-book/generating?${params.toString()}`);
            
        } catch (err) {
            console.error("Erro ao preparar para geração:", err);
            alert("Ocorreu um erro inesperado ao tentar iniciar a geração: " + err.message);
            setIsGenerating(false); // Reseta o estado em caso de erro
        }
    };

    if (isLoadingOptions) {
        return (
            <motion.div className={styles.container}>
                <p className={styles.loadingMessage}>Carregando opções e personagens...</p>
            </motion.div>
        );
    }

    if (errorOptions) {
        return (
            <motion.div className={styles.container}>
                <p className={styles.errorMessage}>{errorOptions}</p>
            </motion.div>
        );
    }
    
    if (availablePrintFormats.length === 0) {
         return (
            <motion.div className={styles.container}>
                <p className={styles.errorMessage}>Nenhum formato de impressão ativo encontrado. Por favor, <a href="/admin/print-formats">configure os formatos de impressão</a> antes de criar um livro.</p>
            </motion.div>
        );
    }
    if (officialCharacters.length === 0) {
        return (
            <motion.div className={styles.container}>
                <p className={styles.errorMessage}>Nenhum personagem oficial encontrado. Por favor, <a href="/admin/characters">crie personagens oficiais</a> antes de criar um livro.</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className={styles.header}>
                <h1 className={styles.title}>Criar Novo Livro Oficial</h1>
                <p className={styles.subtitle}>Siga os passos para gerar um novo livro para a plataforma.</p>
            </div>

            <div className={styles.content}>
                <AnimatePresence mode="wait">
                    {!bookType ? (
                        <motion.div
                            key="selection"
                            className={styles.typeSelector}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h2 className={styles.stepTitle}>Passo 1: Escolha o tipo de livro</h2>
                            <div className={styles.cardContainer}>
                                <motion.div 
                                    className={styles.typeCard} 
                                    onClick={() => setBookType('coloring')}
                                    whileHover={{ y: -10 }}
                                >
                                    <FaPalette className={styles.typeIcon} />
                                    <h3>Livro de Colorir</h3>
                                    <p>Foco em um tema para atividades de pintura.</p>
                                </motion.div>
                                <motion.div 
                                    className={styles.typeCard} 
                                    onClick={() => setBookType('story')}
                                    whileHover={{ y: -10 }}
                                >
                                    <FaFeatherAlt className={styles.typeIcon} />
                                    <h3>Livro de História</h3>
                                    <p>Crie uma narrativa com ilustrações e texto.</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <h2 className={styles.stepTitle}>Passo 2: Preencha os detalhes</h2>
                            {isGenerating && <p className={styles.generatingMessage}>Redirecionando para a tela de geração...</p>}
                            {bookType === 'coloring' && 
                                <ColoringBookForm 
                                    onBack={() => setBookType(null)} 
                                    onGenerate={handleGenerate} 
                                    availablePrintFormats={availablePrintFormats}
                                    officialCharacters={officialCharacters}
                                />}
                            {bookType === 'story' && 
                                <StoryBookForm 
                                    onBack={() => setBookType(null)} 
                                    onGenerate={handleGenerate}
                                    availablePrintFormats={availablePrintFormats}
                                    officialCharacters={officialCharacters}
                                />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}