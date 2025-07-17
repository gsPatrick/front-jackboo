// src/components/Championship/KnockoutBracket.js
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './KnockoutBracket.module.css';
import { FaCheckCircle, FaTrophy } from 'react-icons/fa';

// Componente Participant (com a classe .loser adicionada no passo anterior)
const Participant = ({ participant, winnerId, matchStatus }) => {
    if (!participant) {
        return (
             <motion.div className={`${styles.participant} ${styles.empty}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className={styles.avatarPlaceholder}>?</div>
                <span className={styles.participantName}>A definir</span>
                <span className={styles.participantScore}>-</span>
            </motion.div>
        );
    }

    const isWinner = matchStatus === 'completed' && participant.id === winnerId;
    const isLoser = matchStatus === 'completed' && participant.id !== winnerId;

    return (
        <motion.div
            className={`${styles.participant} ${isWinner ? styles.winner : ''} ${isLoser ? styles.loser : ''}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className={styles.avatarWrapper}>
                <Image
                    src={participant.avatarUrl || '/images/avatar-placeholder.png'}
                    alt={participant.name}
                    width={30}
                    height={30}
                    className={styles.participantAvatar}
                />
                 {isWinner && <FaCheckCircle className={styles.winnerIcon} />}
            </div>
            <span className={styles.participantName}>{participant.name}</span>
            <span className={styles.participantScore}>
                 {participant.score !== undefined && participant.score !== null ? participant.score : '-'}
            </span>
        </motion.div>
    );
};

// Componente Match (sem alterações necessárias)
const Match = ({ match, isFinal = false }) => {
     const isActive = match.participant1 && match.participant2 && match.status !== 'completed';
     const isCompleted = match.status === 'completed';

    return (
        <motion.div
            className={`${styles.match} ${isCompleted ? styles.completed : ''} ${isActive ? styles.active : ''} ${isFinal ? styles.finalMatch : ''}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <Participant participant={match.participant1} winnerId={match.winnerId} matchStatus={match.status} />
            <div className={styles.vs}>VS</div>
            <Participant participant={match.participant2} winnerId={match.winnerId} matchStatus={match.status} />
        </motion.div>
    );
};


// Componente KnockoutBracket (LÓGICA PRINCIPAL ATUALIZADA)
const KnockoutBracket = ({ rounds }) => {
    const mainRounds = rounds.filter(round => round.name !== 'Disputa 3º Lugar');
    const thirdPlaceRound = rounds.find(round => round.name === 'Disputa 3º Lugar');

    if (mainRounds.length < 3) {
        return <p className={styles.emptyBracketMessage}>Chaveamento não disponível ou incompleto.</p>;
    }

    // Dividir os confrontos para os lados esquerdo e direito
    const quarters = mainRounds.find(r => r.name === 'Quartas de Final')?.matches || [];
    const semis = mainRounds.find(r => r.name === 'Semifinais')?.matches || [];
    const finalMatch = mainRounds.find(r => r.name === 'Final')?.matches[0] || null;

    const leftQuarters = quarters.slice(0, 2);
    const rightQuarters = quarters.slice(2, 4);

    const leftSemi = semis.slice(0, 1);
    const rightSemi = semis.slice(1, 2);

    // Identificar o campeão
    let champion = null;
    if (finalMatch && finalMatch.status === 'completed' && finalMatch.winnerId) {
        champion = finalMatch.winnerId === finalMatch.participant1?.id ? finalMatch.participant1 : finalMatch.participant2;
    }

    return (
        <div className={styles.bracketWrapper}>
            <div className={styles.bracketContainer}>

                {/* --- LADO ESQUERDO --- */}
                <div className={`${styles.round} ${styles.leftRound} ${styles.roundQuarters}`}>
                    <h3 className={styles.roundTitle}>Quartas de Final</h3>
                    <div className={styles.matchesList}>
                        {leftQuarters.map(match => <Match key={match.id} match={match} />)}
                    </div>
                </div>
                <div className={`${styles.round} ${styles.leftRound} ${styles.roundSemis}`}>
                    <h3 className={styles.roundTitle}>Semifinais</h3>
                    <div className={styles.matchesList}>
                        {leftSemi.map(match => <Match key={match.id} match={match} />)}
                    </div>
                </div>

                {/* --- COLUNA CENTRAL (FINAL E CAMPEÃO) --- */}
                <div className={styles.centerColumn}>
                    {champion ? (
                        <div className={styles.championDisplay}>
                             <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', delay: 0.5 }}>
                                <div className={styles.championTitle}>
                                     <FaTrophy /> CAMPEÃO <FaTrophy />
                                 </div>
                                <div className={styles.championCard}>
                                     <Image src={champion.avatarUrl} alt={champion.name} width={60} height={60} className={styles.championAvatar} />
                                     <span className={styles.championName}>{champion.name}</span>
                                 </div>
                             </motion.div>
                        </div>
                    ) : (
                        <div className={styles.finalMatchWrapper}>
                             <h3 className={styles.roundTitle}>Final</h3>
                             <div className={styles.matchesList}>
                                 {finalMatch ? <Match key={finalMatch.id} match={finalMatch} isFinal={true} /> : <p>A definir</p>}
                             </div>
                        </div>
                    )}

                    <motion.div className={styles.jackCharacter} animate={{ y: ['0rem', '-0.5rem', '0rem'] }} transition={{ y: { duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } }}>
                        <div className={styles.jackSpeechBubble}>Que competição emocionante! Parabéns a todos!</div>
                        <Image src="/images/bear-upload.png" alt="Jack torcendo" width={100} height={100} className={styles.jackImage} />
                    </motion.div>
                </div>

                {/* --- LADO DIREITO (ORDEM CORRIGIDA) --- */}
                <div className={`${styles.round} ${styles.rightRound} ${styles.roundSemis}`}>
                    <h3 className={styles.roundTitle}>Semifinais</h3>
                    <div className={styles.matchesList}>
                        {rightSemi.map(match => <Match key={match.id} match={match} />)}
                    </div>
                </div>
                <div className={`${styles.round} ${styles.rightRound} ${styles.roundQuarters}`}>
                    <h3 className={styles.roundTitle}>Quartas de Final</h3>
                    <div className={styles.matchesList}>
                        {rightQuarters.map(match => <Match key={match.id} match={match} />)}
                    </div>
                </div>
            </div>

            {/* --- DISPUTA DE 3º LUGAR --- */}
            {thirdPlaceRound && thirdPlaceRound.matches.length > 0 && (
                <div className={styles.thirdPlaceArea}>
                    <h3 className={styles.roundTitle}>{thirdPlaceRound.name}</h3>
                    <div className={styles.matchesList}>
                        {thirdPlaceRound.matches.map(match => <Match key={match.id} match={match} />)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default KnockoutBracket;