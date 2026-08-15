import { motion } from 'framer-motion';

const variants = {
  primary: 'gradient-primary text-white shadow-lg shadow-green-500/25',
  outline: 'border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800',
  ghost: 'text-green-600 dark:text-lime-400',
  danger: 'bg-red-500 text-white',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  icon: Icon,
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-sm transition-opacity disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </motion.button>
  );
}
