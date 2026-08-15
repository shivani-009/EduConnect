import mongoose from 'mongoose';

// Serverless platforms (Vercel) reuse the same process across invocations,
// so we cache the connection instead of reconnecting on every request —
// reconnecting every time is slow and can exhaust MongoDB's connection limit.
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set. Copy .env.example to .env and configure it.');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => {
      console.log(`MongoDB connected: ${m.connection.host}/${m.connection.name}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}
