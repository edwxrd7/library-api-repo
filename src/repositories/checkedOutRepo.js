import prisma from '../config/db.js';

export async function create(data) {
  const newCheckout = await prisma.checkedOut.create({
    data,
    include: {
      book: {
        select: {
          title: true,
          author: true,
        },
      },
    },
  });

  return newCheckout;
}
export async function getAll() {
  return prisma.checkedOut.findMany({
    where: {
      returned: false,
    },
    include: {
      book: {
        select: {
          id: true,
          title: true,
          author: true,
        },
      },
    },
    orderBy: {
      dueDate: 'asc',
    },
  });
}
export async function getById(id) {
  const checkedOut = await prisma.checkedOut.findUnique({
    where: { id },
    include: {
      book: true,
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return checkedOut;
}

export async function getByUserId(userId) {
  const checkouts = await prisma.checkedOut.findMany({
    where: {
      userId,
      returned: false,
    },
    include: {
      book: true,
    },
    orderBy: {
      checkoutDate: 'desc',
    },
  });

  return checkouts;
}

export async function findActiveByBookId(bookId) {
  return prisma.checkedOut.findFirst({
    where: {
      bookId,
      returned: false,
    },
  });
}

export async function update(id, data) {
  try {
    const updatedCheckout = await prisma.checkedOut.update({
      where: { id },
      data,
      include: {
        book: {
          select: {
            title: true,
            author: true,
          },
        },
      },
    });

    return updatedCheckout;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function markReturned(id) {
  try {
    const returnedCheckout = await prisma.checkedOut.update({
      where: { id },
      data: {
        returned: true,
      },
    });

    return returnedCheckout;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}
