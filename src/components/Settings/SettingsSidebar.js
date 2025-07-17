// src/components/Settings/SettingsSidebar.js
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './SettingsSidebar.module.css';

const SettingsSidebar = ({ sections, activeSection, onSectionChange }) => {
    return (
        <aside className={styles.sidebar}>
            <nav className={styles.sidebarNav}>
                <ul>
                    {sections.map(section => (
                        <motion.li
                            key={section.id}
                             whileHover={{ x: 5 }} // Efeito sutil no hover
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <button
                                className={`${styles.navButton} ${activeSection === section.id ? styles.active : ''}`}
                                onClick={() => onSectionChange(section.id)}
                            >
                                {section.label}
                            </button>
                        </motion.li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default SettingsSidebar;