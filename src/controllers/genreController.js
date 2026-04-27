import {
  getAllGenres,
  createGenre,
  getGenreById,
  deleteGenre,
  updateGenre,
} from '../services/genreService.js';

export async function getAllGenresHandler(req, res) {
  const genres = await getAllGenres(req.query);
  res.status(200).json(genres);
}

export async function createGenreHandler(req, res) {
  const { name } = req.body;
  const newGenre = await createGenre(name);
  res.status(201).json(newGenre);
}

export async function getGenreByIdHandler(req, res) {
  const id = parseInt(req.params.id);
  const genre = await getGenreById(id);
  res.status(200).json(genre);
}

export async function deleteGenreHandler(req, res) {
  const id = parseInt(req.params.id);
  await deleteGenre(id);
  res.status(204).send();
}

export async function updateGenreHandler(req, res) {
  const id = parseInt(req.params.id);
  const { name } = req.body;

  const updatedGenre = await updateGenre(id, name);

  res.status(200).json(updatedGenre);
}
