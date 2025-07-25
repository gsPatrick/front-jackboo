// /app/(admin)/admin/leonardo/datasets/_components/UploadImageModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import { adminLeonardoService } from '@/services/api';
import { toast } from 'react-toastify';
import styles from './Modals.module.css';
import Image from 'next/image';

Modal.setAppElement('body');

const UploadImageModal = ({ isOpen, onClose, dataset }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
      setSelectedFile(null);
      setPreview(null);
      onClose();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.warn('Por favor, selecione um arquivo de imagem.');
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('datasetImage', selectedFile);

    try {
      await adminLeonardoService.uploadImageToDataset(dataset.id, formData);
      toast.success(`Imagem enviada com sucesso para o dataset "${dataset.name}"!`);
      handleClose();
    } catch (error) {
      toast.error(`Falha no upload: ${error.message}`);
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
      contentLabel="Upload de Imagem para Dataset"
    >
      <h2 className={styles.modalTitle}>Upload para: {dataset.name}</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="imageUpload">Selecione a Imagem</label>
          <input
            id="imageUpload"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            required
          />
        </div>
        {preview && (
          <div className={styles.previewContainer}>
            <Image src={preview} alt="Pré-visualização" width={150} height={150} style={{ objectFit: 'cover', borderRadius: '8px' }}/>
          </div>
        )}
        <div className={styles.modalActions}>
          <button type="button" className={styles.cancelButton} onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </button>
          <button type="submit" className={styles.confirmButton} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Fazer Upload'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadImageModal;