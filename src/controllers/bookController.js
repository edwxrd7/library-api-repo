import {
  getAllBooks,
  createBook,
  getBookById,
  deleteBook,
  updateBook,
} from '../services/bookService.js';

export async function getAllBooksHandler(req, res) {
  const books = await getAllBooks(req.query);
  res.status(200).json(books);
}

export async function createBookHandler(req, res) {
  const { title, author, yearPublished, genreId } = req.body;

  const newBook = await createBook({
    title,
    author,
    yearPublished,
    genreId,
  });

  res.status(201).json(newBook);
}

export async function getBookByIdHandler(req, res) {
  const id = parseInt(req.params.id);

  const book = await getBookById(id);

  res.status(200).json(book);
}

export async function deleteBookHandler(req, res) {
  const id = parseInt(req.params.id);

  await deleteBook(id);

  res.status(204).send();
}

export async function updateBookHandler(req, res) {
  const id = parseInt(req.params.id);

  const { title, author, yearPublished, genreId } = req.body;

  const updatedBook = await updateBook(id, {
    title,
    author,
    yearPublished,
    genreId,
  });

  res.status(200).json(updatedBook);
}
