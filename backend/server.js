const express = require('express');
const mysql = require('mysql');
const app = express();
require('dotenv').config();


const cors = require('cors');
app.use(cors({
  //origin: 'tnj-pork.netlify.app'  // Replace with your actual frontend domain
}));
app.use(express.json());

const PORT = process.env.PORT || 3002;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.post('/orders', (req, res) => {
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

app.get('/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) return res.status(500).send('Database error');
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
