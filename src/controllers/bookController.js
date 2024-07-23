const createError = require('http-errors');

const { Book, Genre, Shelf, sequelize } = require('../db/models');

class BookController {
  async getBooks(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const books = await Book.findAll({
        attributes: ['id', 'title'],
        include: [
          {
            model: Genre,
            attributes: ['title'],
          },
          {
            model: Shelf,
            attributes: ['title'],
          },
        ],
        raw: true,
        limit,
        offset,
        order: [['id', 'DESC']],
      });
      if (books.length > 0) {
        console.log(`Result is: ${JSON.stringify(books, null, 2)}`);
        res.status(200).json(books);
      } else {
        next(createError(404, 'Books not found'));
      }
    } catch (error) {
      console.log(error.message);
      next(error.message);
    }
  }

  async getBookById(req, res, next) {
    try {
      const {
        params: { bookId },
      } = req;

      const book = await Book.findOne({
        where: { id: bookId },
        attributes: ['id', 'title'],
        include: [
          {
            model: Genre,
            attributes: [['title', 'genre']],
          },
          {
            model: Shelf,
            attributes: [['title', 'shelves']],
          },
        ],
        raw: true,
      });

      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).send('Book not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createBook(req, res) {
    try {
      const { title, genre, shelves, description, image } = req.body;
      const newBook = await db.query(
        `INSERT INTO books (title, genre_id, shelf_id, description, "createdAt", "updatedAt", image)
        VALUES ($1, (SELECT id FROM genres WHERE title = $2), (SELECT id FROM shelves WHERE title = $3), $4, NOW(), NOW(), $5)
        RETURNING *;`,
        [title, genre, shelves, description, image]
      );

      if (newBook.rows.length > 0) {
        res.status(201).json(newBook.rows[0]);
      } else {
        res.status(500).send('The book has not been created');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateBook(req, res) {
    try {
      const { title, genre, shelves, description, image, id } = req.body;
      const updatedBook = await db.query(
        `UPDATE books
        SET title=$1, genre_id=(SELECT id FROM genres WHERE title = $2), shelf_id=(SELECT id FROM shelves WHERE title = $3), description=$4, "updatedAt"=NOW(), image=$5 WHERE id=$6 RETURNING *`,
        [title, genre, shelves, description, image, id]
      );

      if (updatedBook.rows.length > 0) {
        res.status(201).json(updatedBook.rows[0]);
      } else {
        res.status(404).send('Book not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteBook(req, res) {
    try {
      const {
        params: { bookId },
      } = req;
      const delBook = await db.query(
        `DELETE FROM books WHERE id=$1 RETURNING title, id`,
        [bookId]
      );

      if (delBook.rows.length > 0) {
        res.status(204).json(delBook.rows[0]);
      } else {
        res.status(404).send('Book not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new BookController();
