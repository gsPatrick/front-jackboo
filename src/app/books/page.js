// src/app/(admin)/admin/books/page.js
'use client';

import React, { useState } from 'react';
import BookListing from '@/components/Admin/BookListing/BookListing';

const mockOfficialBooks = [
  { id: 'official-hist-01', title: 'JackBoo e a Floresta dos Sussurros', type: 'História', imageUrl: '/images/book.png' },
  { id: 'official-color-01', title: 'Colorindo com JackBoo e Amigos', type: 'Colorir', imageUrl: '/images/product-coloring-book.png' },
];

export default function OfficialBooksPage() {
    const [books, setBooks] = useState(mockOfficialBooks);

    const handleBookDelete = (bookId) => {
        if(window.confirm("Tem certeza que deseja deletar este livro oficial?")) {
            setBooks(books.filter(b => b.id !== bookId));
            // API call to delete
        }
    };

    return (
        <BookListing
            title="Livros Oficiais JackBoo"
            subtitle="Gerencie os livros principais da plataforma, criados por você."
            books={books}
            onBookDelete={handleBookDelete}
        />
    );
}