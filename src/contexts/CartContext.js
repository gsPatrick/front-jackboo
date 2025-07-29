// src/contexts/CartContext.js
'use client';

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  // Carregar carrinho do localStorage ao iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('jackboo_cart');
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          setCartItems(parsedCart);
        } catch (error) {
          console.error("Erro ao carregar carrinho do localStorage:", error);
          localStorage.removeItem('jackboo_cart'); // Limpa dados corrompidos
        }
      }
    }
  }, []);

  // Salvar carrinho no localStorage sempre que houver mudança
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jackboo_cart', JSON.stringify(cartItems));
    }
    // Recalcular subtotal
    const newSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(newSubtotal);
  }, [cartItems]);

  const addToCart = useCallback((book, variation, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.id === book.id && item.variationId === variation.id
      );

      if (existingItemIndex > -1) {
        // Se o item (com a mesma variação) já existe, atualiza a quantidade
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Senão, adiciona um novo item
        return [
          ...prevItems,
          {
            id: book.id,
            variationId: variation.id, // Para identificar a variação específica
            name: book.title,
            variationName: variation.name,
            price: variation.price,
            quantity: quantity,
            imageUrl: variation.coverUrl || book.pageImages?.[0]?.src || '/images/product-book.png', // Usar coverUrl da variação se existir
          },
        ];
      }
    });
    alert(`${quantity}x "${book.title} (${variation.name})" adicionado ao carrinho!`);
  }, []);

  const removeFromCart = useCallback((itemId, variationId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.id === itemId && item.variationId === variationId))
    );
    alert("Item removido do carrinho.");
  }, []);

  const updateQuantity = useCallback((itemId, variationId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, variationId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && item.variationId === variationId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [removeFromCart]);

  const value = {
    cartItems,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

export default CartContext;