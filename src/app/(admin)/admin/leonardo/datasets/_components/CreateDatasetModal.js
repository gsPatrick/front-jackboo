// /app/(admin)/admin/leonardo/datasets/_components/CreateDatasetModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import { adminLeonardoService } from '@/services/api';
import { toast } from 'react-toastify';
import styles from './Modals.module.css';

Modal.setAppElement('body');

const CreateDatasetModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warn('O nome do dataset é obrigatório.');
      return;
    }
    setIsSubmitting(true);
    try {
      await adminLeonardoService.createDataset(name, description);
      toast.success('Dataset criado com sucesso!');
      setName('');
      setDescription('');
      onSuccess();
    } catch (error) {
      toast.error(`Falha ao criar dataset: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
      contentLabel="Criar Novo Dataset"
    >
      <h2 className={styles.modalTitle}>Criar Novo Dataset</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="datasetName">Nome do Dataset</label>
          <input
            id="datasetName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Personagens Estilo Aquarela"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="datasetDescription">Descrição (Opcional)</label>
          <textarea
            id="datasetDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Descreva o propósito deste dataset"
          />
        </div>
        <div className={styles.modalActions}>
          <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </button>
          <button type="submit" className={styles.confirmButton} disabled={isSubmitting}>
            {isSubmitting ? 'Criando...' : 'Criar Dataset'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateDatasetModal;