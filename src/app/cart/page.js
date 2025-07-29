// src/app/cart/page.js
'use client';
import React from 'react'; // Removido useState e useEffect, agora vêm do contexto
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyCart from '@/components/EmptyCart/EmptyCart';
import CartItem from '@/components/CartItem/CartItem';
import CartSummary from '@/components/CartSummary/CartSummary';
import { useCart } from '@/contexts/CartContext'; // <-- IMPORTA O HOOK DO CARRINHO

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const CartPage = () => {
  const { cartItems, subtotal, updateQuantity, removeFromCart } = useCart(); // Obtém do contexto

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
                    key={`${item.id}-${item.variationId}`} // Chave única para item e variação
                    item={item}
                    // Passa as funções do contexto diretamente
                    onQuantityChange={updateQuantity}
                    onRemove={removeFromCart}
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