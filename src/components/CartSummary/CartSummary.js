// src/components/CartSummary/CartSummary.js
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CartSummary.module.css';
import { FaTruck, FaMapMarkerAlt } from 'react-icons/fa';

const CartSummary = ({ subtotal }) => {
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);

  const handleCalculateShipping = () => {
    if (cep.length !== 8) {
      alert('Por favor, insira um CEP válido com 8 dígitos (somente números).');
      return;
    }
    setIsLoadingShipping(true);
    setShippingOptions([]);
    setSelectedShipping(null);

    setTimeout(() => {
      const options = [
        { id: 'sedex', carrier: 'Correios SEDEX', price: 25.50, deliveryTime: '2-5 dias úteis' },
        { id: 'pac', carrier: 'Correios PAC', price: 15.00, deliveryTime: '5-10 dias úteis' },
        { id: 'exp', carrier: 'Entrega JackBoo Expresso', price: 35.00, deliveryTime: '1-2 dias úteis' },
      ];
      setShippingOptions(options);
      setIsLoadingShipping(false);
    }, 1500);
  };

  const finalShippingCost = selectedShipping ? selectedShipping.price : 0;
  const total = subtotal + finalShippingCost;

  return (
    <motion.div className={styles.summary} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <h2 className={styles.title}>Resumo do Pedido</h2>
      <div className={styles.row}>
        <p>Subtotal</p>
        <p>R$ {subtotal.toFixed(2).replace('.', ',')}</p>
      </div>
      <div className={styles.row}>
        <p>Frete</p>
        <p>{finalShippingCost === 0 ? 'A calcular' : `R$ ${finalShippingCost.toFixed(2).replace('.', ',')}`}</p>
      </div>
      <hr className={styles.divider} />
      <div className={`${styles.row} ${styles.totalRow}`}>
        <p>Total</p>
        <p>R$ {total.toFixed(2).replace('.', ',')}</p>
      </div>

      <div className={styles.cepSection}>
        <div className={styles.jackbooMessage}>
          <motion.div 
            className={styles.speechBubble}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 150, delay: 0.3 }}
          >
            Quase lá! Pra finalizar,<br/> preciso do seu CEP! 😊
          </motion.div>
          <Image src="/images/jackboo.png" alt="JackBoo feliz" width={80} height={80} className={styles.jackbooImage} />
        </div>

        <div className={styles.cepFormControls}>
            <div className={styles.cepInputWrapper}>
                <FaMapMarkerAlt className={styles.cepIcon} />
                <input
                  type="text"
                  placeholder="CEP"
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, '').substring(0, 8))}
                  className={styles.cepInput}
                />
            </div>
            <button className={styles.calculateCepButton} onClick={handleCalculateShipping} disabled={isLoadingShipping || cep.length !== 8}>
              {isLoadingShipping ? '...' : 'Calcular'}
            </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoadingShipping && (
          <motion.div key="loading-shipping" className={styles.shippingLoading} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={styles.spinner}></div>
            <p>Buscando opções de frete...</p>
          </motion.div>
        )}
        {shippingOptions.length > 0 && !isLoadingShipping && (
          <motion.div key="shipping-options" className={styles.shippingOptions} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className={styles.optionsTitle}>Opções de Frete:</p>
            {shippingOptions.map(option => (
              <label key={option.id} className={styles.shippingOption}>
                <input
                  type="radio"
                  name="shipping"
                  value={option.id}
                  checked={selectedShipping && selectedShipping.id === option.id}
                  onChange={() => setSelectedShipping(option)}
                />
                <span className={styles.optionDetails}>
                  <FaTruck className={styles.truckIcon} />
                  {option.carrier} ({option.deliveryTime}) - R$ {option.price.toFixed(2).replace('.', ',')}
                </span>
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        className={styles.checkoutButton} 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        disabled={!selectedShipping}
      >
        Finalizar Compra
      </motion.button>
    </motion.div>
  );
};
export default CartSummary;