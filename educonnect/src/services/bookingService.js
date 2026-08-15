import api from './api';
import { normalizeBooking } from '../utils/normalize';

export async function createBooking(booking) {
  const res = await api.post('/bookings', {
    tutorId: booking.tutorId,
    subject: booking.subject,
    date: booking.date,
    time: booking.time,
    notes: booking.notes,
  });
  return normalizeBooking(res.data);
}

export async function getBookings() {
  const res = await api.get('/bookings');
  return res.data.map(normalizeBooking);
}

export async function cancelBooking(id) {
  const res = await api.patch(`/bookings/${id}/cancel`);
  return normalizeBooking(res.data);
}
