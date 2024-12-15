// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

// Set up PostgreSQL connection
const pool = new Pool({
  user: 'vignesh',
  host: 'localhost',
  database: 'vi',
  password: 'root',
  port: 5432,
});

app.use(cors());
app.use(express.json());

// API endpoint to fetch titles from PostgreSQL
app.get('/api/titles', async (req, res) => {
  try {
    const result = await pool.query('SELECT title, url FROM documentation');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
