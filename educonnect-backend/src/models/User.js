import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  { degree: String, school: String, year: Number },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  { name: String, level: String },
  { _id: false }
);

// IMPORTANT: this sub-schema intentionally has NO default values on any
// field, including `address`. If even one nested field has a default,
// Mongoose will auto-instantiate the parent `location` object on every
// document — even ones that never set a location — producing a malformed
// GeoJSON object (missing `type`/`coordinates`) that the 2dsphere index
// below rejects at write time. That was the root cause of every
// registration failing with a 500 even though the user document had
// already been created.
const locationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Point'] },
    coordinates: [Number], // [lng, lat]
    address: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['student', 'tutor'], default: 'student', required: true },
    avatar: { type: String, default: '' },

    location: locationSchema,

    // Tutor-only fields
    subject: String,
    qualification: String,
    experience: Number,
    hourlyFee: Number,
    bio: String,
    languages: String,
    teachingMode: { type: String, enum: ['Online', 'Home Visit', 'Both'], default: 'Online' },
    expertise: [String],
    education: [educationSchema],
    certifications: [certificationSchema],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    topRated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// sparse: true means documents with no `location` at all are simply
// skipped by the index instead of being validated/rejected.
userSchema.index({ location: '2dsphere' }, { sparse: true });

export default mongoose.model('User', userSchema);
