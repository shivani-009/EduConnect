import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiChevronDown } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { subjects, testimonials, faqs } from '../data/tutors';
import { useTutors } from '../context/TutorContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const { fetchTutors } = useTutors();
  const [featuredTutor, setFeaturedTutor] = useState(null);

  useEffect(() => {
    fetchTutors({ sort: 'rating' }).then((list) => setFeaturedTutor(list[0] || null));
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('loc', location);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="px-5 md:px-8 pb-10">
      <p className="pt-6 text-center text-xs font-medium text-gray-400">
        Find verified tutors near you
      </p>
      <h1 className="mt-3 text-center text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white max-w-3xl mx-auto">
        Find the <span className="bg-gradient-to-r from-green-600 to-lime-500 bg-clip-text text-transparent">Perfect</span> Tutor Near You
      </h1>
      <p className="mt-3 text-center text-sm md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
        Stop scrolling endless listings — tell us what you need and we'll match you with verified tutors nearby, for home visits, online lessons, or both.
      </p>

      <form onSubmit={handleSearch} className="mt-6 max-w-2xl mx-auto space-y-3 md:space-y-0 md:flex md:gap-3">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 md:flex-1">
          <FiSearch className="text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to learn?"
            className="w-full bg-transparent text-sm outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 md:flex-1">
          <FiMapPin className="text-gray-400" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location or online"
            className="w-full bg-transparent text-sm outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
          />
        </div>
        <Button type="submit" className="w-full md:w-auto md:px-8">Search</Button>
      </form>

      <div className="mt-3 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
        {['Home Visit', 'Online', 'Both'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => navigate(`/search?mode=${encodeURIComponent(m)}`)}
            className="rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-green-400 hover:text-green-600 dark:hover:text-lime-400"
          >
            {m}
          </button>
        ))}
      </div>

      <section className="mt-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Explore Subjects</h2>
          <button onClick={() => navigate('/search')} className="text-xs font-semibold text-green-600 dark:text-lime-400">
            View All Categories
          </button>
        </div>
        <p className="mb-4 text-xs text-gray-400">Find the most popular learning categories today.</p>
        <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
          {subjects.map((s) => (
            <motion.div
              key={s.name}
              whileHover={{ scale: 1.01 }}
              onClick={() => navigate(`/search?subject=${encodeURIComponent(s.name)}`)}
              className="relative h-32 cursor-pointer overflow-hidden rounded-2xl"
            >
              <img src={s.img} alt={s.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <p className="font-bold">{s.name}</p>
                <p className="text-xs opacity-90">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-10 max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Top-Rated Tutors</h2>
        <p className="mb-4 text-xs text-gray-400">Experts who have helped students achieve excellence.</p>
        {!featuredTutor ? (
          <div
            onClick={() => navigate('/search')}
            className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 p-6 text-sm text-gray-400"
          >
            Browse all tutors →
          </div>
        ) : (
          <div
            onClick={() => navigate(`/tutor/${featuredTutor.id}`)}
            className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-4 shadow-sm"
          >
            <img src={featuredTutor.image} alt={featuredTutor.name} className="h-16 w-16 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-bold text-gray-900 dark:text-white">{featuredTutor.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{featuredTutor.subject} • {featuredTutor.experience}+ yrs Exp</p>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="rounded-full bg-green-50 dark:bg-green-500/10 px-2 py-0.5 font-semibold text-green-600 dark:text-lime-400">
                  ★ {featuredTutor.rating}
                </span>
                <span className="rounded-full bg-gray-50 dark:bg-slate-700 px-2 py-0.5 text-gray-500 dark:text-gray-300">{featuredTutor.mode}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900 dark:text-white">${featuredTutor.price}<span className="text-xs font-normal text-gray-400">/hr</span></p>
              <Button
                onClick={(e) => { e.stopPropagation(); navigate(`/tutor/${featuredTutor.id}`); }}
                className="mt-2 !px-3 !py-1.5 text-xs"
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-10 max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Student Success Stories</h2>
        <div className="mt-4 flex flex-col md:grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-4 shadow-sm">
              <p className="text-sm italic text-gray-600 dark:text-gray-300">"{t.text}"</p>
              <p className="mt-3 text-sm font-bold text-gray-900 dark:text-white">{t.name}</p>
              <p className="text-xs text-gray-400">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
        <div className="mt-4 divide-y divide-gray-100 dark:divide-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800">
          {faqs.map((f, i) => (
            <div key={f.q} className="p-4">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{f.q}</span>
                <FiChevronDown className={`shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''} text-gray-400`} />
              </button>
              {openFaq === i && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 max-w-3xl mx-auto rounded-2xl gradient-primary p-6 md:p-10 text-center text-white">
        <h2 className="text-xl md:text-2xl font-bold">Ready to Start Learning?</h2>
        <p className="mt-2 text-sm md:text-base opacity-90">Join thousands of students achieving their goals with EduConnect.</p>
        <div className="mt-5 flex flex-col md:flex-row md:justify-center gap-3">
          <Button onClick={() => navigate('/register')} className="w-full md:w-auto !bg-white !text-green-600 shadow-none">
            Get Started Free
          </Button>
          <Button onClick={() => navigate('/search')} variant="outline" className="w-full md:w-auto !border-white/40 !text-white !bg-transparent">
            Browse Tutors
          </Button>
        </div>
      </section>

      <footer className="mt-10 text-center text-xs text-gray-400">
        <p className="mb-2 font-bold text-gray-500 dark:text-gray-300">EduConnect</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/faq')}>Privacy Policy</button>
          <button onClick={() => navigate('/faq')}>Terms of Service</button>
          <button onClick={() => navigate('/contact')}>Contact Us</button>
        </div>
        <p className="mt-3">© 2026 EduConnect. Professional Tutor Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
}
