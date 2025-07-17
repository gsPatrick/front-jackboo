// src/components/Championship/WinnersPodium.js
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './WinnersPodium.module.css';
import { FaTrophy } from 'react-icons/fa';

// Componente para um card individual do pódio
const PodiumCard = ({ participant, rank, delay }) => {
    if (!participant) return null; // Não renderiza se não houver participante para essa posição

    return (
        <motion.div
            className={`${styles.podiumCard} ${styles[`rank${rank}`]}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, delay: delay * 0.15 }}
        >
            <div className={styles.trophyWrapper}>
                <FaTrophy className={styles.trophyIcon} />
                <span className={styles.rankNumber}>{rank}º</span>
            </div>
            <div className={styles.avatarWrapper}>
                <Image
                    src={participant.avatarUrl || '/images/avatar-placeholder.png'}
                    alt={participant.name}
                    width={80}
                    height={80}
                    className={styles.podiumAvatar}
                />
            </div>
            <h3 className={styles.podiumName}>{participant.name}</h3>
        </motion.div>
    );
};

const WinnersPodium = ({ winners }) => {
    // Verifica se temos pelo menos o campeão para exibir o pódio
    if (!winners || !winners.first) {
        return null; // Não renderiza o componente se a final não estiver decidida
    }

    return (
        <div className={styles.podiumContainer}>
            <PodiumCard participant={winners.second} rank={2} delay={1} />
            <PodiumCard participant={winners.first} rank={1} delay={0} />
            <PodiumCard participant={winners.third} rank={3} delay={2} />
        </div>
    );
};

export default WinnersPodium;