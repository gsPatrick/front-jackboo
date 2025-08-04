// src/app/create-character/page.js
'use client';

import React, { useState } from 'react';
import CharacterCreator from '@/components/CharacterCreator/CharacterCreator';
import BookPreview from '@/components/BookPreview/BookPreview';
import styles from './page.module.css';

const CreateCharacterPage = () => {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [bookToPreview, setBookToPreview] = useState(null);

  // ✅ ATUALIZADO: Esta função agora recebe os dados do livro gerado
  const handleGoToPreview = (bookData) => {
    setBookToPreview(bookData);
    setIsPreviewing(true);
  };

  return (
    <main className={`${styles.main} ${isPreviewing ? styles.previewBackground : ''}`}>
      <div className={styles.container}>
        {!isPreviewing ? (
          <>
            <h1 className={styles.pageTitle}>Crie seu personagem</h1>
            {/* ✅ ATUALIZADO: Passa onCreationComplete para o CharacterCreator */}
            <CharacterCreator onCreationComplete={handleGoToPreview} /> 
          </>
        ) : (
          <BookPreview book={bookToPreview} />
        )}
      </div>
    </main>
  );
};

export default CreateCharacterPage;