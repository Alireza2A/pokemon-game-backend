import express from 'express';
import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Client } = pkg;

const app = express();
const PORT = process.env.PORT || 5001;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection error:', err));

app.get('/', (req, res) => {
  res.send('Hello, Express with ES6!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
