const db = require('../../db');

class AuthorController {
  async getAuthors(req, res) {
    try {
      const authors = await db.query(
        `SELECT authors.id, full_name, email, nat.description as nationality, to_char(authors."createdAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt", to_char(authors."updatedAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "updatedAt"
        FROM authors 
        JOIN nationalities as nat
        ON authors.nationality_id = nat.id
        ORDER BY authors.id;`
      );

      if (authors.rows.length > 0) {
        res.status(200).json(authors.rows);
      } else {
        res.status(404).send('Authors not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAuthorById(req, res) {
    try {
      const {
        params: { authorId },
      } = req;
      const author = await db.query(
        `SELECT authors.id, full_name, email, nat.description AS nationality, to_char(authors."createdAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt", to_char(authors."updatedAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "updatedAt"
        FROM authors
        JOIN nationalities AS nat
        ON authors.nationality_id = nat.id
        WHERE authors.id = $1;`,
        [authorId]
      );

      if (author.rows.length > 0) {
        res.status(200).json(author.rows[0]);
      } else {
        res.status(404).send('Author not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createAuthor(req, res) {
    try {
      const { full_name, email, nationality } = req.body;
      const newAuthor = await db.query(
        `INSERT INTO authors (full_name, email, nationality_id, "createdAt", "updatedAt")
        VALUES ($1, $2, (SELECT id FROM nationalities WHERE title = $3), NOW(), NOW())
        RETURNING *;`,
        [full_name, email, nationality]
      );

      if (newAuthor.rows.length > 0) {
        res.status(201).json(newAuthor.rows[0]);
      } else {
        res.status(404).send('The author has not been created');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateAuthor(req, res) {
    try {
      const { full_name, email, nationality, id } = req.body;
      const updatedAuthor = await db.query(
        `UPDATE authors
        SET full_name=$1, email=$2,
        nationality_id=(SELECT id FROM nationalities WHERE title = $3), "updatedAt"=NOW() WHERE id=$4 RETURNING *`,
        [full_name, email, nationality, id]
      );

      if (updatedAuthor.rows.length > 0) {
        res.status(201).json(updatedAuthor.rows[0]);
      } else {
        res.status(404).send('Author not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteAuthor(req, res) {
    try {
      const {
        params: { authorId },
      } = req;
      const delAuthor = await db.query(
        `DELETE FROM authors WHERE id=$1 RETURNING full_name, id`,
        [authorId]
      );

      if (delAuthor.rows.length > 0) {
        res.status(204).json(delAuthor.rows[0]);
      } else {
        res.status(404).send('Author not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AuthorController();
