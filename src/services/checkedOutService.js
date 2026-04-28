import {
  create,
  getById,
  getByUserId,
  findActiveByBookId,
  update,
  markReturned,
  getAll,
} from '../repositories/checkedOutRepo.js';

import { getById as getBookById } from '../repositories/bookRepo.js';

function formatDate(date) {
  if (!date) return null;

  const normalizedDate = date instanceof Date ? date : new Date(date);
  return normalizedDate.toISOString().split('T')[0];
}

function formatCheckoutResponse(checkout) {
  return {
    id: checkout.id,
    checkoutDate: formatDate(checkout.checkoutDate),
    dueDate: formatDate(checkout.dueDate),
    status: checkout.returned ? 'Returned' : 'Checked Out',
    book: {
      title: checkout.book?.title ?? null,
      author: checkout.book?.author ?? null,
    },
  };
}

export async function createCheckout(userId, bookId) {
  // Check if book exists
  const book = await getBookById(bookId);

  if (!book) {
    const error = new Error(`Book with id: ${bookId} not found`);
    error.status = 404;
    throw error;
  }

  // Check if already checked out
  const existingCheckout = await findActiveByBookId(bookId);

  if (existingCheckout) {
    const error = new Error('This book is already checked out');
    error.status = 409;
    throw error;
  }

  // Auto due date = 14 days from now
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  return create({
    userId,
    bookId,
    dueDate,
  });
}

export async function getMyCheckouts(userId) {
  return getByUserId(userId);
}

export async function getCheckoutById(id) {
  const checkout = await getById(id);

  if (checkout) return checkout;

  const error = new Error(`Checkout with id: ${id} not found`);
  error.status = 404;
  throw error;
}

export async function updateCheckout(id) {
  const existingCheckout = await getById(id);

  if (!existingCheckout) {
    const error = new Error(`Checkout with id: ${id} not found`);
    error.status = 404;
    throw error;
  }

  if (existingCheckout.returned) {
    const error = new Error('Book has already been returned');
    error.status = 409;
    throw error;
  }

  const nextDueDate = new Date(existingCheckout.dueDate ?? Date.now());
  nextDueDate.setDate(nextDueDate.getDate() + 14);

  const updatedCheckout = await update(id, {
    dueDate: nextDueDate,
  });

  if (updatedCheckout) return updatedCheckout;

  const error = new Error(`Checkout with id: ${id} not found`);
  error.status = 404;
  throw error;
}

export async function getAllCheckouts() {
  const checkouts = await getAll();
  return checkouts.map(formatCheckoutResponse);
}

export async function returnBook(id, userId, userRole) {
  const checkout = await getById(id);

  if (!checkout) {
    const error = new Error(`Checkout with id: ${id} not found`);
    error.status = 404;
    throw error;
  }

  if (checkout.returned) {
    const error = new Error('Book has already been returned');
    error.status = 409;
    throw error;
  }

  // Admin can return anything
  // User can only return their own checkout
  if (userRole !== 'ADMIN' && checkout.userId !== userId) {
    const error = new Error('Forbidden: you can only return your own books');
    error.status = 403;
    throw error;
  }

  return markReturned(id);
}
