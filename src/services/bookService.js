import {
  getAll,
  create,
  getById,
  update,
  remove,
} from '../repositories/bookRepo.js';

import { getById as getGenreById } from '../repositories/genreRepo.js';

export async function getAllBooks(options) {
  return getAll(options);
}

export async function createBook(bookData) {
  const genre = await getGenreById(bookData.genreId);

  if (!genre) {
    const error = new Error(`Genre with id: ${bookData.genreId} not found`);
    error.status = 404;
    throw error;
  }

  return create(bookData);
}

export async function getBookById(id) {
  const book = await getById(id);

  if (book) return book;

  const error = new Error(`Book with id: ${id} not found`);
  error.status = 404;
  throw error;
}

export async function updateBook(id, bookData) {
  if (bookData.genreId !== undefined) {
    const genre = await getGenreById(bookData.genreId);

    if (!genre) {
      const error = new Error(`Genre with id: ${bookData.genreId} not found`);
      error.status = 404;
      throw error;
    }
  }

  const updatedBook = await update(id, bookData);

  if (updatedBook) return updatedBook;

  const error = new Error(`Book with id: ${id} not found`);
  error.status = 404;
  throw error;
}

export async function deleteBook(id) {
  const result = await remove(id);

  if (result) return;

  const error = new Error(`Book with id: ${id} not found`);
  error.status = 404;
  throw error;
}
