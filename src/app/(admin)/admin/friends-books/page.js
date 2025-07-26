// src/app/(admin)/admin/friends-books/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { adminBooksService } from '@/services/api';
import BookListing from '@/components/Admin/BookListing/BookListing';

// Adicionando a URL base para construir os links das imagens
const API_BASE_URL = 'https://geral-jackboo.r954jc.easypanel.host';

export default function FriendsBooksPage() {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        try {
            // ✅ CORREÇÃO: Chama o novo método da API
            const response = await adminBooksService.listUserBooks();
            
            // Formata os dados da API para o formato que o BookListing espera
            const formattedBooks = (response.books || []).map(book => ({
                id: book.id,
                title: book.title,
                imageUrl: `${API_BASE_URL}${book.variations?.[0]?.coverUrl || '/images/placeholder-cover.png'}`,
                type: book.variations?.[0]?.type === 'colorir' ? 'Colorir' : 'História',
                status: book.status,
                // Mapeia o autor para o formato esperado pelo componente
                author: {
                    name: book.author?.nickname || 'Autor Desconhecido',
                    slug: book.author?.nickname || 'autor-desconhecido'
                }
            }));
            setBooks(formattedBooks);
        } catch (error) {
            toast.error(`Erro ao buscar livros dos amigos: ${error.message}`);
            setBooks([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleBookDelete = async (bookId) => {
        if(window.confirm("Tem certeza que deseja deletar este livro? Esta ação não pode ser desfeita.")) {
            try {
                // ✅ CORREÇÃO: Chama a API para deletar o livro
                await adminBooksService.deleteOfficialBook(bookId);
                toast.success("Livro deletado com sucesso!");
                fetchBooks(); // Recarrega a lista
            } catch (error) {
                toast.error(`Falha ao deletar o livro: ${error.message}`);
            }
        }
    };
    
    const handleStatusChange = async (bookId, newStatus) => {
        try {
            await adminBooksService.updateOfficialBookStatus(bookId, newStatus);
            toast.success(`Status do livro atualizado para "${newStatus}"!`);
            fetchBooks();
        } catch (error) {
            toast.error(`Falha ao atualizar o status: ${error.message}`);
        }
    };

    if (isLoading) {
        return <div>Carregando livros dos amigos...</div>;
    }

    return (
        <>
            <ToastContainer position="bottom-right" theme="colored" />
            <BookListing
                title="Livros dos Amigos"
                subtitle="Gerencie os livros criados pelos usuários da plataforma."
                books={books}
                showAuthor={true} // Mantém a exibição do autor
                onBookDelete={handleBookDelete}
                onStatusChange={handleStatusChange} // Passa a função de mudança de status
            />
        </>
    );
}