// src/app/(admin)/admin/assets/page.js
'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './page.module.css';
import { FaPlus, FaImages, FaTrash, FaEdit } from 'react-icons/fa';

const mockAssets = [
    { id: 'asset1', name: 'Estilo Aquarela Suave', description: 'Um traço de aquarela suave, com cores pastéis e contornos delicados.', url: '/images/how-it-works/step1-draw.png' },
    { id: 'asset2', name: 'Estilo Cartoon Vibrante', description: 'Cores fortes e saturadas, contornos pretos bem definidos, estilo de desenho animado.', url: '/images/how-it-works/step3-character.png' },
    { id: 'asset3', name: 'JackBoo Referência Oficial', description: 'Referência oficial do personagem JackBoo, para manter a consistência do personagem.', url: '/images/hero-jackboo.png' },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };

export default function AdminAssetsPage() {
    const [assets, setAssets] = useState(mockAssets);
    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const name = prompt("Digite um nome para este asset:", file.name);
            const description = prompt("Digite uma descrição para guiar a IA (muito importante!):");
            if (name && description) {
                const newAsset = {
                    id: `asset-${Date.now()}`,
                    name,
                    description,
                    url: URL.createObjectURL(file) // URL temporária para preview
                };
                setAssets(prev => [newAsset, ...prev]);
                // Em um app real: chame a API para fazer upload do 'file' e salvar 'name' e 'description'.
            }
        }
    };

    const handleDelete = (assetId) => {
        if (window.confirm("Tem certeza? Isso pode afetar configurações de IA que usam este asset.")) {
            setAssets(prev => prev.filter(a => a.id !== assetId));
            // API call to delete
        }
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className={styles.header}>
                <h1 className={styles.title}>Assets de IA</h1>
                <p className={styles.subtitle}>Gerencie as imagens de referência para guiar o estilo das gerações da IA.</p>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept="image/png, image/jpeg"
                />
                <motion.button
                    className={styles.uploadButton}
                    onClick={handleUploadClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaPlus /> Fazer Upload de Novo Asset
                </motion.button>
            </div>

            <AnimatePresence>
                <motion.div className={styles.grid} variants={containerVariants} initial="hidden" animate="visible">
                    {assets.map(asset => (
                        <motion.div key={asset.id} className={styles.assetCard} variants={itemVariants} layout>
                            <div className={styles.imageWrapper}>
                                <Image src={asset.url} alt={asset.name} layout="fill" objectFit="cover" />
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.assetName}>{asset.name}</h3>
                                <p className={styles.assetDescription}>{asset.description}</p>
                                <div className={styles.cardActions}>
                                    <button className={styles.actionButton} title="Editar"><FaEdit /></button>
                                    <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(asset.id)} title="Deletar"><FaTrash /></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}