import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: String,
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: String,
    status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
