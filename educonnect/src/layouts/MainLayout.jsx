import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] text-gray-900 dark:text-gray-100">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl pb-24 md:pb-12"
      >
        <Outlet />
      </motion.main>
      <BottomNav />
    </div>
  );
}
