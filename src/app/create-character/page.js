// src/app/create-character/page.js
'use client';

import React from 'react'; // REMOVIDO: useState não é mais necessário aqui
import CharacterCreator from '@/components/CharacterCreator/CharacterCreator';
// REMOVIDO: BookPreview não será mais renderizado aqui
// import BookPreview from '@/components/Admin/BookPreview/BookPreview';
import styles from './page.module.css';
import { useRouter } from 'next/navigation'; // NOVO: Importa o useRouter

const CreateCharacterPage = () => {
  const router = useRouter(); // NOVO: Instancia o router

  // ATUALIZADO: Esta função agora redireciona para a página de preview
  const handleGoToPreview = (bookData) => {
    if (bookData && bookData.id) {
      router.push(`/books/preview/${bookData.id}`);
    } else {
      console.error("Dados do livro inválidos para redirecionamento.");
      alert("Não foi possível iniciar a geração do livro. Tente novamente.");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Lógica de renderização foi removida, agora mostra apenas o CharacterCreator */}
        <h1 className={styles.pageTitle}>Crie seu personagem</h1>
        <CharacterCreator onCreationComplete={handleGoToPreview} />
      </div>
    </main>
  );
};

export default CreateCharacterPage;