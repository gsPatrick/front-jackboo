// src/components/FeaturedProducts/FeaturedProducts.js
'use client';

import React, { useState, useEffect } from 'react'; // NOVO: Adicionado useState e useEffect
import Image from 'next/image';
import Link from 'next/link'; // NOVO: Adicionado Link para navegação
import { motion } from 'framer-motion';
import styles from './FeaturedProducts.module.css';
import { shopService } from '@/services/api'; // NOVO: Importa o serviço da loja

// REMOVIDO: Os dados mockados não são mais necessários
// const featuredProducts = [ ... ];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const FeaturedProducts = () => {
  // NOVO: Estados para armazenar produtos, carregamento e erros
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // NOVO: Efeito para buscar os produtos da API quando o componente é montado
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Busca os 6 produtos mais recentes da loja do JackBoo
        const data = await shopService.getJackbooShelf({ limit: 6 });
        setProducts(data.books);
      } catch (err) {
        console.error("Erro ao buscar produtos em destaque:", err);
        setError("Oops! A magia falhou em carregar os produtos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // O array vazio [] garante que o efeito rode apenas uma vez

  // NOVO: Renderização para o estado de carregamento
  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.loadingMessage}>Encantando as prateleiras...</p>
        </div>
      </section>
    );
  }

  // NOVO: Renderização para o estado de erro
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
          {/* ALTERADO: Botão agora é um link para a página da loja */}
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
        
        {/* ALTERADO: Lógica para renderizar a grade ou a mensagem de vitrine vazia */}
        {products.length > 0 ? (
          <motion.div
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {products.map((product) => (
              // ALTERADO: O card inteiro agora é um link para a página de detalhes do livro
              <Link href={`/book-details/${product.id}`} passHref key={product.id}>
                <motion.div
                  className={styles.productCard}
                  variants={cardVariants}
                  whileHover={{ y: -10, scale: 1.03, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.12)' }}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={product.coverUrl || '/images/product-book.png'} // ALTERADO: Usa a URL da capa vinda da API
                      alt={product.title}
                      width={300}
                      height={300}
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.title}</h3>
                    {/* ALTERADO: Usa o preço da primeira variação vinda da API */}
                    <p className={styles.productPrice}>R$ {product.variations[0]?.price.toFixed(2).replace('.', ',')}</p>
                    <motion.button 
                      className={styles.viewProductButton}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Ver o Livro
                    </motion.button>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        ) : (
          // NOVO: Mensagem lúdica quando não há produtos
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