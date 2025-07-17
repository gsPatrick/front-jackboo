// src/app/cart/page.js
'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyCart from '@/components/EmptyCart/EmptyCart';
import CartItem from '@/components/CartItem/CartItem';
import CartSummary from '@/components/CartSummary/CartSummary';

// Mock data inicial para simulação
const initialItems = [
  { id: 1, name: 'Livro de História Personalizado', price: 39.90, quantity: 1, imageUrl: '/images/product-book.png' },
  { id: 2, name: 'Cards Colecionáveis de Colorir', price: 4.90, quantity: 3, imageUrl: '/images/product-book.png' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialItems);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const newSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(newSubtotal);
  }, [cartItems]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity === 0) {
      handleRemoveItem(id);
    } else {
      setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    }
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Meu Carrinho</h1>
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className={styles.cartLayout}>
            <motion.div className={styles.itemsList} variants={containerVariants} initial="hidden" animate="visible">
              <AnimatePresence>
                {cartItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
            <CartSummary subtotal={subtotal} />
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;    