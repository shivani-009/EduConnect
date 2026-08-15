import { createContext, useContext, useState, useCallback } from 'react';
import { createBooking, getBookings, cancelBooking } from '../services/bookingService';
import toast from 'react-hot-toast';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTutor, setActiveTutor] = useState(null);

  const openBookingModal = (tutor) => {
    setActiveTutor(tutor);
    setModalOpen(true);
  };
  const closeBookingModal = () => setModalOpen(false);

  const loadBookings = useCallback(async () => {
    try {
      const data = await getBookings();
      setBookings(data);
      return data;
    } catch {
      setBookings([]);
      return [];
    }
  }, []);

  const confirmBooking = async (bookingData) => {
    try {
      const result = await createBooking(bookingData);
      toast.success('Booking confirmed!');
      setModalOpen(false);
      await loadBookings();
      return result;
    } catch (err) {
      toast.error(err.message || 'Failed to create booking');
    }
  };

  const removeBooking = async (id) => {
    try {
      await cancelBooking(id);
      toast('Booking cancelled', { icon: '🗑️' });
      await loadBookings();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking');
    }
  };

  return (
    <BookingContext.Provider
      value={{ bookings, modalOpen, activeTutor, openBookingModal, closeBookingModal, confirmBooking, loadBookings, removeBooking }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
