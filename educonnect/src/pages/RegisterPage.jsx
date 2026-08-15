import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FiBookOpen, FiUpload, FiCrosshair } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import MapComponent from '../components/MapComponent';
import { geocodeLocation } from '../utils/geo';

export default function RegisterPage({ role: initialRole }) {
  const [role, setRole] = useState(initialRole || 'student');
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch('password');

  const MAX_PHOTO_BYTES = 1.5 * 1024 * 1024;

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error('Image is too large — please pick one under 1.5MB');
      return;
    }
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      setPhotoDataUrl(dataUrl);
      setPhotoName(file.name);
    } catch {
      toast.error('Failed to read that image — please try another');
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          toast.success(data.display_name ? 'Location found!' : 'Location captured');
        } catch {
          toast.success('Location captured');
        }
        setLocating(false);
      },
      () => {
        toast.error('Unable to get your location');
        setLocating(false);
      }
    );
  };

  const onSubmit = async (data) => {
    let finalCoords = coords;
    // If the person typed an address but never clicked "Use Current",
    // geocode it now — this is what was causing newly registered tutors
    // to never appear in "near me" search results.
    if (!finalCoords && data.locationText?.trim()) {
      try {
        const geo = await geocodeLocation(data.locationText.trim());
        if (geo) finalCoords = { ...geo, address: data.locationText.trim() };
        else toast(`Couldn't pin "${data.locationText}" on the map — you can add your location later from Profile.`, { icon: '📍' });
      } catch {
        // ignore geocoding failure — registration still proceeds without location
      }
    }
    const result = await signUp({ ...data, role, location: finalCoords, avatar: photoDataUrl || undefined });
    if (result.success) {
      toast.success('Account created!');
      navigate(role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  return (
    <div>
      <h1 className="mt-4 text-center text-3xl font-extrabold bg-gradient-to-r from-green-600 to-lime-500 bg-clip-text text-transparent">
        EduConnect
      </h1>
      <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
        Empowering the next generation of learners.
      </p>

      <div className="mt-6 rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create an account</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Join our community of students and professional tutors.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex flex-col items-center gap-1 rounded-xl border-2 py-4 text-sm font-semibold ${
              role === 'student' ? 'border-green-600 text-green-600 bg-green-50 dark:bg-green-500/10' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <FaGraduationCap size={22} /> I am a Student
          </button>
          <button
            type="button"
            onClick={() => setRole('tutor')}
            className={`flex flex-col items-center gap-1 rounded-xl border-2 py-4 text-sm font-semibold ${
              role === 'tutor' ? 'border-green-600 text-green-600 bg-green-50 dark:bg-green-500/10' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <FiBookOpen size={22} /> I am a Tutor
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
          <Field label="Full Name">
            <input placeholder="Enter your full name" {...register('fullName', { required: 'Full name is required' })} className="input" />
            {errors.fullName && <Err msg={errors.fullName.message} />}
          </Field>

          <Field label="Email Address">
            <input
              type="email"
              placeholder="name@example.com"
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })}
              className="input"
            />
            {errors.email && <Err msg={errors.email.message} />}
          </Field>

          <Field label="Phone">
            <input type="tel" placeholder="+1 (555) 000-0000" {...register('phone', { required: 'Phone number is required' })} className="input" />
            {errors.phone && <Err msg={errors.phone.message} />}
          </Field>

          <Field label="Password">
            <input
              type="password"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
              className="input"
            />
            {errors.password && <Err msg={errors.password.message} />}
          </Field>

          <Field label="Confirm Password">
            <input
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === password || 'Passwords do not match',
              })}
              className="input"
            />
            {errors.confirmPassword && <Err msg={errors.confirmPassword.message} />}
          </Field>

          {role === 'tutor' && (
            <>
              <Field label="Subject">
                <input placeholder="e.g. Mathematics, Physics" {...register('subject', { required: true })} className="input" />
              </Field>
              <Field label="Qualification">
                <input placeholder="e.g. PhD in Mathematics" {...register('qualification', { required: true })} className="input" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Experience (yrs)">
                  <input type="number" {...register('experience', { required: true })} className="input" />
                </Field>
                <Field label="Hourly Fee ($)">
                  <input type="number" {...register('hourlyFee', { required: true })} className="input" />
                </Field>
              </div>
              <Field label="Bio">
                <textarea rows={3} {...register('bio')} placeholder="Tell students about yourself" className="input" />
              </Field>
              <Field label="Languages">
                <input placeholder="e.g. English, Spanish" {...register('languages')} className="input" />
              </Field>
              <Field label="Teaching Mode">
                <select {...register('teachingMode')} className="input">
                  <option>Online</option>
                  <option>Home Visit</option>
                  <option>Both</option>
                </select>
              </Field>
              <Field label="Upload Profile Photo">
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 py-4 text-sm text-gray-500">
                  {photoDataUrl ? (
                    <img src={photoDataUrl} alt="Preview" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <FiUpload />
                  )}
                  {photoName || 'Choose file'}
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </Field>
            </>
          )}

          <Field label="Location">
            <div className="flex gap-2">
              <input placeholder="Enter your address" {...register('locationText')} className="input flex-1" />
              <button
                type="button"
                onClick={useCurrentLocation}
                className="flex items-center gap-1 rounded-xl bg-green-50 dark:bg-green-500/10 px-3 text-xs font-semibold text-green-600 dark:text-lime-400"
              >
                <FiCrosshair /> {locating ? 'Locating...' : 'Use Current'}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              We'll pin your address on the map automatically, or tap "Use Current" for pinpoint accuracy — either way, this is what lets students find you in nearby search.
            </p>
            {coords && (
              <div className="mt-2">
                <MapComponent lat={coords.lat} lng={coords.lng} editable onPick={setCoords} height={160} popupText="Your location" />
              </div>
            )}
          </Field>

          <Button type="submit" loading={isSubmitting} className="mt-1 w-full">
            Create Account
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to={role === 'tutor' ? '/tutor/login' : '/login'} className="font-semibold text-green-600 dark:text-lime-400">
            Login
          </Link>
        </p>
      </div>

      <p className="mt-5 text-center text-xs text-gray-400">
        By creating an account, you agree to our{' '}
        <Link to="/faq" className="underline">Terms of Service</Link> and{' '}
        <Link to="/faq" className="underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      {children}
    </div>
  );
}
function Err({ msg }) {
  return <p className="mt-1 text-xs text-red-500">{msg}</p>;
}
