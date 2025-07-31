import { PORT } from './src/config/env.js';
import app from './src/app.js';
import pool from './src/config/db.js';

const startServer = async () => {
  try {
    await pool.query('SELECT NOW()'); // Simple DB ping
    console.log('PostgreSQL connected');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`); //server listening
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

startServer();
