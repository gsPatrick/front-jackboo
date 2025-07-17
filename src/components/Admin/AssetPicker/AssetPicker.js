// src/components/Admin/AssetPicker/AssetPicker.js
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './AssetPicker.module.css';

const mockAvailableAssets = [
    { id: 'asset1', name: 'Estilo Aquarela Suave', url: '/images/how-it-works/step1-draw.png' },
    { id: 'asset2', name: 'Estilo Cartoon Vibrante', url: '/images/how-it-works/step3-character.png' },
    { id: 'asset3', name: 'JackBoo Referência Oficial', url: '/images/hero-jackboo.png' },
    { id: 'asset4', name: 'Cenário Floresta Mágica', url: '/images/club-jackboo.png' },
];

export default function AssetPicker({ selectedAssetIds, onToggleAsset, onClose }) {
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
                <div className={styles.pickerGrid}>
                    {mockAvailableAssets.map(asset => {
                        const isSelected = selectedAssetIds.includes(asset.id);
                        return (
                            <div 
                                key={asset.id} 
                                className={`${styles.assetItem} ${isSelected ? styles.selected : ''}`}
                                onClick={() => onToggleAsset(asset)}
                            >
                                <Image src={asset.url} alt={asset.name} layout="fill" objectFit="cover" />
                                <div className={styles.assetOverlay}>
                                    <p>{asset.name}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </motion.div>
        </div>
    );
}