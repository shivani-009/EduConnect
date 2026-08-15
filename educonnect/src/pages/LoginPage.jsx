import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMoon, FiSun } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';

export default function LoginPage({ role = 'student' }) {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const redirectTo = role === 'tutor' ? '/tutor/dashboard' : location.state?.from?.pathname || '/student/dashboard';

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      toast.success('Welcome back!');
      navigate(result.user.role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard', { replace: true });
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  const handleSocialClick = (provider) => {
    toast(`${provider} sign-in isn't available in this demo — please use your email and password.`, { icon: 'ℹ️' });
  };

  return (
    <div className="relative">
      <button onClick={toggleTheme} className="absolute right-0 top-0 rounded-full bg-white dark:bg-slate-800 p-2 shadow">
        {theme === 'dark' ? <FiSun /> : <FiMoon />}
      </button>

      <h1 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-green-600 to-lime-500 bg-clip-text text-transparent">
        EduConnect
      </h1>
      <h2 className="mt-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
        {role === 'tutor' ? 'Tutor Sign In' : 'Welcome back to learning'}
      </h2>
      <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
        Access your personalized dashboard and connect with top-tier {role === 'tutor' ? 'students' : 'tutors'}.
      </p>

      <div className="mt-6 rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
              className="w-full rounded-xl bg-gray-50 dark:bg-slate-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              })}
              className="w-full rounded-xl bg-gray-50 dark:bg-slate-700 px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <input type="checkbox" {...register('remember')} className="rounded" />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => toast('Password reset isn\'t wired up in this demo yet — use Change Password from your Profile once logged in.', { icon: '📧' })}
              className="font-semibold text-green-600 dark:text-lime-400"
            >
              Forgot Password?
            </button>
          </div>
          <Button type="submit" loading={isSubmitting} className="w-full">
            Sign In
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200 dark:bg-slate-700" /> OR CONTINUE WITH <span className="h-px flex-1 bg-gray-200 dark:bg-slate-700" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => handleSocialClick('Google')}>Google</Button>
          <Button variant="outline" onClick={() => handleSocialClick('Apple')}>Apple</Button>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to={role === 'tutor' ? '/tutor/register' : '/register'} className="font-semibold text-green-600 dark:text-lime-400">
            Sign up for free
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        {role === 'tutor' ? (
          <>Are you a student? <Link to="/login" className="font-semibold text-green-600 dark:text-lime-400">Student login</Link></>
        ) : (
          <>Are you a tutor? <Link to="/tutor/login" className="font-semibold text-green-600 dark:text-lime-400">Tutor login</Link></>
        )}
      </p>
    </div>
  );
}
