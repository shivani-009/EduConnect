import mongoose from 'mongoose';

const savedTutorSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

savedTutorSchema.index({ student: 1, tutor: 1 }, { unique: true });

export default mongoose.model('SavedTutor', savedTutorSchema);
