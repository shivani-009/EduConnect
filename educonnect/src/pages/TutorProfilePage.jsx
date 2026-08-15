import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShare2, FiHeart, FiStar, FiCalendar, FiAward, FiClock, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useTutors } from '../context/TutorContext';
import { useSavedTutors } from '../context/SavedTutorContext';
import { useBooking } from '../context/BookingContext';
import Button from '../components/Button';
import MapComponent from '../components/MapComponent';

const times = ['09:00 AM', '11:30 AM', '02:00 PM'];

export default function TutorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTutorById } = useTutors();
  const { isSaved, toggleSave } = useSavedTutors();
  const { openBookingModal } = useBooking();
  const [tutor, setTutor] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedDay, setSelectedDay] = useState(10);
  const [selectedTime, setSelectedTime] = useState('11:30 AM');

  useEffect(() => {
    setTutor(null);
    setNotFound(false);
    fetchTutorById(id)
      .then(setTutor)
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-gray-400">This tutor couldn't be found.</p>
        <button onClick={() => navigate('/search')} className="mt-3 text-sm font-semibold text-green-600 dark:text-lime-400">
          ← Back to search
        </button>
      </div>
    );
  }
  if (!tutor) {
    return <p className="p-6 text-center text-sm text-gray-400">Loading tutor…</p>;
  }

  const days = Array.from({ length: 14 }, (_, i) => i + 1);

  return (
    <div className="px-4 md:px-8 pb-28 md:pb-10">
      <div className="flex items-center justify-between py-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-lime-400">
          <FiArrowLeft /> Tutor Profile
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!'); }}>
            <FiShare2 className="text-gray-400" />
          </button>
          <button onClick={() => toggleSave(tutor.id, tutor.name)}>
            <FiHeart className={isSaved(tutor.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
          </button>
        </div>
      </div>

      <div className="md:grid md:grid-cols-3 md:gap-8">
        <div className="md:col-span-2">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <img src={tutor.image} alt={tutor.name} className="h-24 w-24 rounded-full object-cover ring-4 ring-green-100 dark:ring-green-500/20" />
            <h1 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">{tutor.name}</h1>
            <span className="mt-1 rounded-full bg-green-50 dark:bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600 dark:text-lime-400">
              {tutor.subject}
            </span>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{tutor.bio}</p>

            <div className="mt-4 flex w-full justify-around md:justify-start md:gap-8 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-4">
              <Stat icon={FiStar} value={tutor.rating} label={`${tutor.reviews} Reviews`} />
              <Stat icon={FiAward} value={`${tutor.experience}+`} label="Years Exp." />
              <Stat icon={FiClock} value={`$${tutor.price}`} label="Per Hour" />
            </div>
          </div>

          <section className="mt-6">
            <h2 className="mb-2 text-lg font-bold text-green-600 dark:text-lime-400">About {tutor.name.split(' ')[0]}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{tutor.bio}</p>
            {tutor.expertise?.length > 0 && (
              <>
                <p className="mt-3 mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {tutor.expertise.map((e) => (
                    <span key={e} className="rounded-full bg-green-50 dark:bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-lime-400">
                      {e}
                    </span>
                  ))}
                </div>
              </>
            )}
          </section>

          {tutor.location?.lat ? (
            <section className="mt-6">
              <h2 className="mb-2 text-lg font-bold text-green-600 dark:text-lime-400">Location</h2>
              <p className="mb-2 text-xs text-gray-400">{tutor.location.address} • {tutor.mode === 'Both' ? 'Home visits & Online' : tutor.mode}</p>
              <MapComponent lat={tutor.location.lat} lng={tutor.location.lng} popupText={tutor.name} />
            </section>
          ) : (
            <section className="mt-6">
              <h2 className="mb-2 text-lg font-bold text-green-600 dark:text-lime-400">Teaching Mode</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tutor.mode}</p>
            </section>
          )}

          {(tutor.education?.length > 0 || tutor.certifications?.length > 0) && (
            <section className="mt-6">
              <h2 className="mb-2 text-lg font-bold text-green-600 dark:text-lime-400">Credentials</h2>
              <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
                {tutor.education.map((e) => (
                  <div key={e.degree} className="rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-3">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{e.degree}</p>
                    <p className="text-xs text-gray-400">{e.school} • {e.year}</p>
                  </div>
                ))}
                {tutor.certifications.map((c) => (
                  <div key={c.name} className="rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-3">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.level}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="md:col-span-1 mt-6 md:mt-0">
          <section className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-4 md:sticky md:top-24">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-green-600 dark:text-lime-400">
              <FiCalendar /> Availability
            </h2>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {days.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`rounded-lg py-2 font-medium ${selectedDay === d ? 'bg-green-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              {times.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`flex-1 rounded-xl py-2 text-xs font-semibold ${selectedTime === t ? 'bg-green-600 text-white' : 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-5 hidden md:flex flex-col gap-3">
              <Button onClick={() => openBookingModal(tutor)} className="w-full">Request Booking</Button>
              <Button onClick={() => navigate(`/messages?with=${tutor.id}`)} variant="outline" className="w-full">
                <FiMessageSquare className="mr-1" /> Message
              </Button>
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-30 max-w-md mx-auto flex gap-3 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-4 md:hidden">
        <button onClick={() => navigate(`/messages?with=${tutor.id}`)} className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700">
          <FiMessageSquare className="text-gray-600 dark:text-gray-300" />
        </button>
        <Button onClick={() => openBookingModal(tutor)} className="flex-1">Request Booking</Button>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center md:items-start gap-1">
      <div className="flex items-center gap-1 font-bold text-gray-900 dark:text-white">
        <Icon size={14} className="text-green-500" /> {value}
      </div>
      <p className="text-[10px] text-gray-400">{label}</p>
    </div>
  );
}
