// Local development entry point. Vercel deployments use api/index.js
// instead — see that file for why the setup differs.
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set in .env — copy .env.example to .env and set it.');
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not set in .env — copy .env.example to .env and set it.');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`EduConnect API running on http://localhost:${PORT}`));
});
