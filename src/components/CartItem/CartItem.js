// src/components/CartItem/CartItem.js
'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './CartItem.module.css';
import { FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa';

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
};

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <motion.div className={styles.item} variants={variants}>
      <Image src={item.imageUrl} alt={item.name} width={100} height={100} className={styles.image}/>
      <div className={styles.details}>
        <h3 className={styles.name}>{item.name}</h3>
        <p className={styles.price}>R$ {item.price.toFixed(2).replace('.', ',')}</p>
      </div>
      <div className={styles.quantityControl}>
        <button onClick={() => onQuantityChange(item.id, item.quantity - 1)}><FaMinus/></button>
        <span>{item.quantity}</span>
        <button onClick={() => onQuantityChange(item.id, item.quantity + 1)}><FaPlus/></button>
      </div>
      <p className={styles.total}>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
      <button className={styles.removeButton} onClick={() => onRemove(item.id)}><FaTrashAlt/></button>
    </motion.div>
  );
};
export default CartItem;