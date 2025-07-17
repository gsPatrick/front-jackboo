// src/components/ProductGrid/ProductGrid.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './ProductGrid.module.css';
import Pagination from '../Pagination/Pagination'; // Importa o componente de paginação

const allProducts = [
  { id: 1, name: 'Livro de Colorir Personalizado', price: '39,90', imageUrl: '/images/product-coloring-book.png', bgColor: '#E0F2F7' },
  { id: 2, name: 'Livro de História Personalizado', price: '39,90', imageUrl: '/images/product-coloring-book.png', bgColor: '#FFF2E0' },
  { id: 3, name: 'Cards Colecionáveis de Colorir', price: '4,90', imageUrl: '/images/product-coloring-book.png', bgColor: '#E8F7E0' },
  { id: 4, name: 'Kits Especiais', price: '49,90', imageUrl: '/images/product-coloring-book.png', bgColor: '#F7E0E8' },
  { id: 5, name: 'Páginas Avulsas', price: '2,99', imageUrl: '/images/product-coloring-book.png', bgColor: '#E0F2F7' },
  { id: 6, name: 'Álbum de Cards', price: '29,90', imageUrl: '/images/product-coloring-book.png', bgColor: '#FFF2E0' },
  // ... adicione mais 10 a 15 produtos para simular a paginação
  { id: 7, name: 'Kit Aventuras JackBoo', price: '59,90', imageUrl: '/images/product-coloring-book.png', bgColor: '#E8F7E0' },
  { id: 8, name: 'Card Especial Dourado', price: '9,90', imageUrl: '/images/product-coloring-book.png', bgColor: '#F7E0E8' },
  // ...
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ProductGrid = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 6;
  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  
  const currentProducts = allProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div>
        <motion.div 
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={currentPage} // Força re-render e animação ao mudar de página
        >
            {currentProducts.map(product => (
                <motion.div 
                    key={product.id} 
                    className={styles.card} 
                    style={{ backgroundColor: product.bgColor }}
                    variants={cardVariants}
                    whileHover={{ y: -8, rotate: 1, scale: 1.03 }}
                >
                <div className={styles.imageWrapper}>
                    <Image src={product.imageUrl} alt={product.name} width={200} height={150} className={styles.productImage} />
                </div>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productPrice}>A partir de: R$ {product.price}</p>
                <motion.button 
                    className={styles.buyButton}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Quero esse!
                </motion.button>
                </motion.div>
            ))}
        </motion.div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default ProductGrid;