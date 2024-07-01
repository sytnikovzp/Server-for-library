const db = require('../../db');

class CustomerController {
  async getCustomers(req, res) {
    try {
      const customers = await db.query(
        `SELECT full_name, email, phone, to_char("createdAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt", to_char("updatedAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "updatedAt", password
        FROM customers 
        ORDER BY id;`
      );

      if (customers.rows.length > 0) {
        res.status(200).json(customers.rows);
      } else {
        res.status(404).send('Customers not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCustomerById(req, res) {
    try {
      const {
        params: { customerId },
      } = req;
      const customer = await db.query(
        `SELECT id, full_name, email, phone, to_char("createdAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt", to_char("updatedAt"::timestamp, 'YYYY-MM-DD HH24:MI:SS') AS "updatedAt", password
        FROM customers
        WHERE id = $1;`,
        [customerId]
      );

      if (customer.rows.length > 0) {
        res.status(200).json(customer.rows[0]);
      } else {
        res.status(404).send('Customer not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createCustomer(req, res) {
    try {
      const { full_name, email, phone, password } = req.body;
      const newCustomer = await db.query(
        `INSERT INTO customers (full_name, email, phone, "createdAt", "updatedAt", password)
        VALUES ($1, $2, $3, NOW(), NOW(), $4)
        RETURNING *;`,
        [full_name, email, phone, password]
      );

      if (newCustomer.rows.length > 0) {
        res.status(201).json(newCustomer.rows[0]);
      } else {
        res.status(404).send('The customer has not been created');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateCustomer(req, res) {
    try {
      const { full_name, email, phone, password, id } = req.body;
      const updatedCustomer = await db.query(
        `UPDATE customers
        SET full_name=$1, email=$2, phone=$3, "updatedAt"=NOW(), password=$4 WHERE id=$5 RETURNING *`,
        [full_name, email, phone, password, id]
      );

      if (updatedCustomer.rows.length > 0) {
        res.status(201).json(updatedCustomer.rows[0]);
      } else {
        res.status(404).send('Customer not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteCustomer(req, res) {
    try {
      const {
        params: { customerId },
      } = req;
      const delCustomer = await db.query(
        `DELETE FROM customers WHERE id=$1 RETURNING full_name, id`,
        [customerId]
      );

      if (delCustomer.rows.length > 0) {
        res.status(204).json(delCustomer.rows[0]);
      } else {
        res.status(404).send('Customer not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new CustomerController();
