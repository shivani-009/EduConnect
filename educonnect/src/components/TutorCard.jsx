import { useNavigate } from 'react-router-dom';
import { FiStar, FiClock, FiMapPin, FiHome, FiWifi, FiRepeat } from 'react-icons/fi';
import { motion } from 'framer-motion';

const modeMeta = {
  Online: { icon: FiWifi, label: 'Online', className: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  'Home Visit': { icon: FiHome, label: 'Home Visit', className: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  Both: { icon: FiRepeat, label: 'Home & Online', className: 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400' },
};

export default function TutorCard({ tutor }) {
  const navigate = useNavigate();
  const mode = modeMeta[tutor.mode] || modeMeta.Online;
  const ModeIcon = mode.icon;
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/tutor/${tutor.id}`)}
      className="cursor-pointer rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-[#131C31] p-4 shadow-sm"
    >
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <img src={tutor.image} alt={tutor.name} className="h-16 w-16 rounded-xl object-cover" />
          {tutor.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-[#131C31]" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{tutor.name}</h3>
              <p className="text-sm text-green-600 dark:text-lime-400 font-medium">{tutor.subject}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <FiStar className="fill-yellow-400 text-yellow-400" /> {tutor.rating}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><FiClock size={12} /> ${tutor.price}/hr</span>
            {tutor.distance != null && (
              <span className="flex items-center gap-1"><FiMapPin size={12} /> {tutor.distance} miles</span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${mode.className}`}>
          <ModeIcon size={10} /> {mode.label}
        </span>
        {tutor.topRated && (
          <span className="rounded-full bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-amber-600 dark:text-amber-400">
            TOP RATED
          </span>
        )}
        {tutor.verified && (
          <span className="rounded-full bg-green-50 dark:bg-green-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-green-600 dark:text-lime-400">
            VERIFIED
          </span>
        )}
      </div>
    </motion.div>
  );
}
