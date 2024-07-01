const db = require('../../db');

class BookController {
  async getBooks(req, res) {
    try {
      const books = await db.query(
        `SELECT books.id, books.title, gen.title as genre, shelf.title as shelves, books.description, to_char(books."createdAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt", to_char(books."updatedAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "updatedAt", image
        FROM books 
        JOIN genres as gen
        ON books.genre_id = gen.id
        JOIN shelves as shelf
        ON books.shelf_id = shelf.id
        ORDER BY books.id;;`
      );

      if (books.rows.length > 0) {
        res.status(200).json(books.rows);
      } else {
        res.status(404).send('Books not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getBookById(req, res) {
    try {
      const {
        params: { bookId },
      } = req;
      const book = await db.query(
        `SELECT books.id, books.title, gen.title as genre, shelf.title as shelves, books.description, to_char(books."createdAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt", to_char(books."updatedAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "updatedAt", image
        FROM books 
        JOIN genres as gen
        ON books.genre_id = gen.id
        JOIN shelves as shelf
        ON books.shelf_id = shelf.id
        WHERE books.id = $1`,
        [bookId]
      );

      if (book.rows.length > 0) {
        res.status(200).json(book.rows[0]);
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
        res.status(404).send('The book has not been created');
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
