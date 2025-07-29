// src/components/ShopSidebar/ShopSidebar.js
'use client';
import React, { useState } from 'react'; // Import useState
import { motion } from 'framer-motion'; // Import motion for the button
import styles from './ShopSidebar.module.css';

const FilterGroup = ({ title, children }) => (
  <div className={styles.filterGroup}>
    <h3 className={styles.filterTitle}>{title}</h3>
    <div className={styles.optionsWrapper}>{children}</div>
  </div>
);

const ShopSidebar = ({ onFilterChange }) => { // Accept onFilterChange prop
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
    // Construct filters object to pass to parent
    const filters = {};
    if (selectedTypes.length > 0) {
      // Assuming 'type' filter could be 'historia' or 'colorir' based on backend
      // This might require a mapping or specific values from API.
      // For now, let's just pass them as a comma-separated string if the API expects it,
      // or handle the mapping to 'categoryId' in the parent.
      // For backend 'categoryId', we'd need actual category IDs from API.
      // Mocking for now:
      // Note: Backend Shop.service expects categoryId (integer), not string names directly.
      // This mock assumes IDs for 'Livros', 'Cards', 'Kits' from your backend taxonomies.
      // For a real scenario, you'd fetch these from /admin/taxonomies/categories.
      const categoryIds = [];
      if (selectedTypes.includes('livros')) categoryIds.push(1); // Assuming ID 1 for books
      if (selectedTypes.includes('cards')) categoryIds.push(2); // Assuming ID 2 for cards
      if (selectedTypes.includes('kits')) categoryIds.push(3); // Assuming ID 3 for kits
      if (categoryIds.length > 0) filters.categoryId = categoryIds[0]; // Backend currently only supports single categoryId
    }
    if (selectedAgeGroup !== 'all') {
      // Assuming 'ageRatingId' filter from backend.
      // Need mapping from '0-3', '4-6', '7+' to actual ageRatingId.
      // For a real scenario, you'd fetch these from /admin/taxonomies/age-ratings.
      const ageMap = {
        '0-3': 1, // Assuming ID 1 for 0-3
        '4-6': 2, // Assuming ID 2 for 4-6
        '7+': 3, // Assuming ID 3 for 7+
      };
      filters.ageRatingId = ageMap[selectedAgeGroup];
    }

    // Call the parent's filter change handler
    onFilterChange(filters);
    console.log("Aplicando filtros para Lojinha JackBoo:", filters);
  };


  return (
    <aside className={styles.sidebar}>
      <FilterGroup title="Tipo de Produto">
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="tipo" value="livros" checked={selectedTypes.includes('livros')} onChange={handleTypeChange} />
          <span className={styles.customCheckbox}></span>
          Livros
        </label>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="tipo" value="cards" checked={selectedTypes.includes('cards')} onChange={handleTypeChange} />
          <span className={styles.customCheckbox}></span>
          Cards
        </label>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="tipo" value="kits" checked={selectedTypes.includes('kits')} onChange={handleTypeChange} />
          <span className={styles.customCheckbox}></span>
          Kits Especiais
        </label>
      </FilterGroup>

      <FilterGroup title="Faixa Etária">
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

export default ShopSidebar;