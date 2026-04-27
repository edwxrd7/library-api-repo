import prisma from '../config/db.js';

export async function getAll({
  search,
  sortBy = 'title',
  order = 'asc',
  offset = 0,
  limit = 10,
} = {}) {
  const conditions = {};

  if (search) {
    conditions.OR = [
      {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        author: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  const books = await prisma.book.findMany({
    where: conditions,
    include: {
      genre: true,
    },
    orderBy: {
      [sortBy]: order,
    },
    skip: Number(offset),
    take: Number(limit),
  });

  return books;
}

export async function getById(id) {
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      genre: true,
    },
  });

  return book;
}

export async function create(bookData) {
  try {
    const newBook = await prisma.book.create({
      data: bookData,
    });

    return newBook;
  } catch (error) {
    if (error.code === 'P2002') {
      const err = new Error('This book already exists');
      err.status = 409;
      throw err;
    }

    throw error;
  }
}

export async function update(id, updatedData) {
  try {
    const updatedBook = await prisma.book.update({
      where: { id },
      data: updatedData,
    });

    return updatedBook;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function remove(id) {
  try {
    const deletedBook = await prisma.book.delete({
      where: { id },
    });

    return deletedBook;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}
