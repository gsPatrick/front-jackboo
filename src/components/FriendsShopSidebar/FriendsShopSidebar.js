// src/components/FriendsShopSidebar/FriendsShopSidebar.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import styles from './FriendsShopSidebar.module.css';

// Este componente seria 'burro', apenas exibindo as opções e chamando o pai
// Em uma app real, ele receberia os filtros ativos para marcar os checkboxes/radios
const FilterGroup = ({ title, children }) => (
  <div className={styles.filterGroup}>
    <h3 className={styles.filterTitle}>{title}</h3>
    <div className={styles.optionsWrapper}>{children}</div>
  </div>
);

const FriendsShopSidebar = ({ onFilterChange }) => {
  // Para simplificar este mock, o componente apenas existe visualmente.
  // Em uma implementação real, ele teria inputs controlados e chamaria onFilterChange.

  return (
    <aside className={styles.sidebar}>
      <FilterGroup title="Tipo de Obra">
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="type" value="História" /* onChange={...} */ />
          <span className={styles.customCheckbox}></span>
          História
        </label>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="type" value="Colorir" /* onChange={...} */ />
          <span className={styles.customCheckbox}></span>
          Colorir
        </label>
        {/* Adicionar outros tipos se houver */}
      </FilterGroup>

      <FilterGroup title="Faixa Etária (Autor)">
         <label className={styles.radioLabel}>
          <input type="radio" name="ageGroup" value="0-3" /* onChange={...} */ />
          <span className={styles.customRadio}></span>
          0-3 anos
        </label>
        <label className={styles.radioLabel}>
          <input type="radio" name="ageGroup" value="4-6" /* onChange={...} */ />
          <span className={styles.customRadio}></span>
          4-6 anos
        </label>
        <label className={styles.radioLabel}>
          <input type="radio" name="ageGroup" value="7+" /* onChange={...} */ />
          <span className={styles.customRadio}></span>
          7+ anos
        </label>
         <label className={styles.radioLabel}>
          <input type="radio" name="ageGroup" value="all" defaultChecked /* onChange={...} */ />
          <span className={styles.customRadio}></span>
          Todas
        </label>
      </FilterGroup>

       {/* Adicionar filtro por Nome do Autor? Futuro */}

      {/* O botão de aplicar filtros chamaria a função de filtro no componente pai */}
      <motion.button
          className={styles.applyButton}
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           // onClick={() => onFilterChange(...)} // Chamar a função do pai
        >
          Aplicar Filtros
        </motion.button>
    </aside>
  );
};

export default FriendsShopSidebar;