// /app/(admin)/admin/leonardo/datasets/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaPlus, FaUpload, FaTrash, FaImages, FaInfoCircle } from 'react-icons/fa';
import { adminLeonardoService } from '@/services/api';
import styles from './Datasets.module.css';
import CreateDatasetModal from './_components/CreateDatasetModal';
import UploadImageModal from './_components/UploadImageModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DatasetsPage = () => {
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchDatasets = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await adminLeonardoService.listDatasets();
      setDatasets(data);
    } catch (error) {
      toast.error(`Erro ao buscar datasets: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  const handleDelete = async (datasetId) => {
    if (window.confirm('Tem certeza que deseja deletar este dataset? Esta ação é irreversível e também o removerá do Leonardo.AI.')) {
      try {
        await adminLeonardoService.deleteDataset(datasetId);
        toast.success('Dataset deletado com sucesso!');
        fetchDatasets();
      } catch (error) {
        toast.error(`Falha ao deletar dataset: ${error.message}`);
      }
    }
  };

  const handleOpenUploadModal = (dataset) => {
    setSelectedDataset(dataset);
    setIsUploadModalOpen(true);
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ToastContainer position="bottom-right" theme="colored" />
      <div className={styles.header}>
        <h1 className={styles.title}>Gerenciar Datasets do Leonardo.AI</h1>
        <button className={styles.createButton} onClick={() => setIsCreateModalOpen(true)}>
          <FaPlus /> Criar Novo Dataset
        </button>
      </div>
      <p className={styles.subtitle}>
        Datasets são coleções de imagens usadas para treinar seus modelos de IA (Elements).
      </p>

      {isLoading ? (
        <p>Carregando datasets...</p>
      ) : datasets.length === 0 ? (
        <div className={styles.emptyState}>
          <FaInfoCircle size={40} />
          <p>Nenhum dataset encontrado.</p>
          <span>Clique em "Criar Novo Dataset" para começar.</span>
        </div>
      ) : (
        <div className={styles.grid}>
          {datasets.map(dataset => (
            <motion.div 
              key={dataset.id} 
              className={styles.card}
              whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
            >
              <h3 className={styles.cardTitle}>{dataset.name}</h3>
              <p className={styles.cardDescription}>{dataset.description || 'Sem descrição'}</p>
              <div className={styles.cardFooter}>
                <Link href={`/admin/leonardo/datasets/${dataset.id}`} passHref>
                  <div className={`${styles.actionButton} ${styles.gallery}`}>
                    <FaImages /> Galeria
                  </div>
                </Link>
                <button className={`${styles.actionButton} ${styles.upload}`} onClick={() => handleOpenUploadModal(dataset)}>
                  <FaUpload /> Upload
                </button>
                <button className={`${styles.actionButton} ${styles.delete}`} onClick={() => handleDelete(dataset.id)}>
                  <FaTrash /> Deletar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <CreateDatasetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchDatasets();
          setIsCreateModalOpen(false);
        }}
      />

      {selectedDataset && (
        <UploadImageModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          dataset={selectedDataset}
        />
      )}
    </motion.div>
  );
};

export default DatasetsPage;