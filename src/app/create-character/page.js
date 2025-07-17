// src/app/create-character/page.js
'use client';

import React, { useState } from 'react';
import CharacterCreator from '@/components/CharacterCreator/CharacterCreator';
import BookPreview from '@/components/BookPreview/BookPreview';
import styles from './page.module.css';

const CreateCharacterPage = () => {
  // Este estado agora controla qual componente principal é exibido
  const [isPreviewing, setIsPreviewing] = useState(false);

  return (
    // A classe do <main> muda para aplicar o fundo verde
    <main className={`${styles.main} ${isPreviewing ? styles.previewBackground : ''}`}>
      <div className={styles.container}>
        {!isPreviewing ? (
          <>
            <h1 className={styles.pageTitle}>Crie seu personagem</h1>
            <CharacterCreator onCreationComplete={() => setIsPreviewing(true)} />
          </>
        ) : (
          <BookPreview />
        )}
      </div>
    </main>
  );
};

export default CreateCharacterPage;