// src/app/(admin)/admin/friends-books/page.js
'use client';

import React, { useState } from 'react';
import BookListing from '@/components/Admin/BookListing/BookListing';

const mockFriendsBooks = [
  { id: 'friend-hist-01', title: 'O Herói do Jardim Secreto', type: 'História', imageUrl: '/images/book.png', author: { name: 'Lívia Colorida', slug: 'livia-colorida' } },
  { id: 'friend-color-01', title: 'Criaturas Fantásticas Coloridas', type: 'Colorir', imageUrl: '/images/product-coloring-book.png', author: { name: 'Max Aventureiro', slug: 'max-aventureiro' } },
  { id: 'friend-hist-02', title: 'O Dragão Amigo', type: 'História', imageUrl: '/images/book.png', author: { name: 'Lívia Colorida', slug: 'livia-colorida' } },
];

export default function FriendsBooksPage() {
    const [books, setBooks] = useState(mockFriendsBooks);

    const handleBookDelete = (bookId) => {
        if(window.confirm("Tem certeza que deseja deletar este livro?")) {
            setBooks(books.filter(b => b.id !== bookId));
            // API call to delete
        }
    };

    return (
        <BookListing
            title="Livros dos Amigos"
            subtitle="Gerencie os livros criados pelos usuários da plataforma."
            books={books}
            showAuthor={true}
            onBookDelete={handleBookDelete}
        />
    );
}