import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiMap, FiCrosshair, FiX, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useTutors } from '../context/TutorContext';
import TutorCard from '../components/TutorCard';
import MapComponent from '../components/MapComponent';
import { geocodeLocation, reverseGeocode } from '../utils/geo';

const subjectOptions = ['All Subjects', 'Mathematics', 'Physics', 'English', 'Computer Science'];
const modeOptions = ['Any Mode', 'Online', 'Home Visit', 'Both'];
const priceOptions = [
  { label: 'Any Price', value: '' },
  { label: 'Under $40/hr', value: '40' },
  { label: 'Under $50/hr', value: '50' },
  { label: 'Under $60/hr', value: '60' },
];
const ratingOptions = [
  { label: 'Any Rating', value: '' },
  { label: '4.5+ Stars', value: '4.5' },
  { label: '4.8+ Stars', value: '4.8' },
];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const { tutors, loading, fetchTutors } = useTutors();
  const [query, setQuery] = useState(params.get('q') || '');
  const [locationText, setLocationText] = useState(params.get('loc') || '');
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [radiusNote, setRadiusNote] = useState('');
  const [subject, setSubject] = useState(params.get('subject') || 'All Subjects');
  const [mode, setMode] = useState(params.get('mode') || 'Any Mode');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [sort, setSort] = useState('rating');

  const runSearch = useCallback(async (loc) => {
    const results = await fetchTutors({
      query,
      subject: subject === 'All Subjects' ? '' : subject,
      mode: mode === 'Any Mode' ? '' : mode,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      minRating: minRating ? Number(minRating) : null,
      sort,
      lat: loc?.lat,
      lng: loc?.lng,
      radiusMiles: 25,
    });
    if (loc && results.length === 0) {
      setRadiusNote(`No tutors within 25 miles of "${locationText}" yet — try a different area or broaden your filters.`);
    } else {
      setRadiusNote('');
    }
  }, [query, subject, mode, maxPrice, minRating, sort, locationText, fetchTutors]);

  useEffect(() => {
    const loc = params.get('loc');
    if (loc && !coords) {
      geocodeLocation(loc).then((res) => {
        if (res) {
          setCoords(res);
          setLocationText(loc);
        } else {
          toast.error(`Couldn't find "${loc}" — try a different city or address.`);
        }
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    runSearch(coords);
    // eslint-disable-next-line
  }, [query, subject, mode, maxPrice, minRating, sort, coords]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const label = await reverseGeocode(latitude, longitude);
        setCoords({ lat: latitude, lng: longitude, label });
        setLocationText(label);
        toast.success('Showing tutors near you');
        setLocating(false);
      },
      () => {
        toast.error('Unable to get your location');
        setLocating(false);
      }
    );
  };

  const searchByLocationText = async (e) => {
    e.preventDefault();
    if (!locationText.trim()) {
      setCoords(null);
      return;
    }
    setLocating(true);
    const res = await geocodeLocation(locationText);
    setLocating(false);
    if (res) setCoords(res);
    else toast.error(`Couldn't find "${locationText}"`);
  };

  const clearAll = () => {
    setQuery('');
    setLocationText('');
    setCoords(null);
    setSubject('All Subjects');
    setMode('Any Mode');
    setMaxPrice('');
    setMinRating('');
    setRadiusNote('');
    setParams({});
  };

  const activeFilterCount = [
    subject !== 'All Subjects', mode !== 'Any Mode', !!maxPrice, !!minRating, !!coords,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1120] px-4 md:px-8 pb-6">
      <div className="sticky top-16 z-30 -mx-4 md:-mx-8 bg-white dark:bg-[#0B1120] px-4 md:px-8 py-3">
        <div className="flex flex-col md:flex-row gap-2 max-w-3xl">
          <div className="flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-slate-800 px-4 py-3 md:flex-1">
            <FiSearch className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search math, physics..."
              className="w-full bg-transparent text-sm outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
            />
          </div>
          <form onSubmit={searchByLocationText} className="flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-slate-800 px-4 py-3 md:flex-1">
            <FiMapPin className="text-gray-400 shrink-0" />
            <input
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="Enter your city or address"
              className="w-full bg-transparent text-sm outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={useMyLocation}
              disabled={locating}
              className="shrink-0 flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-lime-400"
            >
              <FiCrosshair size={14} /> {locating ? '...' : 'Near me'}
            </button>
          </form>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <FilterSelect value={subject} onChange={setSubject} options={subjectOptions} />
          <FilterSelect value={mode} onChange={setMode} options={modeOptions} />
          <FilterSelect value={maxPrice} onChange={setMaxPrice} options={priceOptions.map((o) => o.value)} labels={priceOptions} />
          <FilterSelect value={minRating} onChange={setMinRating} options={ratingOptions.map((o) => o.value)} labels={ratingOptions} />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {tutors.length} tutors found{coords ? ` near "${coords.label?.split(',')[0] || locationText}"` : ' nearby'}
          </p>
          <div className="flex items-center gap-3">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg bg-gray-100 dark:bg-slate-800 px-2 py-1 text-xs text-gray-600 dark:text-gray-300">
              <option value="rating">Top rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="distance">Nearest</option>
            </select>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-lime-400">
                <FiX size={12} /> Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {radiusNote && (
        <p className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-xs text-amber-700 dark:text-amber-400">
          {radiusNote}
        </p>
      )}

      {loading ? (
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tutors.map((t) => (
            <TutorCard key={t.id} tutor={t} />
          ))}
          {tutors.length === 0 && !radiusNote && (
            <p className="col-span-full mt-10 text-center text-sm text-gray-400">
              No tutors match your filters — try widening your search.
            </p>
          )}
        </div>
      )}

      <div className="relative mt-5 max-w-3xl">
        <button
          onClick={() => setShowMap((v) => !v)}
          className="absolute -top-11 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow"
        >
          {showMap ? <FiCrosshair /> : <FiMap />}
        </button>
        {showMap && (
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 p-3">
            <MapComponent lat={coords?.lat || 40.758} lng={coords?.lng || -73.9855} zoom={coords ? 12 : 11} height={260} popupText={coords ? 'Your search area' : 'Search area'} />
            <p className="mt-2 text-xs text-gray-400">Map Insight — click pins to view tutor details</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ value, onChange, options, labels }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="shrink-0 rounded-full bg-gray-100 dark:bg-slate-800 px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 outline-none">
      {options.map((opt, i) => (
        <option key={opt || i} value={opt}>{labels ? labels[i].label : opt}</option>
      ))}
    </select>
  );
}
