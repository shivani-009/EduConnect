import app from '../src/app.js';
import connectDB from '../src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.status(500).json({ message: 'Database connection failed' });
    return;
  }
  return app(req, res);
}
