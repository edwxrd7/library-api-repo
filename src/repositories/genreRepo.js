import prisma from '../config/db.js';

export async function getAll({
  search,
  sortBy = 'name',
  order = 'asc',
  offset = 0,
  limit = 10,
} = {}) {
  const conditions = {};

  if (search) {
    conditions.name = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const genres = await prisma.genre.findMany({
    where: conditions,
    orderBy: {
      [sortBy]: order,
    },
    skip: Number(offset),
    take: Number(limit),
  });

  return genres;
}

export async function create(data) {
  const newGenre = await prisma.genre.create({ data });
  return newGenre;
}

export async function getById(id) {
  const genre = await prisma.genre.findUnique({ where: { id } });
  return genre;
}

export async function update(id, data) {
  try {
    const updatedGenre = await prisma.genre.update({
      where: { id },
      data,
    });
    return updatedGenre;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function remove(id) {
  try {
    const deletedGenre = await prisma.genre.delete({
      where: { id },
    });
    return deletedGenre;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}
