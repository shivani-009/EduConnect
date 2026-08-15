import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export default function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto rounded-t-3xl bg-white dark:bg-[#131C31] p-5 max-h-[85vh] overflow-y-auto"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
              <button onClick={onClose}>
                <FiX size={22} className="text-gray-400" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
