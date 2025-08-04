// src/app/(admin)/admin/user-generation-settings/_components/ExplanationModal.js
'use client';

import React from 'react';
import Modal from 'react-modal';
import styles from './ExplanationModal.module.css';

Modal.setAppElement('body'); // Necessário para acessibilidade

// Conteúdo das explicações das tags
const TAG_EXPLANATIONS = [
    {
        category: 'Placeholders para GPT',
        tags: [
            { tag: '[CHARACTER_DETAILS]', explanation: 'Detalhes dos personagens selecionados para a história (nome e descrição), formatados como uma lista.', context: 'Roteiros de Livro (Colorir e História)' },
            { tag: '[PAGE_COUNT]', explanation: 'O número total de páginas (cenas) que o GPT deve gerar para o miolo do livro.', context: 'Roteiro de Livro de Colorir e História' },
            { tag: '[THEME]', explanation: 'O tema principal ou gênero do livro, conforme definido pelo usuário/admin.', context: 'Roteiros de Livro (Colorir e História)' },
            { tag: '[SUMMARY]', explanation: 'Um breve resumo da história fornecido pelo usuário/admin.', context: 'Roteiro de Livro de História' },
            { tag: '[BOOK_TITLE]', explanation: 'O título do livro.', context: 'Descrição de Capa' },
            { tag: '[BOOK_GENRE]', explanation: 'O gênero do livro.', context: 'Descrição de Capa' },
            { tag: '[CHARACTER_NAMES]', explanation: 'Os nomes dos personagens principais do livro, separados por "e".', context: 'Descrição de Capa' },
            // Adicione mais tags conforme necessário
        ]
    },
    {
        category: 'Placeholders para Leonardo.AI (Elements)',
        tags: [
            { tag: '{{GPT_OUTPUT}}', explanation: 'Este placeholder é **essencial** e deve ser incluído no prompt base de todos os Elements que você treinar. É aqui que o texto gerado pelo GPT (descrição da cena, descrição da capa, etc.) será inserido para guiar a geração da imagem.', context: 'Prompts Base de Elements (Modelos de Estilo)' },
        ]
    }
];

export default function ExplanationModal({ isOpen, onClose }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
            contentLabel="Explicação das Tags de Prompt"
        >
            <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Guia de Tags de Prompt</h2>
                <button className={styles.closeButton} onClick={onClose}>×</button>
            </div>
            <div className={styles.modalBody}>
                <p>Use estas tags em seus prompts para que a IA substitua automaticamente pela informação relevante do livro ou personagem:</p>
                {TAG_EXPLANATIONS.map((category, catIndex) => (
                    <div key={catIndex} className={styles.tagSection}>
                        <h3 className={styles.sectionTitle}>{category.category}</h3>
                        {category.tags.map((item, tagIndex) => (
                            <div key={tagIndex} className={styles.tagItem}>
                                <span className={styles.tagName}>{item.tag}</span>
                                <p className={styles.tagDescription}>{item.explanation}</p>
                                <span className={styles.tagContext}>Contexto: {item.context}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className={styles.modalFooter}>
                <button className={styles.footerButton} onClick={onClose}>Entendi</button>
            </div>
        </Modal>
    );
}