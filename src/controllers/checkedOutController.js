import {
  createCheckout,
  getMyCheckouts,
  getCheckoutById,
  updateCheckout,
  returnBook,
  getAllCheckouts,
} from '../services/checkedOutService.js';

// Helps make the date look human readable
function formatDate(date) {
  if (!date) return null;
  return date.toISOString().split('T')[0];
}

export async function getAllCheckoutsHandler(req, res) {
  const checkouts = await getAllCheckouts();

  res.status(200).json(checkouts);
}
export async function getMyCheckoutsHandler(req, res) {
  const checkouts = await getMyCheckouts(req.user.id);
  const formattedCheckouts = checkouts.map((checkout) => ({
    ...checkout,
    checkoutDate: formatDate(checkout.checkoutDate),
    dueDate: formatDate(checkout.dueDate),
  }));
  res.status(200).json(formattedCheckouts);
}

export async function createCheckoutHandler(req, res) {
  const { bookId } = req.body;

  const newCheckout = await createCheckout(req.user.id, bookId);

  res.status(201).json({
    ...newCheckout,
    checkoutDate: formatDate(newCheckout.checkoutDate),
    dueDate: formatDate(newCheckout.dueDate),
  });
}

export async function getCheckoutByIdHandler(req, res) {
  const { id } = req.params;

  const checkout = await getCheckoutById(id);

  res.status(200).json({
    ...checkout,
    checkoutDate: formatDate(checkout.checkoutDate),
    dueDate: formatDate(checkout.dueDate),
  });
}

export async function updateCheckoutHandler(req, res) {
  const { id } = req.params;
  const updatedCheckout = await updateCheckout(id);

  res.status(200).json(updatedCheckout);
}

export async function returnBookHandler(req, res) {
  const { id } = req.params;

  const returnedCheckout = await returnBook(id, req.user.id, req.user.role);

  res.status(200).json({
    message: 'Book successfully returned',
    checkoutId: returnedCheckout.id,
    bookId: returnedCheckout.bookId,
    returned: true,
  });
}
