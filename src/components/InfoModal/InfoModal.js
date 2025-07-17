// src/components/InfoModal/InfoModal.js
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './InfoModal.module.css';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: {
    y: "-50%",
    x: "-50%",
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    y: "-50%",
    x: "-50%",
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 150, damping: 20 },
  },
  exit: {
    y: "-50%",
    x: "-50%",
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

const steps = [
  { id: 1, label: 'Qual o seu nome?', field: 'name', type: 'text', placeholder: 'Seu nome completo' },
  { id: 2, label: 'Sua data de nascimento:', field: 'birthDate', type: 'date', placeholder: '' },
  { id: 3, label: 'Seu telefone para contato:', field: 'phone', type: 'tel', placeholder: '(99) 99999-9999' },
  { id: 4, label: 'E por último, seu melhor e-mail:', field: 'email', type: 'email', placeholder: 'seu.email@exemplo.com' },
];

const InfoModal = ({ show, onClose, onComplete }) => {
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
      // Lógica de finalização
      console.log('Dados Finais:', formData);
      // Passa os dados para a função onComplete
      onComplete(formData); // <-- MODIFICADO AQUI
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

  // Não renderiza nada se não for para mostrar
  if (!show) return null;

  const currentFieldData = steps[currentStep];

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          className={styles.backdrop}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose} // Fecha o modal se clicar no fundo
        >
          <motion.div
            className={styles.modal}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Impede que o clique no modal o feche
          >
            {/* Coluna da Esquerda com o JackBoo */}
            <div className={styles.leftPanel}>
              <Image src="/images/jackboo.png" alt="JackBoo" width={200} height={200} />
            </div>

            {/* Coluna da Direita com o Formulário */}
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
                  <button className={styles.backButton} onClick={handleBack}>Voltar</button>
                )}
                <button className={styles.nextButton} onClick={handleNext}>
                  {currentStep === steps.length - 1 ? 'Finalizar' : 'Avançar'}
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