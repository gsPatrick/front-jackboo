// /app/(admin)/admin/leonardo/datasets/_components/CreateDatasetModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import { adminLeonardoService } from '@/services/api';
import { toast } from 'react-toastify';
import styles from './CreateDatasetModal.module.css';
import Image from 'next/image';
import { FaImages, FaTrash, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';

Modal.setAppElement('body');

// Componente de Aviso
const AlertBox = ({ title, children }) => (
    <div className={styles.alertBox}>
        <FaExclamationTriangle className={styles.alertIcon} />
        <div className={styles.alertContent}>
            <h4 className={styles.alertTitle}>{title}</h4>
            <p className={styles.alertText}>{children}</p>
        </div>
    </div>
);

const CreateDatasetModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetState = () => {
    setStep(1);
    setName('');
    setDescription('');
    setFiles([]);
    setPreviews([]);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };
  
  const handleNextStep = () => {
    if (!name.trim()) {
      toast.warn('O nome do dataset é obrigatório.');
      return;
    }
    setStep(2);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };
  
  const removeImage = (indexToRemove) => {
    URL.revokeObjectURL(previews[indexToRemove]);
    setFiles(files.filter((_, index) => index !== indexToRemove));
    setPreviews(previews.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length < 5) {
      toast.warn('São necessárias no mínimo 5 imagens para criar o dataset.');
      return;
    }
    setIsSubmitting(true);
    try {
      const newDataset = await adminLeonardoService.createDataset(name, description);
      toast.info(`Dataset "${name}" criado. Iniciando upload de ${files.length} imagens...`);

      const uploadPromises = files.map(file => {
          const formData = new FormData();
          formData.append('datasetImage', file);
          return adminLeonardoService.uploadImageToDataset(newDataset.id, formData);
      });
      
      await Promise.all(uploadPromises);
      
      toast.success(`Todas as ${files.length} imagens foram enviadas com sucesso!`);
      onSuccess();
      handleClose();

    } catch (error) {
      toast.error(`Falha no processo: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
      contentLabel="Criar Novo Dataset"
    >
      <h2 className={styles.modalTitle}>Criar Novo Dataset - Etapa {step} de 2</h2>
      {step === 1 && (
        <div className={styles.stepContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="datasetName">Nome do Dataset</label>
            <input id="datasetName" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Personagens Estilo Aquarela" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="datasetDescription">Descrição (Opcional)</label>
            <textarea id="datasetDescription" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" placeholder="Descreva o propósito deste dataset" />
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={handleClose}>Cancelar</button>
            <button type="button" className={styles.confirmButton} onClick={handleNextStep}>Avançar <FaArrowRight /></button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className={styles.stepContainer}>
            <AlertBox title="Atenção: Ação Irreversível">
                Selecione suas imagens com cuidado. A API do Leonardo.AI <strong>não permite deletar uma única imagem</strong> após o upload. Para remover uma imagem, você precisará apagar o dataset inteiro e criá-lo novamente.
            </AlertBox>

          <div className={styles.formGroup}>
            <label>Imagens para Treinamento ({files.length} / 50)</label>
            <input id="imageUpload" type="file" multiple accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} style={{ display: 'none' }} />
            <label htmlFor="imageUpload" className={styles.fileInputLabel}>
              <FaImages />
              <span>Adicionar Imagens</span>
            </label>
            <small>Mínimo de 5, máximo de 50 imagens.</small>
          </div>
          <div className={styles.previewGrid}>
            {previews.map((src, index) => (
              <div key={index} className={styles.previewItem}>
                <Image src={src} alt={`Preview ${index}`} width={80} height={80} />
                <button type="button" onClick={() => removeImage(index)} className={styles.removeButton}><FaTrash/></button>
              </div>
            ))}
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={() => setStep(1)}>Voltar</button>
            <button type="submit" className={`${styles.confirmButton} ${files.length < 5 ? styles.disabled : ''}`} disabled={isSubmitting || files.length < 5}>
              {isSubmitting ? 'Criando e Enviando...' : `Criar Dataset com ${files.length} Imagens`}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CreateDatasetModal;