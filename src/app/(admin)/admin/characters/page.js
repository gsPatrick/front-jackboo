'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './page.module.css';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage } from 'react-icons/fa';
import { adminCharactersService } from '@/services/api';

// --- Componente Modal (Nenhuma mudança necessária aqui) ---
const CharacterModal = ({ character, onClose, onSave }) => {
    const [name, setName] = useState(character ? character.name : '');
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(character ? `https://geral-jackboo.r954jc.easypanel.host${character.generatedCharacterUrl}` : null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!name || (!imageFile && !character)) {
            setError('Nome e Imagem são obrigatórios.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        if (imageFile) {
            formData.append('characterImage', imageFile);
        }
        
        onSave(formData, character ? character.id : null);
    };

    return (
        <motion.div className={styles.modalBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modalContent} initial={{ y: -50 }} animate={{ y: 0 }} exit={{ y: -50 }}>
                <button onClick={onClose} className={styles.closeButton}><FaTimes /></button>
                <h2>{character ? 'Editar' : 'Criar Novo'} Personagem Oficial</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Nome do Personagem</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Imagem do Personagem</label>
                        <div className={styles.imageUploadBox} onClick={() => fileInputRef.current.click()}>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" style={{ display: 'none' }} />
                            {preview ? (
                                <Image src={preview} alt="Preview" layout="fill" objectFit="cover" unoptimized />
                            ) : (
                                <div className={styles.uploadPlaceholder}>
                                    <FaImage />
                                    <span>Clique para selecionar uma imagem</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <button type="submit" className={styles.saveButton}>{character ? 'Salvar Alterações' : 'Criar Personagem'}</button>
                </form>
            </motion.div>
        </motion.div>
    );
};


// --- Componente Principal da Página ---
export default function ManageCharactersPage() {
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCharacter, setEditingCharacter] = useState(null);

    const fetchCharacters = async () => {
        try {
            setIsLoading(true);
            const data = await adminCharactersService.listOfficialCharacters();
            setCharacters(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    const handleOpenModal = (character = null) => {
        setEditingCharacter(character);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCharacter(null);
    };

    const handleSaveCharacter = async (formData, characterId) => {
        try {
            if (characterId) {
                await adminCharactersService.updateOfficialCharacter(characterId, formData);
            } else {
                await adminCharactersService.createOfficialCharacter(formData);
            }
            fetchCharacters();
            handleCloseModal();
        } catch (err) {
            alert(`Erro ao salvar personagem: ${err.message}`);
        }
    };
    
    const handleDeleteCharacter = async (characterId) => {
        if (window.confirm('Tem certeza que deseja deletar este personagem? Esta ação não pode ser desfeita.')) {
            try {
                await adminCharactersService.deleteOfficialCharacter(characterId);
                fetchCharacters();
            } catch (err) {
                alert(`Erro ao deletar personagem: ${err.message}`);
            }
        }
    };

    if (isLoading) return <p>Carregando personagens...</p>;
    if (error) return <p className={styles.errorMessage}>Erro: {error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Gerenciar Personagens Oficiais</h1>
                <button className={styles.addButton} onClick={() => handleOpenModal()}>
                    <FaPlus /> Adicionar Personagem
                </button>
            </div>

            <div className={styles.characterGrid}>
                {characters.length === 0 ? (
                    <p>Nenhum personagem oficial encontrado. Clique em "Adicionar Personagem" para começar.</p>
                ) : (
                    characters.map(char => (
                        <motion.div key={char.id} className={styles.characterCard} whileHover={{ y: -5 }}>
                            <div className={styles.cardImage}>
                                {/* --- CORREÇÃO AQUI --- */}
                                <Image 
                                    src={`https://geral-jackboo.r954jc.easypanel.host${char.generatedCharacterUrl}`} 
                                    alt={char.name} 
                                    layout="fill" 
                                    objectFit="cover" 
                                    unoptimized
                                />
                                {/* --- FIM DA CORREÇÃO --- */}
                            </div>
                            <div className={styles.cardContent}>
                                <h3>{char.name}</h3>
                                <div className={styles.cardActions}>
                                    <button onClick={() => handleOpenModal(char)}><FaEdit /> Editar</button>
                                    <button onClick={() => handleDeleteCharacter(char.id)} className={styles.deleteButton}><FaTrash /> Deletar</button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <CharacterModal
                        character={editingCharacter}
                        onClose={handleCloseModal}
                        onSave={handleSaveCharacter}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}