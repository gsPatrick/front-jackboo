// src/app/(admin)/admin/jackboo-books/page.js
'use client';

import React, { useState } from 'react';
import BookListing from '@/components/Admin/BookListing/BookListing';

const mockJackbooBooks = [
  { id: 'jb-hist-01', title: 'Minha Primeira Aventura', type: 'História', imageUrl: '/images/book.png' },
  { id: 'jb-color-01', title: 'Desenhos Mágicos da Floresta', type: 'Colorir', imageUrl: '/images/product-coloring-book.png' },
  { id: 'jb-hist-02', title: 'A Cidade Flutuante', type: 'História', imageUrl: '/images/book.png' },
  { id: 'jb-color-02', title: 'Pintando o Espaço', type: 'Colorir', imageUrl: '/images/product-coloring-book.png' },
];

export default function JackbooBooksPage() {
    const [books, setBooks] = useState(mockJackbooBooks);

    const handleBookDelete = (bookId) => {
        if(window.confirm("Tem certeza que deseja deletar este livro?")) {
            setBooks(books.filter(b => b.id !== bookId));
            // API call to delete
        }
    };

    return (
        <BookListing
            title="Livros Oficiais JackBoo"
            subtitle="Gerencie os livros de história e colorir criados pela plataforma."
            books={books}
            onBookDelete={handleBookDelete}
        />
    );
}