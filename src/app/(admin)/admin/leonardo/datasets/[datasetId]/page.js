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
import { FaArrowLeft, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import ImageViewer from 'react-simple-image-viewer';

// Componente para o aviso
const AlertBox = ({ title, children }) => (
    <div className={styles.alertBox}>
        <FaExclamationTriangle className={styles.alertIcon} />
        <div className={styles.alertContent}>
            <h4 className={styles.alertTitle}>{title}</h4>
            <p className={styles.alertText}>{children}</p>
        </div>
    </div>
);

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

            {dataset.dataset_images.length > 0 && (
                 <AlertBox title="Atenção: Gerenciamento de Imagens">
                    A API do Leonardo.AI não permite a exclusão de uma única imagem de um dataset. Para remover uma imagem, é necessário <strong>deletar o dataset inteiro</strong> na página anterior e criá-lo novamente apenas com as imagens desejadas.
                </AlertBox>
            )}

            {dataset.dataset_images.length > 0 ? (
                <div className={styles.galleryGrid}>
                    {dataset.dataset_images.map((image, index) => (
                        <div key={image.id} className={styles.imageWrapper} onClick={() => openImageViewer(index)}>
                            <Image
                                src={image.url}
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