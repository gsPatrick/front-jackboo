// src/components/Admin/AssetPicker/AssetPicker.js
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './AssetPicker.module.css';
import { adminAssetsService } from '@/services/api'; // Importar o serviço

export default function AssetPicker({ selectedAssetIds, onToggleAsset, onClose }) {
    const [availableAssets, setAvailableAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await adminAssetsService.listAssets();
                // A API retorna { totalItems, assets, ... }, precisamos pegar o array 'assets'
                setAvailableAssets(response.assets || []); 
            } catch (err) {
                console.error("Erro ao carregar assets:", err);
                setError("Falha ao carregar assets. " + err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAssets();
    }, []);

    return (
        <div className={styles.pickerBackdrop} onClick={onClose}>
            <motion.div 
                className={styles.pickerModal} 
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <div className={styles.pickerHeader}>
                    <h4>Selecione os Assets de Referência</h4>
                    <button onClick={onClose} className={styles.closeButton}>Concluir</button>
                </div>
                <div className={styles.pickerBody}>
                    {isLoading && <p className={styles.loadingMessage}>Carregando assets...</p>}
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    {!isLoading && !error && availableAssets.length === 0 && (
                        <p className={styles.emptyMessage}>Nenhum asset disponível. Faça upload na seção "Assets de Estilo".</p>
                    )}
                    {!isLoading && !error && availableAssets.length > 0 && (
                        <div className={styles.pickerGrid}>
                            {availableAssets.map(asset => {
                                const isSelected = selectedAssetIds.includes(asset.id);
                                return (
                                    <div 
                                        key={asset.id} 
                                        className={`${styles.assetItem} ${isSelected ? styles.selected : ''}`}
                                        onClick={() => onToggleAsset(asset)}
                                    >
                                        <Image src={asset.url} alt={asset.name} layout="fill" objectFit="cover" unoptimized={true} /> 
                                        <div className={styles.assetOverlay}>
                                            <p>{asset.name}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}