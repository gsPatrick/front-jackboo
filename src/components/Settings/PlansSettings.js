// src/components/Settings/PlansSettings.js
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './PlansSettings.module.css';
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaDollarSign } from 'react-icons/fa'; // Ícones para planos

// Mock Data: Plano do Usuário (Mais detalhes)
const mockUserPlan = {
    status: 'Ativo', // 'Ativo', 'Cancelado', 'Expirado'
    name: 'Plano Mágico', // Nome do plano atual
    price: '79,90',
    frequency: 'Mensal',
    benefits: ['1 História Personalizada', 'Brindes Exclusivos', 'Acesso Antecipado'],
    nextBillingDate: '15/08/2024', // Data da próxima cobrança
    // Adicionar histórico de faturas, etc.
};

const PlansSettings = () => {

     const handleDeactivatePlan = () => {
         // TODO: Implementar lógica para desativar o plano (provavelmente envolve um modal de confirmação)
         if (confirm("Tem certeza que deseja desativar seu plano? Sua assinatura não será renovada na próxima data de cobrança.")) {
             console.log("Simulando desativação do plano...");
             alert("Solicitação de desativação enviada.");
             // Em uma app real, atualizar estado do usuário, chamar API, etc.
         }
     };

    return (
        <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             className={styles.plansContainer}
        >
            <h2 className={styles.sectionTitle}>Meus Planos</h2>

            {/* Informações do Plano Atual */}
            <div className={styles.currentPlanInfo}>
                <p className={styles.planStatusRow}>
                    <span className={styles.planStatusIcon}>
                        {mockUserPlan.status === 'Ativo' ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />}
                    </span>
                     Status do Plano: <span className={styles.planStatusText}>{mockUserPlan.status}</span>
                 </p>
                 <p className={styles.planDetailRow}><span className={styles.planIcon}><FaCheckCircle/></span> Plano Atual: <span className={styles.planNameText}>{mockUserPlan.name}</span></p>
                 <p className={styles.planDetailRow}><span className={styles.planIcon}><FaDollarSign/></span> Valor: <span className={styles.planPriceText}>R$ {mockUserPlan.price} / {mockUserPlan.frequency}</span></p>

                 {mockUserPlan.status === 'Ativo' && mockUserPlan.nextBillingDate && (
                    <p className={styles.planDetailRow}><span className={styles.planIcon}><FaCalendarAlt/></span> Próxima Cobrança: <span className={styles.planBillingDateText}>{mockUserPlan.nextBillingDate}</span></p>
                 )}

                 <div className={styles.planBenefits}>
                     <h4>Benefícios do seu plano:</h4>
                     <ul>
                         {mockUserPlan.benefits.map((benefit, index) => (
                             <li key={index}><span className={styles.planBenefitIcon}>✓</span> {benefit}</li>
                         ))}
                     </ul>
                 </div>

                {/* Botão Desativar Plano (Mostra apenas se o plano estiver ativo) */}
                {mockUserPlan.status === 'Ativo' && (
                     <motion.button
                        className={styles.deactivateButton}
                        onClick={handleDeactivatePlan}
                         whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                     >
                         Desativar Plano
                     </motion.button>
                )}

            </div>

            {/* Seção para ver outros planos */}
            <p className={styles.explorePlansText}>
                Quer conhecer outros planos ou mudar o seu?
            </p>

            <Link href="/club" passHref>
                 <motion.button
                     className={styles.viewClubButton}
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                 >
                     Ver todos os Planos do Clube
                 </motion.button>
            </Link>

            {/* TODO: Adicionar link/seção para histórico de faturas, etc. */}

        </motion.div>
    );
};

export default PlansSettings;