// src/components/FeaturedProducts/FeaturedProducts.js
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './FeaturedProducts.module.css';
import { shopService } from '@/services/api';
import { useCart } from '@/contexts/CartContext'; // <-- IMPORTA O HOOK DO CARRINHO

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart(); // <-- OBTÉM A FUNÇÃO addToCart

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await shopService.getJackbooShelf({ limit: 6 });
        // Assume que a API retorna `books` e que cada `book` tem `variations[0].price` e `coverUrl`
        setProducts(data.books);
      } catch (err) {
        console.error("Erro ao buscar produtos em destaque:", err);
        setError("Oops! A magia falhou em carregar os produtos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handler para adicionar ao carrinho
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Impede que o clique se propague para o Link pai
    e.preventDefault(); // Impede a navegação padrão do Link

    // Para produtos em destaque, assumimos que pegaremos a primeira variação disponível
    // Em um cenário real, o usuário escolheria a variação na página de detalhes
    const defaultVariation = product.variations?.[0];

    if (defaultVariation) {
        addToCart(product, defaultVariation, 1);
    } else {
        alert("Nenhuma variação de preço disponível para este livro.");
    }
  };


  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.loadingMessage}>Encantando as prateleiras...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.emptyMessage}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            A <span className={styles.highlight}>Lojinha Mágica</span> do JackBoo!
          </h2>
          <Link href="/shop" passHref>
            <motion.button 
              className={styles.viewAllButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver a Lojinha
            </motion.button>
          </Link>
        </div>
        
        {products.length > 0 ? (
          <motion.div
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {products.map((product) => (
              <Link href={`/book-details/${product.id}`} passHref key={product.id}>
                <motion.div
                  className={styles.productCard}
                  variants={cardVariants}
                  whileHover={{ y: -10, scale: 1.03, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.12)' }}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={product.coverUrl || '/images/product-book.png'}
                      alt={product.title}
                      width={300}
                      height={300}
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.title}</h3>
                    {product.variations?.[0]?.price ? (
                        <p className={styles.productPrice}>R$ {product.variations[0].price.toFixed(2).replace('.', ',')}</p>
                    ) : (
                        <p className={styles.productPrice}>Preço indisponível</p>
                    )}
                    
                    {product.variations?.[0] ? ( // Só mostra o botão de adicionar se houver uma variação
                        <motion.button 
                          className={styles.addToCartButton} // Renomeado para addToCartButton para clareza
                          onClick={(e) => handleAddToCart(e, product)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Adicionar ao Carrinho
                        </motion.button>
                    ) : (
                        <motion.button 
                          className={styles.viewProductButton} // Mantém o botão original se não houver variação
                          onClick={() => router.push(`/book-details/${product.id}`)} // Redireciona para detalhes
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Ver o Livro
                        </motion.button>
                    )}
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        ) : (
          <div className={styles.emptyContainer}>
            <h3 className={styles.emptyMessage}>Nossos artesãos estão criando novas magias!</h3>
            <p className={styles.emptySubMessage}>Volte em breve para ver as prateleiras cheias de aventuras e cores!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;