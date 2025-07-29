// src/components/ProductGrid/ProductGrid.js
'use client';
import React, { useState } from 'react'; // Keep useState for pagination
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link'; // Added Link for navigation
import styles from './ProductGrid.module.css';
import Pagination from '../Pagination/Pagination';
import { useCart } from '@/contexts/CartContext'; // Import useCart

// Removed mock data as it will come from props

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Renamed from ProductGrid to ShopProductGrid to avoid confusion with the file name if needed, but not strictly required
const ShopProductGrid = ({ products, isLoading, error }) => { // Accept products, isLoading, error
  const { addToCart } = useCart();

  // --- PAGINAÇÃO ---
  const productsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Reset pagination when products change (e.g., filters applied in the future)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent click from propagating to parent Link
    e.preventDefault(); // Prevent default link navigation

    // For simplicity, always add the first variation found
    const defaultVariation = product.variations?.[0];

    if (defaultVariation) {
        addToCart(product, defaultVariation, 1);
    } else {
        alert("Nenhuma variação de preço disponível para este livro.");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.statusMessage}>
        <div className={styles.spinner}></div>
        <p>Carregando produtos mágicos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.statusMessage}>
        <p className={styles.errorMessage}>Oops! A magia falhou em carregar os produtos: {error}</p>
      </div>
    );
  }

  if (products.length === 0 && !isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <h3 className={styles.emptyMessage}>Nenhuma maravilha mágica encontrada no momento!</h3>
        <p className={styles.emptySubMessage}>Nossos elfos estão trabalhando para reabastecer as prateleiras.</p>
      </div>
    );
  }

  return (
    <div>
        <motion.div
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={currentPage} // Forces re-render and animation on page change
        >
            {currentProducts.map(product => (
                // Wrap the entire card with Link for easier navigation
                <Link href={`/book-details/${product.id}`} passHref key={product.id}>
                    <motion.div
                        className={styles.card}
                        style={{ backgroundColor: product.bgColor || 'white' }} // Use bgColor from API if available
                        variants={cardVariants}
                        whileHover={{ y: -8, rotate: 1, scale: 1.03 }}
                    >
                        <div className={styles.imageWrapper}>
                            <Image
                                src={product.coverUrl || '/images/product-book.png'} // Use coverUrl from API
                                alt={product.title} // Use product.title
                                width={200}
                                height={150}
                                className={styles.productImage}
                            />
                        </div>
                        <h3 className={styles.productName}>{product.title}</h3>
                        {product.variations?.[0]?.price ? (
                            <p className={styles.productPrice}>A partir de: R$ {product.variations[0].price.toFixed(2).replace('.', ',')}</p>
                        ) : (
                            <p className={styles.productPrice}>Preço indisponível</p>
                        )}

                        {product.variations?.[0] && ( // Only show button if there's a price
                            <motion.button
                                className={styles.buyButton}
                                onClick={(e) => handleAddToCart(e, product)} // Add to cart handler
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Quero esse!
                            </motion.button>
                        )}
                    </motion.div>
                </Link>
            ))}
        </motion.div>
        {totalPages > 1 && ( // Only show pagination if there's more than one page
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
    </div>
  );
};

export default ShopProductGrid; // Export as ShopProductGrid