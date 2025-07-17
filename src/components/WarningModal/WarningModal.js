// src/components/WarningModal/WarningModal.js
'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './WarningModal.module.css';

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 150, damping: 20 } },
  exit: { opacity: 0, scale: 0.8 },
};

const WarningModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div className={styles.backdrop} variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}>
          <motion.div className={styles.modal} variants={modalVariants} onClick={(e) => e.stopPropagation()}>
            <div className={styles.speechBubble}>Oba! Para criar sua história, preciso de algumas ideias...</div>
            <Image src="/images/jackboo.png" alt="JackBoo animado" width={250} height={250} />
            <motion.button className={styles.confirmButton} onClick={onConfirm} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Vamos lá!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WarningModal;