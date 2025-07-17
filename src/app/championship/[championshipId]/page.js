// src/app/championship/[championshipId]/page.js
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import KnockoutBracket from '@/components/Championship/KnockoutBracket';

// --- MOCK DATA (SEM ALTERAÇÕES) ---
const mockBracketData = {
    'jackboo-art-cup-2024': {
        title: 'Chaveamento - JackBoo Art Cup 2024',
        status: 'completed',
        rounds: [
            {
                name: 'Quartas de Final',
                matches: [
                    { id: 1, participant1: { id: 'p01', name: 'Pequeno Artista', avatarUrl: '/images/character-generated.png', score: 3 }, participant2: { id: 'p02', name: 'Lívia Colorida', avatarUrl: '/images/jackboo-sad.png', score: 1 }, winnerId: 'p01', status: 'completed' },
                    { id: 2, participant1: { id: 'p03', name: 'Max Aventureiro', avatarUrl: '/images/hero-jackboo.png', score: 0 }, participant2: { id: 'p04', name: 'Sophia Criativa', avatarUrl: '/images/club-jackboo.png', score: 2 }, winnerId: 'p04', status: 'completed' },
                    { id: 3, participant1: { id: 'p05', name: 'Artista Veloz', avatarUrl: '/images/how-it-works/step1-draw.png', score: 1 }, participant2: { id: 'p06', name: 'Dino Desenhista', avatarUrl: '/images/bear-upload.png', score: 4 }, winnerId: 'p06', status: 'completed' },
                    { id: 4, participant1: { id: 'p07', name: 'Criança Feliz', avatarUrl: '/images/friends-jackboo.png', score: 2 }, participant2: { id: 'p08', name: 'Super Desenho', avatarUrl: '/images/club-jackboo-hero.png', score: 2 }, winnerId: 'p07', status: 'completed', notes: 'Criança Feliz venceu no desempate' },
                ]
            },
            {
                name: 'Semifinais',
                matches: [
                     { id: 5, participant1: { id: 'p01', name: 'Pequeno Artista', avatarUrl: '/images/character-generated.png', score: 5 }, participant2: { id: 'p04', name: 'Sophia Criativa', avatarUrl: '/images/club-jackboo.png', score: 4 }, winnerId: 'p01', status: 'completed' },
                     { id: 6, participant1: { id: 'p06', name: 'Dino Desenhista', avatarUrl: '/images/bear-upload.png', score: 3 }, participant2: { id: 'p07', name: 'Criança Feliz', avatarUrl: '/images/friends-jackboo.png', score: 1 }, winnerId: 'p06', status: 'completed' },
                ]
            },
            {
                name: 'Final',
                matches: [
                    { id: 7, participant1: { id: 'p01', name: 'Pequeno Artista', avatarUrl: '/images/character-generated.png', score: 4 }, participant2: { id: 'p06', name: 'Dino Desenhista', avatarUrl: '/images/bear-upload.png', score: 2 }, winnerId: 'p01', status: 'completed' },
                ]
            }
        ]
    },
    'summer-drawing-challenge': {
        title: 'Chaveamento - Desafio de Desenho de Verão',
        status: 'upcoming',
        rounds: [
            { name: 'Quartas de Final', matches: [ { id: 11, participant1: { id: 'a1', name: 'Sol Brilhante', avatarUrl: '/images/avatar-placeholder.png' }, participant2: { id: 'a2', name: 'Onda Criativa', avatarUrl: '/images/avatar-placeholder.png' }, winnerId: null, score1: null, score2: null, status: 'upcoming' }, { id: 12, participant1: { id: 'a3', name: 'Areia Divertida', avatarUrl: '/images/avatar-placeholder.png' }, participant2: null, winnerId: null, score1: null, score2: null, status: 'upcoming' }, { id: 13, participant1: null, participant2: null, winnerId: null, score1: null, score2: null, status: 'upcoming' }, { id: 14, participant1: null, participant2: null, winnerId: null, score1: null, score2: null, status: 'upcoming' }]},
            { name: 'Semifinais', matches: [{ id: 15, participant1: null, participant2: null, winnerId: null, score1: null, score2: null, status: 'upcoming' }, { id: 16, participant1: null, participant2: null, winnerId: null, score1: null, score2: null, status: 'upcoming' }] },
            { name: 'Final', matches: [{ id: 17, participant1: null, participant2: null, winnerId: null, score1: null, score2: null, status: 'upcoming' }] },
        ]
     },
    'monsters-cup': { // Campeonato em andamento
        title: 'Chaveamento - Copa dos Monstrinhos',
        status: 'in_progress',
        rounds: [
            {
                name: 'Quartas de Final',
                matches: [
                    { id: 21, participant1: { id: 'm1', name: 'Monstro Azul', avatarUrl: '/images/bear-upload.png', score: 5 }, participant2: { id: 'm2', name: 'Monstrinho Verde', avatarUrl: '/images/how-it-works/step3-character.png', score: 2 }, winnerId: 'm1', status: 'completed' },
                    { id: 22, participant1: { id: 'm3', name: 'Olho Roxo', avatarUrl: '/images/jackboo-sad.png', score: 1 }, participant2: { id: 'm4', name: 'Dente Mole', avatarUrl: '/images/friends-jackboo.png', score: 3 }, winnerId: 'm4', status: 'completed' },
                    { id: 23, participant1: { id: 'm5', name: 'Cabelo Maluco', avatarUrl: '/images/club-jackboo-hero.png' }, participant2: { id: 'm6', name: 'Orelha Grande', avatarUrl: '/images/how-it-works/step1-draw.png' }, winnerId: null, status: 'upcoming' },
                    { id: 24, participant1: { id: 'm7', name: 'Patas Fofas', avatarUrl: '/images/club-jackboo.png' }, participant2: { id: 'm8', name: 'Pelo Amarelo', avatarUrl: '/images/hero-jackboo.png' }, winnerId: null, status: 'upcoming' },
                ]
            },
            {
                name: 'Semifinais',
                matches: [
                     { id: 25, participant1: { id: 'm1', name: 'Monstro Azul', avatarUrl: '/images/bear-upload.png' }, participant2: { id: 'm4', name: 'Dente Mole', avatarUrl: '/images/friends-jackboo.png' }, winnerId: null, status: 'upcoming' },
                     { id: 26, participant1: null, participant2: null, winnerId: null, status: 'upcoming' },
                ]
            },
            { name: 'Final', matches: [ { id: 27, participant1: null, participant2: null, winnerId: null, status: 'upcoming' }] }
        ]
     }
};


// --- NOVO: Componente para o display do campeão ---
const ChampionDisplay = ({ champion }) => {
    if (!champion) return null;

    return (
        <motion.div
            className={styles.championDisplay}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
        >
            <div className={styles.championHeader}>
                <Image src="/images/icons/icon-trophy.svg" alt="Troféu" width={50} height={50} />
                <h2 className={styles.championTitle}>CAMPEÃO!</h2>
            </div>
            <div className={styles.championAvatarWrapper}>
                <Image src={champion.avatarUrl} alt={champion.name} width={150} height={150} className={styles.championAvatar} />
            </div>
            <h3 className={styles.championName}>{champion.name}</h3>
        </motion.div>
    );
};

// --- NOVO: Componente para o Juiz Jack ---
const JudgeJack = () => (
    <motion.div
        className={styles.judgeJackWrapper}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
    >
        <div className={styles.judgeSpeechBubble}>Que competição emocionante! Parabéns a todos!</div>
        <Image src="/images/juizjack.png" alt="Juiz JackBoo" width={200} height={200} className={styles.judgeJackImage} />
    </motion.div>
);

// --- NOVO: Componente para o Modal de Detalhes da Disputa ---
const MatchDetailsModal = ({ match, onClose }) => {
    if (!match) return null;

    const winner = match.winnerId === match.participant1?.id ? match.participant1 : match.participant2;
    const loser = match.winnerId === match.participant1?.id ? match.participant2 : match.participant1;

    return (
        <motion.div className={styles.modalBackdrop} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modalContent} onClick={(e) => e.stopPropagation()} initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
                <button className={styles.modalCloseButton} onClick={onClose}>X</button>
                <h3 className={styles.modalTitle}>Detalhes da Disputa</h3>
                <div className={styles.modalParticipants}>
                    {/* Vencedor */}
                    {winner && (
                        <div className={`${styles.modalParticipant} ${styles.modalWinner}`}>
                            <Image src={winner.avatarUrl} alt={winner.name} width={80} height={80} className={styles.modalAvatar} />
                            <p className={styles.modalParticipantName}>{winner.name}</p>
                            <p className={styles.modalParticipantScore}>{winner.score}</p>
                        </div>
                    )}
                    <span className={styles.modalVs}>VS</span>
                    {/* Perdedor */}
                    {loser && (
                         <div className={`${styles.modalParticipant} ${styles.modalLoser}`}>
                             <Image src={loser.avatarUrl} alt={loser.name} width={80} height={80} className={styles.modalAvatar} />
                             <p className={styles.modalParticipantName}>{loser.name}</p>
                             <p className={styles.modalParticipantScore}>{loser.score}</p>
                         </div>
                    )}
                </div>
                 {match.status === 'completed' && winner && (
                    <div className={styles.modalAdvancementInfo}>
                        <Image src="/images/icons/arrow-right.svg" alt="Seta" width={24} height={24} />
                        <p><strong>{winner.name}</strong> avançou para a próxima fase!</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};


// --- LÓGICA DA PÁGINA PRINCIPAL ---
export default function ChampionshipDetailPage({ params }) {
    const { championshipId } = params;
    const bracket = mockBracketData[championshipId];

    const [selectedMatch, setSelectedMatch] = useState(null);

    // --- LÓGICA PARA PEGAR O CAMPEÃO ---
    const getChampion = (rounds) => {
        if (!rounds || bracket.status !== 'completed') return null;
        const finalRound = rounds.find(r => r.name === 'Final');
        if (!finalRound || finalRound.matches[0]?.status !== 'completed') return null;
        
        const finalMatch = finalRound.matches[0];
        return finalMatch.winnerId === finalMatch.participant1.id ? finalMatch.participant1 : finalMatch.participant2;
    };

    const champion = bracket ? getChampion(bracket.rounds) : null;

    if (!bracket) {
        return <main className={styles.main}><div className={styles.container}><p className={styles.notFoundMessage}>Campeonato não encontrado!</p></div></main>;
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <motion.h1
                    className={styles.pageTitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {bracket.title}
                </motion.h1>

                {/* --- RENDERIZAÇÃO CONDICIONAL DO CAMPEÃO E DO JUIZ --- */}
                {champion && <ChampionDisplay champion={champion} />}
                <JudgeJack />

                {/* Renderiza o componente de chaveamento */}
                <KnockoutBracket rounds={bracket.rounds} onMatchClick={setSelectedMatch} />
            </div>

             {/* --- RENDERIZAÇÃO DO MODAL --- */}
            <AnimatePresence>
                {selectedMatch && (
                    <MatchDetailsModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
                )}
            </AnimatePresence>
        </main>
    );
}