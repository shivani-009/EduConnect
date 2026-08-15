import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';

function toPublicUser(user) {
  const obj = user.toObject();
  delete obj.password;
  return obj;
}

// Turns Mongo/Mongoose errors into clear, specific messages instead of a
// generic 500 — this is what was making "Registration failed" show up even
// when the account had actually been created.
function describeError(err) {
  if (err.code === 11000) {
    return { status: 409, message: 'An account with this email already exists' };
  }
  if (err.name === 'ValidationError') {
    const first = Object.values(err.errors)[0];
    return { status: 400, message: first?.message || 'Please check the fields and try again' };
  }
  return { status: 500, message: 'Something went wrong on our end — please try again' };
}

export async function register(req, res) {
  try {
    const { fullName, email, password, phone, role = 'student', location, avatar, ...tutorFields } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const userData = {
      fullName,
      email: String(email).toLowerCase(),
      phone,
      password: hashed,
      role,
      avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=16A34A&color=fff`,
    };

    // Only attach a location at all if we have real coordinates — leaving
    // this out entirely (rather than an empty/partial object) is what
    // keeps the 2dsphere index happy. See models/User.js for why.
    if (location && location.lat != null && location.lng != null) {
      userData.location = {
        type: 'Point',
        coordinates: [Number(location.lng), Number(location.lat)],
        address: location.address || '',
      };
    }

    if (role === 'tutor') {
      Object.assign(userData, {
        subject: tutorFields.subject,
        qualification: tutorFields.qualification,
        experience: Number(tutorFields.experience) || 0,
        hourlyFee: Number(tutorFields.hourlyFee) || 0,
        bio: tutorFields.bio,
        languages: tutorFields.languages,
        teachingMode: tutorFields.teachingMode || 'Online',
        expertise: tutorFields.expertise
          ? String(tutorFields.expertise).split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      });
    }

    const user = await User.create(userData);
    const token = signToken(user._id);
    res.status(201).json({ ...toPublicUser(user), token });
  } catch (err) {
    const { status, message } = describeError(err);
    console.error('Register error:', err.message);
    res.status(status).json({ message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = signToken(user._id);
    res.json({ ...toPublicUser(user), token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Login failed — please try again' });
  }
}

export async function getMe(req, res) {
  res.json(toPublicUser(req.user));
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }
    const user = await User.findById(req.user._id).select('+password');
    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err.message);
    res.status(500).json({ message: 'Failed to update password' });
  }
}

export async function updateMe(req, res) {
  try {
    const allowed = ['fullName', 'phone', 'avatar'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (req.body.location?.lat != null && req.body.location?.lng != null) {
      updates.location = {
        type: 'Point',
        coordinates: [Number(req.body.location.lng), Number(req.body.location.lat)],
        address: req.body.location.address || '',
      };
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json(toPublicUser(user));
  } catch (err) {
    const { status, message } = describeError(err);
    res.status(status).json({ message });
  }
}
