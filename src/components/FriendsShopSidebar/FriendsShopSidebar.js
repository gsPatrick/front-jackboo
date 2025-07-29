// src/components/FriendsShopSidebar/FriendsShopSidebar.js
'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Import motion
import styles from './FriendsShopSidebar.module.css';

const FilterGroup = ({ title, children }) => (
  <div className={styles.filterGroup}>
    <h3 className={styles.filterTitle}>{title}</h3>
    <div className={styles.optionsWrapper}>{children}</div>
  </div>
);

const FriendsShopSidebar = ({ onFilterChange }) => { // Accept onFilterChange prop
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    setSelectedTypes(prev =>
      checked ? [...prev, value] : prev.filter(type => type !== value)
    );
  };

  const handleAgeGroupChange = (e) => {
    setSelectedAgeGroup(e.target.value);
  };

  const handleApplyFilters = () => {
    const filters = {};
    if (selectedTypes.length > 0) {
        // This mapping should ideally come from backend taxonomies
        // For now, mapping 'historia' to 'historia' and 'colorir' to 'colorir' (which are values the backend might expect in `bookType` param)
        // Note: Backend `listBooksForShop` does not currently filter by `bookType` directly (only `categoryId` and `ageRatingId`).
        // This part would require backend modification to accept a 'type' filter if you want to filter by 'historia' vs 'colorir'.
        // For the current backend, you'd filter by categoryId if you have distinct categories for story/coloring books.
        // For demonstration, we'll pass 'type' as a filter key, but it won't affect the backend unless handled.
        filters.type = selectedTypes.join(','); // Example: type=historia,colorir (if backend supports)
    }
    if (selectedAgeGroup !== 'all') {
        // This mapping should come from backend AgeRating IDs
        // For a real scenario, you'd fetch these from /admin/taxonomies/age-ratings.
        const ageMap = {
            '0-3': 1, // Example mock ID
            '4-6': 2, // Example mock ID
            '7+': 3, // Example mock ID
        };
        filters.ageRatingId = ageMap[selectedAgeGroup];
    }
    
    onFilterChange(filters);
    console.log("Aplicando filtros para Lojinha dos Amigos:", filters);
  };


  return (
    <aside className={styles.sidebar}>
      <FilterGroup title="Tipo de Livro">
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="tipo" value="historia" checked={selectedTypes.includes('historia')} onChange={handleTypeChange} />
          <span className={styles.customCheckbox}></span>
          História
        </label>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="tipo" value="colorir" checked={selectedTypes.includes('colorir')} onChange={handleTypeChange} />
          <span className={styles.customCheckbox}></span>
          Colorir
        </label>
      </FilterGroup>

      <FilterGroup title="Faixa Etária do Autor">
        <label className={styles.checkboxLabel}>
          <input type="radio" name="faixa-etaria" value="all" checked={selectedAgeGroup === 'all'} onChange={handleAgeGroupChange} />
          <span className={styles.customRadio}></span>
          Todas
        </label>
        <label className={styles.checkboxLabel}>
          <input type="radio" name="faixa-etaria" value="0-3" checked={selectedAgeGroup === '0-3'} onChange={handleAgeGroupChange} />
          <span className={styles.customRadio}></span>
          0-3 anos
        </label>
        <label className={styles.checkboxLabel}>
          <input type="radio" name="faixa-etaria" value="4-6" checked={selectedAgeGroup === '4-6'} onChange={handleAgeGroupChange} />
          <span className={styles.customRadio}></span>
          4-6 anos
        </label>
        <label className={styles.checkboxLabel}>
          <input type="radio" name="faixa-etaria" value="7+" checked={selectedAgeGroup === '7+'} onChange={handleAgeGroupChange} />
          <span className={styles.customRadio}></span>
          7+ anos
        </label>
      </FilterGroup>
      
      <motion.button 
        className={styles.applyButton}
        onClick={handleApplyFilters}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Aplicar Filtros
      </motion.button>
    </aside>
  );
};

export default FriendsShopSidebar;