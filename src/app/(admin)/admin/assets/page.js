// src/app/(admin)/admin/assets/page.js
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './page.module.css';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { adminAssetsService } from '@/services/api'; // Importar o serviço

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };

export default function AdminAssetsPage() {
    const [assets, setAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const fetchAssets = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await adminAssetsService.listAssets();
            setAssets(response.assets);
        } catch (err) {
            console.error("Erro ao buscar assets:", err);
            setError("Falha ao carregar assets: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const name = prompt("Digite um nome para este asset:", file.name);
            const description = prompt("Digite uma descrição para guiar a IA (muito importante!):");

            if (name && description) {
                const formData = new FormData();
                formData.append('assetFile', file);
                formData.append('name', name);
                formData.append('description', description);

                try {
                    await adminAssetsService.createAsset(formData);
                    fetchAssets(); // Recarrega a lista após o upload
                    alert("Asset carregado com sucesso!");
                } catch (err) {
                    console.error("Erro ao fazer upload do asset:", err);
                    alert("Falha ao carregar asset: " + err.message);
                }
            } else {
                alert("Nome e descrição são obrigatórios para o asset.");
            }
        }
    };

    const handleDelete = async (assetId) => {
        if (window.confirm("Tem certeza? Isso pode afetar configurações de IA que usam este asset. Esta ação não pode ser desfeita.")) {
            try {
                await adminAssetsService.deleteAsset(assetId);
                fetchAssets(); // Recarrega a lista após a exclusão
                alert("Asset deletado com sucesso!");
            } catch (err) {
                console.error("Erro ao deletar asset:", err);
                alert("Falha ao deletar asset: " + err.message);
            }
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
                    accept="image/png, image/jpeg, image/gif"
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

            {isLoading && <p className={styles.loadingMessage}>Carregando assets...</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            {!isLoading && !error && assets.length === 0 && (
                <p className={styles.emptyMessage}>Nenhum asset encontrado. Faça upload de um novo!</p>
            )}

            <AnimatePresence>
                {!isLoading && !error && assets.length > 0 && (
                    <motion.div className={styles.grid} variants={containerVariants} initial="hidden" animate="visible">
                        {assets.map(asset => (
                            <motion.div key={asset.id} className={styles.assetCard} variants={itemVariants} layout>
                                <div className={styles.imageWrapper}>
                                    <Image src={asset.url} alt={asset.name} layout="fill" objectFit="cover" unoptimized={true} /> {/* Added unoptimized */}
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.assetName}>{asset.name}</h3>
                                    <p className={styles.assetDescription}>{asset.description}</p>
                                    <div className={styles.cardActions}>
                                        {/* A funcionalidade de edição de asset não foi implementada no backend ainda, apenas no controller */}
                                        {/* <button className={styles.actionButton} title="Editar"><FaEdit /></button> */}
                                        <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(asset.id)} title="Deletar"><FaTrash /></button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}