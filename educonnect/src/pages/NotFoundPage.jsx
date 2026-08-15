import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-extrabold bg-gradient-to-r from-green-600 to-lime-500 bg-clip-text text-transparent">404</p>
      <h1 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">Page not found</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">The page you're looking for doesn't exist.</p>
      <Button onClick={() => navigate('/')} className="mt-6">Back to Home</Button>
    </div>
  );
}
