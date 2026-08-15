import api from './api';
import { normalizeUser } from '../utils/normalize';

export async function loginUser({ email, password }) {
  const res = await api.post('/auth/login', { email, password });
  return normalizeUser(res.data);
}

export async function registerUser(data) {
  const payload = {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    phone: data.phone,
    role: data.role || 'student',
    location: data.location?.lat != null ? { lat: data.location.lat, lng: data.location.lng, address: data.location.address } : undefined,
    subject: data.subject,
    qualification: data.qualification,
    experience: data.experience,
    hourlyFee: data.hourlyFee,
    bio: data.bio,
    languages: data.languages,
    teachingMode: data.teachingMode,
    avatar: data.avatar,
  };
  const res = await api.post('/auth/register', payload);
  return normalizeUser(res.data);
}

export async function fetchMe() {
  const res = await api.get('/auth/me');
  return normalizeUser(res.data);
}

export async function updateProfile(data) {
  const res = await api.put('/auth/me', data);
  return normalizeUser(res.data);
}

export async function changePassword(currentPassword, newPassword) {
  const res = await api.put('/auth/change-password', { currentPassword, newPassword });
  return res.data;
}
