// /app/(admin)/admin/leonardo/datasets/_components/UploadImageModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import { adminLeonardoService } from '@/services/api';
import { toast } from 'react-toastify';
import styles from './Modals.module.css';
import Image from 'next/image';
import { FaExclamationTriangle } from 'react-icons/fa'; // Importar o ícone

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
      
      <AlertBox title="Lembrete Importante">
          Cada imagem adicionada é permanente. A API do Leonardo.AI não permite deletar imagens individuais. Para remover uma imagem, o dataset inteiro precisa ser recriado.
      </AlertBox>

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