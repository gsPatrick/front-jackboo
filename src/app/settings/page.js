// src/app/settings/page.js
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';

// Importar os componentes das abas (agora seções)
import ProfileSettings from '@/components/Settings/ProfileSettings';
import PrivacySettings from '@/components/Settings/PrivacySettings';
import PlansSettings from '@/components/Settings/PlansSettings';
// Importar o novo componente da Sidebar
import SettingsSidebar from '@/components/Settings/SettingsSidebar';

// Definir as seções e seus componentes correspondentes
const sections = [
    { id: 'profile', label: 'Perfil', component: ProfileSettings },
    { id: 'privacy', label: 'Privacidade', component: PrivacySettings },
    { id: 'plans', label: 'Planos', component: PlansSettings },
];

// Variantes para a transição do conteúdo da seção
const sectionContentVariants = {
    initial: { opacity: 0, x: 30 }, // Animação entrando pela direita
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30, transition: { duration: 0.3 } }, // Animação saindo pela esquerda
};


export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState(sections[0].id); // Começa na primeira seção ('profile')

    // Encontrar o componente da seção ativa
    const ActiveSectionComponent = sections.find(section => section.id === activeSection)?.component;

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <motion.h1
                    className={styles.pageTitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Minhas <span className={styles.highlight}>Configurações</span>
                </motion.h1>

                {/* NOVO: Layout com Sidebar e Área de Conteúdo */}
                <div className={styles.settingsLayout}>
                    {/* Sidebar */}
                    <SettingsSidebar
                        sections={sections} // Passa a lista de seções
                        activeSection={activeSection} // Passa a seção ativa
                        onSectionChange={setActiveSection} // Passa a função para mudar a seção
                    />

                    {/* Área de Conteúdo da Seção Ativa */}
                    <div className={styles.contentArea}>
                         {/* AnimatePresence para animar a transição entre os componentes das seções */}
                        <AnimatePresence mode="wait"> {/* mode="wait" espera a saída antes da entrada */}
                             {/* Renderiza o componente da seção ativa com animação */}
                            <motion.div
                                key={activeSection} // Chave que muda com a seção ativa
                                variants={sectionContentVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className={styles.sectionContentWrapper} // Wrapper para dar padding/estilo
                            >
                                {ActiveSectionComponent ? <ActiveSectionComponent /> : null}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </main>
    );
}