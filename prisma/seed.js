// prisma/seed.js

import bcrypt from 'bcrypt';
import 'dotenv/config';
import prisma from '../src/config/db.js';

try {
  console.log('Clearing database and resetting IDs...');

  await prisma.$queryRaw`
    TRUNCATE checked_out, books, genres, users
    RESTART IDENTITY CASCADE;
  `;

  console.log('Database cleared!');

  /*
    USERS
    - 1 admin
    - 4 regular users
    - unique passwords for testing
  */

  const usersData = [
    { email: 'admin@test.com', password: 'admin1234', role: 'ADMIN' },
    { email: 'edward@test.com', password: 'edward1234', role: 'USER' },
    { email: 'alice@test.com', password: 'alice1234', role: 'USER' },
    { email: 'mike@test.com', password: 'mike1234', role: 'USER' },
    { email: 'sarah@test.com', password: 'sarah1234', role: 'USER' },
  ];

  const users = [];

  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'USER',
      },
    });

    users.push(user);
  }

  /*
    GENRES
  */

  const genresData = [
    { name: 'Fantasy' },
    { name: 'Fiction' },
    { name: 'Mystery' },
    { name: 'Nonfiction' },
    { name: 'Adventure' },
    { name: 'Manga' },
    { name: 'Classic Literature' },
  ];

  const genres = {};

  for (const genreData of genresData) {
    const genre = await prisma.genre.create({
      data: genreData,
    });

    genres[genre.name] = genre;
  }

  /*
    BOOKS (10 total)
  */

  const booksData = [
    {
      title: 'Percy Jackson and the Lightning Thief',
      author: 'Rick Riordan',
      yearPublished: 2005,
      genreName: 'Fantasy',
    },
    {
      title: 'The Book of Bill',
      author: 'Alex Hirsch',
      yearPublished: 2024,
      genreName: 'Fantasy',
    },
    {
      title: 'Harry Potter and the Prisoner of Azkaban',
      author: 'J.K. Rowling',
      yearPublished: 1999,
      genreName: 'Fantasy',
    },
    {
      title: 'How to Steal a Dog',
      author: "Barbara O'Connor",
      yearPublished: 2007,
      genreName: 'Fiction',
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      yearPublished: 1937,
      genreName: 'Adventure',
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      yearPublished: 1925,
      genreName: 'Fiction',
    },
    {
      title: 'The Inferno of Dante',
      author: 'Robert Pinsky',
      yearPublished: 1994,
      genreName: 'Classic Literature',
    },
    {
      title: 'Dragon Ball Super Vol. 18',
      author: 'Akira Toriyama',
      yearPublished: 2022,
      genreName: 'Manga',
    },
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      yearPublished: 2018,
      genreName: 'Nonfiction',
    },
    {
      title: 'Coraline',
      author: 'Neil Gaiman',
      yearPublished: 2002,
      genreName: 'Fantasy',
    },
  ];

  for (const bookData of booksData) {
    await prisma.book.create({
      data: {
        title: bookData.title,
        author: bookData.author,
        yearPublished: bookData.yearPublished,
        genreId: genres[bookData.genreName].id,
      },
    });
  }

  /*
    CHECKED OUT RECORDS
  */

  const allBooks = await prisma.book.findMany({
    orderBy: {
      id: 'asc',
    },
  });

  const userMap = {};
  for (const user of users) {
    userMap[user.email] = user;
  }

  await prisma.checkedOut.createMany({
    data: [
      {
        userId: userMap['edward@test.com'].id,
        bookId: allBooks[0].id, // Percy Jackson
        dueDate: new Date('2026-05-10'),
        returned: false,
      },
      {
        userId: userMap['edward@test.com'].id,
        bookId: allBooks[1].id, // The Book of Bill
        dueDate: new Date('2026-05-12'),
        returned: false,
      },
      {
        userId: userMap['alice@test.com'].id,
        bookId: allBooks[2].id, // Harry Potter
        dueDate: new Date('2026-05-08'),
        returned: false,
      },
      {
        userId: userMap['mike@test.com'].id,
        bookId: allBooks[6].id, // Inferno of Dante
        dueDate: new Date('2026-05-15'),
        returned: true,
      },
      {
        userId: userMap['sarah@test.com'].id,
        bookId: allBooks[7].id, // Dragon Ball Super
        dueDate: new Date('2026-05-20'),
        returned: false,
      },
    ],
  });

  console.log('Seed completed successfully!');
  console.log('\nLogin credentials:');
  console.log('ADMIN → admin@test.com / admin1234');
  console.log('USER  → edward@test.com / edward1234');
  console.log('USER  → alice@test.com / alice1234');
  console.log('USER  → mike@test.com / mike1234');
  console.log('USER  → sarah@test.com / sarah1234');
} catch (error) {
  console.error('Seed failed:', error);
} finally {
  await prisma.$disconnect();
}
