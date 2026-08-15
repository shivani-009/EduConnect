import { useForm } from 'react-hook-form';
import Modal from './Modal';
import Button from './Button';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BookingModal() {
  const { modalOpen, activeTutor, closeBookingModal, confirmBooking } = useBooking();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  if (!activeTutor) return null;

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      closeBookingModal();
      navigate('/login');
      return;
    }
    await confirmBooking({
      tutorId: activeTutor.id,
      tutorName: activeTutor.name,
      tutorImage: activeTutor.image,
      ...data,
    });
    reset();
  };

  return (
    <Modal open={modalOpen} onClose={closeBookingModal} title={`Book ${activeTutor.name}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            {...register('date', { required: 'Please pick a date' })}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-gray-900 dark:text-white"
          />
          {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
          <input
            type="time"
            {...register('time', { required: 'Please pick a time' })}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-gray-900 dark:text-white"
          />
          {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
          <input
            type="text"
            defaultValue={activeTutor.subject}
            {...register('subject', { required: true })}
            className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
          <textarea
            {...register('notes')}
            rows={3}
            placeholder="Anything the tutor should know beforehand?"
            className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-gray-900 dark:text-white"
          />
        </div>
        <Button type="submit" loading={isSubmitting} className="w-full">
          Confirm Booking
        </Button>
      </form>
    </Modal>
  );
}
