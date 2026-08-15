import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';

export async function createBooking(req, res) {
  try {
    const { tutorId, subject, date, time, notes } = req.body;
    if (!tutorId || !date || !time) {
      return res.status(400).json({ message: 'tutorId, date, and time are required' });
    }
    const booking = await Booking.create({
      student: req.user._id,
      tutor: tutorId,
      subject,
      date,
      time,
      notes,
    });
    await Notification.create({ user: tutorId, title: `New booking request from ${req.user.fullName}` });
    const populated = await booking.populate('tutor', 'fullName avatar subject');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Create booking error:', err.message);
    res.status(500).json({ message: 'Failed to create booking' });
  }
}

export async function getMyBookings(req, res) {
  try {
    const filter = req.user.role === 'tutor' ? { tutor: req.user._id } : { student: req.user._id };
    const bookings = await Booking.find(filter)
      .populate('tutor', 'fullName avatar subject')
      .populate('student', 'fullName avatar')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
}

export async function cancelBooking(req, res) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const isOwner = [String(booking.student), String(booking.tutor)].includes(String(req.user._id));
    if (!isOwner) return res.status(403).json({ message: 'Not authorized to modify this booking' });
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
}
