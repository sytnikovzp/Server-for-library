const { Router } = require('express');
// ============================
const bookController = require('../controllers/bookController');
const { validateBook } = require('../middleware/validate.mw');
const { paginate } = require('../middleware');
// ============================

const router = new Router();

router
  .route('/')
  .get(paginate.paginateBooks, bookController.getBooks)
  .post(validateBook, bookController.createBook)
  .put(validateBook, bookController.updateBook);

router
  .route('/:bookId')
  .get(bookController.getBookById)
  .delete(bookController.deleteBook);

module.exports = router;
