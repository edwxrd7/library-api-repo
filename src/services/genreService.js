import {
  getAll,
  create,
  getById,
  update,
  remove,
} from '../repositories/genreRepo.js';

export async function getAllGenres(options) {
  return getAll(options);
}

export async function createGenre(name) {
  return create({ name });
}

export async function getGenreById(id) {
  const genre = await getById(id);

  if (genre) return genre;

  const error = new Error(`Genre with id: ${id} not found`);
  error.status = 404;
  throw error;
}

export async function updateGenre(id, name) {
  const updatedGenre = await update(id, { name });

  if (updatedGenre) return updatedGenre;

  const error = new Error(`Genre with id: ${id} not found`);
  error.status = 404;
  throw error;
}

export async function deleteGenre(id) {
  const result = await remove(id);

  if (result) return;

  const error = new Error(`Genre with id: ${id} not found`);
  error.status = 404;
  throw error;
}
