// src/components/ShopSidebar/ShopSidebar.js
'use client';
import React from 'react';
import styles from './ShopSidebar.module.css';

const FilterGroup = ({ title, children }) => (
  <div className={styles.filterGroup}>
    <h3 className={styles.filterTitle}>{title}</h3>
    <div className={styles.optionsWrapper}>{children}</div>
  </div>
);

const ShopSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <FilterGroup title="Tipo de Produto">
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="tipo" value="livros" />
          <span className={styles.customCheckbox}></span>
          Livros
        </label>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="tipo" value="cards" />
          <span className={styles.customCheckbox}></span>
          Cards
        </label>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="tipo" value="kits" />
          <span className={styles.customCheckbox}></span>
          Kits Especiais
        </label>
      </FilterGroup>

      <FilterGroup title="Faixa Etária">
        <label className={styles.checkboxLabel}>
          <input type="radio" name="faixa-etaria" value="0-3" />
          <span className={styles.customRadio}></span>
          0-3 anos
        </label>
        <label className={styles.checkboxLabel}>
          <input type="radio" name="faixa-etaria" value="4-6" />
          <span className={styles.customRadio}></span>
          4-6 anos
        </label>
        <label className={styles.checkboxLabel}>
          <input type="radio" name="faixa-etaria" value="7+" />
          <span className={styles.customRadio}></span>
          7+ anos
        </label>
      </FilterGroup>
      
      <button className={styles.applyButton}>Aplicar Filtros</button>
    </aside>
  );
};

export default ShopSidebar;