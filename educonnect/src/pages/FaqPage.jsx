import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { faqs } from '../data/tutors';

export default function FaqPage() {
  const [open, setOpen] = useState(null);
  return (
    <div className="px-4 md:px-8 pb-6 pt-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h1>
      <div className="mt-4 divide-y divide-gray-100 dark:divide-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800">
        {faqs.map((f, i) => (
          <div key={f.q} className="p-4">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between text-left">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{f.q}</span>
              <FiChevronDown className={`shrink-0 transition-transform ${open === i ? 'rotate-180' : ''} text-gray-400`} />
            </button>
            {open === i && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
