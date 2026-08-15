import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiLock, FiMoon, FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { changePassword as changePasswordApi } from '../services/authService';
import Button from '../components/Button';
import Modal from '../components/Modal';

const MAX_PHOTO_BYTES = 1.5 * 1024 * 1024; // 1.5MB, generous for a small avatar

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name, email: user?.email },
  });

  const onSubmit = async (data) => {
    const result = await updateUser({ fullName: data.name });
    if (result.success) toast.success('Profile updated!');
    else toast.error(result.error || 'Failed to update profile');
  };

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow picking the same file again later
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error('Image is too large — please pick one under 1.5MB');
      return;
    }
    setUploadingPhoto(true);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const result = await updateUser({ avatar: dataUrl });
      if (result.success) toast.success('Profile photo updated!');
      else toast.error(result.error || 'Failed to update photo');
    } catch {
      toast.error('Failed to read that image — please try another');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10">
          <FiUser size={28} className="text-green-500" />
        </span>
        <h1 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">You're not logged in</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Log in or create an account to view and edit your profile, track bookings, and message tutors.
        </p>
        <div className="mt-6 flex w-full max-w-sm flex-col gap-3">
          <Button onClick={() => navigate('/login')} icon={FiLogIn} className="w-full">Login</Button>
          <Button onClick={() => navigate('/register')} variant="outline" className="w-full">Create an Account</Button>
        </div>
        <button onClick={() => navigate('/')} className="mt-6 text-xs font-semibold text-green-600 dark:text-lime-400">← Back to Home</button>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 pb-6 pt-4 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-semibold text-red-500">
          <FiLogOut size={16} /> Logout
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <div className="relative">
          <img src={user.avatar} alt={user.name} className="h-24 w-24 rounded-full object-cover" />
          <button
            onClick={handlePhotoClick}
            disabled={uploadingPhoto}
            className="absolute bottom-0 right-0 rounded-full gradient-primary p-2 text-white shadow disabled:opacity-60"
            aria-label="Change profile photo"
          >
            {uploadingPhoto ? (
              <span className="block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <FiCamera size={14} />
            )}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        </div>
        <p className="mt-3 font-bold text-gray-900 dark:text-white">{user.name}</p>
        <p className="text-xs text-gray-400">{user.email}</p>
        <span className="mt-1 rounded-full bg-green-50 dark:bg-green-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-green-600 dark:text-lime-400">
          {user.role}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input {...register('name')} className="input" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input {...register('email')} disabled className="input opacity-60" />
          <p className="mt-1 text-xs text-gray-400">Email can't be changed in this demo.</p>
        </div>
        <Button type="submit" className="w-full">Update Profile</Button>
      </form>

      <div className="mt-6 flex flex-col divide-y divide-gray-100 dark:divide-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800">
        <button onClick={() => setPwModalOpen(true)} className="flex items-center gap-3 p-4 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
          <FiLock /> Change Password
        </button>
        <div className="flex items-center justify-between p-4">
          <span className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200"><FiMoon /> Dark Mode</span>
          <button onClick={toggleTheme} className={`h-6 w-11 rounded-full transition-colors ${theme === 'dark' ? 'bg-green-600' : 'bg-gray-300'}`}>
            <span className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-5' : ''}`} />
          </button>
        </div>
      </div>

      <ChangePasswordModal open={pwModalOpen} onClose={() => setPwModalOpen(false)} />
    </div>
  );
}

function ChangePasswordModal({ open, onClose }) {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm();
  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      await changePasswordApi(data.currentPassword, data.newPassword);
      toast.success('Password updated successfully!');
      reset();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
          <input type="password" {...register('currentPassword', { required: 'Required' })} className="input" />
          {errors.currentPassword && <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
          <input type="password" {...register('newPassword', { required: 'Required', minLength: { value: 6, message: 'Minimum 6 characters' } })} className="input" />
          {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
          <input
            type="password"
            {...register('confirmPassword', { required: 'Required', validate: (v) => v === newPassword || 'Passwords do not match' })}
            className="input"
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" loading={isSubmitting} className="w-full">Update Password</Button>
      </form>
    </Modal>
  );
}
