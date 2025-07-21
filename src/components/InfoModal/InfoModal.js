// src/components/InfoModal/InfoModal.js
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './InfoModal.module.css';

const backdropVariants = { /* ... */ };
const modalVariants = { /* ... */ };

const steps = [
  { id: 1, label: 'Qual o nome da criança?', field: 'name', type: 'text', placeholder: 'Nome completo da criança' }, // Label alterado para clareza
  { id: 2, label: 'Sua data de nascimento:', field: 'birthDate', type: 'date', placeholder: '' },
  { id: 3, label: 'Seu telefone para contato:', field: 'phone', type: 'tel', placeholder: '(99) 99999-9999' },
  { id: 4, label: 'E por último, seu melhor e-mail:', field: 'email', type: 'email', placeholder: 'seu.email@exemplo.com' },
];

// NOVO: Adicionado prop `isCompleting` para feedback de carregamento
const InfoModal = ({ show, onClose, onComplete, isCompleting }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    phone: '',
    email: '',
  });

  const handleNext = () => {
    // Validação simples pode ser adicionada aqui
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Chama a função onComplete, que agora lida com o cadastro.
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [steps[currentStep].field]: e.target.value });
  };

  if (!show) return null;

  const currentFieldData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          className={styles.backdrop}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.leftPanel}>
              <Image src="/images/jackboo.png" alt="JackBoo" width={200} height={200} />
            </div>
            <div className={styles.rightPanel}>
              <AnimatePresence mode="wait">
                  <motion.div
                      key={currentStep}
                      className={styles.formStep}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                  >
                      <label className={styles.label}>{currentFieldData.label}</label>
                      <input
                          type={currentFieldData.type}
                          value={formData[currentFieldData.field]}
                          onChange={handleChange}
                          placeholder={currentFieldData.placeholder}
                          className={styles.input}
                          autoFocus
                      />
                  </motion.div>
              </AnimatePresence>

              <div className={styles.navigation}>
                {currentStep > 0 && (
                  <button className={styles.backButton} onClick={handleBack} disabled={isCompleting}>Voltar</button>
                )}
                {/* ALTERADO: Lógica do botão principal */}
                <button
                  className={styles.nextButton}
                  onClick={handleNext}
                  disabled={isCompleting} // Desabilita durante o carregamento
                >
                  {isCompleting ? 'Criando conta...' : (isLastStep ? 'Finalizar e Criar' : 'Avançar')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoModal;