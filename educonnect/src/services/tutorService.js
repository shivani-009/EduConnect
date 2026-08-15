import api from './api';
import { normalizeTutor } from '../utils/normalize';

export async function getTutors(filters = {}) {
  const params = {
    q: filters.query || undefined,
    subject: filters.subject || undefined,
    mode: filters.mode || undefined,
    maxPrice: filters.maxPrice || undefined,
    minRating: filters.minRating || undefined,
    sort: filters.sort || undefined,
    lat: filters.lat ?? undefined,
    lng: filters.lng ?? undefined,
    radiusMiles: filters.radiusMiles || undefined,
  };
  const res = await api.get('/tutors', { params });
  return res.data.map(normalizeTutor);
}

export async function getTutorById(id) {
  const res = await api.get(`/tutors/${id}`);
  return normalizeTutor(res.data);
}
