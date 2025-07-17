// src/app/(admin)/admin/create-book/page.js
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import { FaPalette, FaFeatherAlt, FaArrowLeft, FaMagic } from 'react-icons/fa';

// --- MOCK DATA ---
const mockAISettings = {
    coloring: [
        { id: 'ai-color-1', name: 'IA para Colorir - Estilo Cartoon' },
        { id: 'ai-color-2', name: 'IA para Colorir - Estilo Realista' },
    ],
    story: [
        { id: 'ai-story-1', name: 'IA de História - Estilo Aventura' },
        { id: 'ai-story-2', name: 'IA de História - Estilo Fantasia' },
    ]
};
const mockPrintFormats = [
    { id: 'fmt-1', name: 'Boobie Goods Original (25.3 x 20.1 cm)' },
    { id: 'fmt-2', name: 'Boobie Goods Falso (21.3 x 15.5 cm)' },
    { id: 'fmt-3', name: 'Cards (12.5 x 8.5 cm)' },
];

// --- COMPONENTES INTERNOS DE FORMULÁRIO ---

const ColoringBookForm = ({ onBack, onGenerate }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log("Gerando Livro de Colorir com:", data);
        onGenerate(data);
    };
    return (
        <motion.form onSubmit={handleSubmit} className={styles.formContainer} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button type="button" onClick={onBack} className={styles.backButton}><FaArrowLeft /> Mudar tipo de livro</button>
            <h2 className={styles.formTitle}>Novo Livro de Colorir</h2>
            <div className={styles.formGroup}>
                <label>Tema Principal</label>
                <input name="theme" type="text" placeholder="Ex: Dinossauros, Fundo do Mar, Robôs do Futuro" required />
            </div>
            <div className={styles.formGroup}>
                <label>Configuração de IA</label>
                <select name="aiSettingId" required><option value="">Selecione...</option>{mockAISettings.coloring.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}</select>
            </div>
            <div className={styles.grid}>
                <div className={styles.formGroup}>
                    <label>Formato de Página</label>
                    <select name="printFormatId" required><option value="">Selecione...</option>{mockPrintFormats.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
                </div>
                <div className={styles.formGroup}>
                    <label>Quantidade de Páginas (miolo)</label>
                    <input name="pageCount" type="number" defaultValue="20" min="1" required />
                </div>
            </div>
            <div className={styles.submitWrapper}>
                <button type="submit" className={styles.submitButton}><FaMagic /> Gerar Preview</button>
            </div>
        </motion.form>
    );
};

const StoryBookForm = ({ onBack, onGenerate }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log("Gerando Livro de História com:", data);
        onGenerate(data);
    };
    return (
        <motion.form onSubmit={handleSubmit} className={styles.formContainer} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button type="button" onClick={onBack} className={styles.backButton}><FaArrowLeft /> Mudar tipo de livro</button>
            <h2 className={styles.formTitle}>Novo Livro de História</h2>
            <div className={styles.formGroup}>
                <label>Tema da História</label>
                <input name="theme" type="text" placeholder="Ex: Uma jornada sobre coragem, O mistério da floresta" required />
            </div>
            <div className={styles.formGroup}>
                <label>Onde a história se passa?</label>
                <input name="location" type="text" placeholder="Ex: Numa cidade flutuante, num reino subaquático" required />
            </div>
            <div className={styles.formGroup}>
                <label>Mini-resumo para guiar a história</label>
                <textarea name="summary" rows="3" placeholder="Ex: JackBoo encontra um mapa antigo e decide procurar um tesouro perdido, mas descobre que a maior riqueza é a amizade." required />
            </div>
            <div className={styles.formGroup}>
                <label>Configuração de IA</label>
                <select name="aiSettingId" required><option value="">Selecione...</option>{mockAISettings.story.map(ai => <option key={ai.id} value={ai.id}>{ai.name}</option>)}</select>
            </div>
            <div className={styles.grid}>
                <div className={styles.formGroup}>
                    <label>Formato de Página</label>
                    <select name="printFormatId" required><option value="">Selecione...</option>{mockPrintFormats.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
                </div>
                <div className={styles.formGroup}>
                    <label>Quantidade de Cenas (1 cena = 1 ilust. + 1 texto)</label>
                    <input name="pageCount" type="number" defaultValue="10" min="1" required />
                </div>
            </div>
            <div className={styles.submitWrapper}>
                <button type="submit" className={styles.submitButton}><FaMagic /> Gerar Preview</button>
            </div>
        </motion.form>
    );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---

export default function CreateBookPage() {
    const [bookType, setBookType] = useState(null); // 'coloring' ou 'story'
    const router = useRouter();

    const handleGenerate = (formData) => {
        // Lógica para enviar para a API e navegar para o preview
        console.log("Dados a serem enviados para a API:", { bookType, ...formData });
        // Navega para a página de preview (que ainda precisa ser criada/ajustada)
        router.push('/admin/create-book/preview');
    };

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
                                <motion.div className={styles.typeCard} onClick={() => setBookType('coloring')} whileHover={{ y: -10 }}>
                                    <FaPalette className={styles.typeIcon} />
                                    <h3>Livro de Colorir</h3>
                                    <p>Foco em um tema para atividades de pintura.</p>
                                </motion.div>
                                <motion.div className={styles.typeCard} onClick={() => setBookType('story')} whileHover={{ y: -10 }}>
                                    <FaFeatherAlt className={styles.typeIcon} />
                                    <h3>Livro de História</h3>
                                    <p>Crie uma narrativa com ilustrações e texto.</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <h2 className={styles.stepTitle}>Passo 2: Preencha os detalhes</h2>
                            {bookType === 'coloring' && <ColoringBookForm onBack={() => setBookType(null)} onGenerate={handleGenerate} />}
                            {bookType === 'story' && <StoryBookForm onBack={() => setBookType(null)} onGenerate={handleGenerate} />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}