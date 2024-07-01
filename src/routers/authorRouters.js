const { Router } = require('express');
// ============================
const authorController = require('../controllers/authorController');
const { validatePerson } = require('../middleware/validate.mw');
// ============================

const router = new Router();

router
  .route('/')
  .get(authorController.getAuthors)
  .post(validatePerson, authorController.createAuthor)
  .put(validatePerson, authorController.updateAuthor);

router
  .route('/:authorId')
  .get(authorController.getAuthorById)
  .delete(authorController.deleteAuthor);

module.exports = router;
