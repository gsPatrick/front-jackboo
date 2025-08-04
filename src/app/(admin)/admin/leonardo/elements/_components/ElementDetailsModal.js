// /app/(admin)/admin/leonardo/elements/_components/ElementDetailsModal.js
'use client';

import React from 'react'; // ✅ REMOVIDO useState, useEffect
import Modal from 'react-modal';
// ✅ REMOVIDO adminLeonardoService, toast
import styles from './TrainElementModal.module.css'; // Reutilizando os estilos

Modal.setAppElement('body');

// ✅ ATUALIZADO: Componente agora é somente para visualização
const ElementDetailsModal = ({ isOpen, onClose, element }) => { // ✅ REMOVIDO onSuccess
    // ✅ REMOVIDO useState, useEffect, handleChange, handleSubmit
    if (!element) return null; // Garante que o modal não renderize sem dados

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
            contentLabel="Detalhes do Modelo (Element)"
        >
            <h2 className={styles.modalTitle}>Detalhes do Modelo: {element.name}</h2>
            {/* ✅ REMOVIDO tag <form> e seus atributos onSubmit */}
            <div className={styles.form}> {/* Usando div para manter o estilo do formulário */}
                <div className={styles.formGroup}>
                    <label>Nome do Modelo</label>
                    <input type="text" value={element.name || ''} readOnly disabled />
                </div>

                {element.sourceDataset && (
                    <div className={styles.formGroup}>
                        <label>Dataset de Origem</label>
                        <input type="text" value={element.sourceDataset.name} readOnly disabled />
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label>Status</label>
                    <input type="text" value={element.status || 'N/A'} readOnly disabled />
                </div>

                <div className={styles.formGroup}>
                    <label>Prompt Base</label>
                    <textarea 
                        value={element.basePromptText || 'Nenhum prompt base definido'} // ✅ CORREÇÃO: Usar basePromptText
                        readOnly 
                        disabled 
                        rows="4"
                    />
                    <small className={styles.helperText}>Palavras-chave de estilo. A descrição da cena será adicionada automaticamente.</small>
                </div>
                
                <div className={styles.formGroup}>
                    <label>Descrição</label>
                    <textarea 
                        value={element.description || 'Nenhuma descrição'}
                        readOnly
                        disabled
                        rows="3"
                    />
                </div>

                <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelButton} onClick={onClose}>Fechar</button>
                    {/* ✅ REMOVIDO botão de submit */}
                </div>
            </div>
        </Modal>
    );
};

export default ElementDetailsModal;