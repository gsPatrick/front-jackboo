// /app/(admin)/admin/leonardo/datasets/[datasetId]/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { adminLeonardoService } from '@/services/api';
import styles from './Gallery.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
// Importa o componente da biblioteca que acabamos de instalar
import ImageViewer from 'react-simple-image-viewer';

const DatasetGalleryPage = () => {
    const [dataset, setDataset] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    
    const params = useParams();
    const router = useRouter();
    const { datasetId } = params;

    const fetchDatasetDetails = useCallback(async () => {
        if (!datasetId) return;
        setIsLoading(true);
        try {
            const data = await adminLeonardoService.getDatasetDetails(datasetId);
            setDataset(data);
        } catch (error) {
            toast.error(`Erro ao buscar detalhes do dataset: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [datasetId]);

    useEffect(() => {
        fetchDatasetDetails();
    }, [fetchDatasetDetails]);

    // Mapeia as imagens para o formato que a biblioteca espera (um array de strings de URL)
    const imagesForViewer = dataset?.dataset_images.map(image => image.url) || [];

    const openImageViewer = useCallback((index) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    if (isLoading) {
        return <div className={styles.container}><p>Carregando galeria...</p></div>;
    }

    if (!dataset) {
        return <div className={styles.container}><p>Dataset não encontrado.</p></div>;
    }
    
    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <ToastContainer position="bottom-right" theme="colored" />
            <button onClick={() => router.back()} className={styles.backButton}>
                <FaArrowLeft /> Voltar para Datasets
            </button>
            <h1 className={styles.title}>{dataset.name}</h1>
            <p className={styles.subtitle}>{dataset.description || 'Sem descrição'}</p>

            {imagesForViewer.length > 0 ? (
                <div className={styles.galleryGrid}>
                    {imagesForViewer.map((src, index) => (
                        <div key={index} className={styles.imageWrapper} onClick={() => openImageViewer(index)}>
                            <Image
                                src={src}
                                alt={`Imagem ${index + 1} do dataset`}
                                width={250}
                                height={250}
                                className={styles.galleryImage}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <FaInfoCircle size={40} />
                    <p>Este dataset ainda não tem imagens.</p>
                    <span>Faça upload na página anterior para começar.</span>
                </div>
            )}

            {isViewerOpen && (
                <ImageViewer
                    src={imagesForViewer}
                    currentIndex={currentImage}
                    onClose={closeImageViewer}
                    disableScroll={false}
                    backgroundStyle={{
                        backgroundColor: "rgba(0,0,0,0.9)"
                    }}
                    closeOnClickOutside={true}
                />
            )}
        </motion.div>
    );
};

export default DatasetGalleryPage;