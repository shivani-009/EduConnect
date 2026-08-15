import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0B1120] dark:to-[#0B1120]">
      <div className="mx-auto max-w-md px-5 pt-5">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-lime-400">
          <FiArrowLeft size={16} /> Back to Home
        </Link>
      </div>
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto max-w-md px-5 py-4"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
