const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'sql8.freesqldatabase.com',
  user: 'sql8778649',
  password: 'MaxwellTaku12!',
  database: 'sql8778649',
  port: 3306,
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.post('/api/orders', (req, res) => {
  const { name, surname, email, phone, porkType, packs, price } = req.body;
  const query = `
    INSERT INTO orders (name, surname, email, phone, porkType, packs, price)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [name, surname, email, phone, porkType, packs, price], (err, result) => {
    if (err) return res.status(500).send('Database error');
    res.status(201).send('Order added');
  });
});

app.get('/api/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) return res.status(500).send('Database error');
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3001');
});
