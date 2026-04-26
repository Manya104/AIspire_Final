import { useState } from 'react';
import { searchJobs } from '../services/api';
import useVoiceInput from '../hooks/useVoiceInput';

export default function Accessible() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [highContrast, setHighContrast] = useState(false);
  const [langHindi, setLangHindi] = useState(false);

  const voiceLang = langHindi ? 'hi-IN' : 'en-IN';
  const { startListening } = useVoiceInput(voiceLang);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query.');
      return;
    }
    setError('');
    try {
      const res = await searchJobs(query);
      const data = res.data;
      if (!data || data.error || data.length === 0) {
        setError('No matching jobs found.');
        setResults([]);
      } else {
        setResults(data);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  const readAloud = () => {
    if (results.length === 0) {
      alert('No results to read.');
      return;
    }
    const text = results
      .map((job) => `${job.title}. Confidence: ${job.confidence_score}%. Code: ${job.code}. ${job.description}`)
      .join('. Next result: ');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langHindi ? 'hi-IN' : 'en-IN';
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const containerClass = highContrast ? 'high-contrast' : '';

  return (
    <div className={`flex-1 flex flex-col items-center px-4 py-8 ${containerClass}`}>
      <div className={`max-w-[650px] w-full bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-lg p-8 text-center ${containerClass}`}>
        <h1 tabIndex={0} className="text-2xl font-bold mb-2">Inclusive Career Search</h1>
        <p tabIndex={0} className="text-slate-600 mb-6">
          This portal is designed for people with disabilities to search for careers using an accessible interface.
        </p>

        {/* Search */}
        <div className="flex flex-wrap gap-2 justify-center" role="search">
          <label htmlFor="accessible-query" className="sr-only">Search Job</label>
          <input
            id="accessible-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g., jobs for visually impaired"
            className="px-4 py-3 border-2 border-slate-500 rounded-xl text-base min-w-[250px]"
            aria-label="Job search input"
          />
          <button
            onClick={handleSearch}
            className="px-5 py-3 rounded-xl bg-primary text-white font-semibold"
            aria-label="Search Button"
          >
            Search
          </button>
          <button
            onClick={() => startListening((t) => { setQuery(t); setTimeout(handleSearch, 100); })}
            className="px-4 py-3 rounded-xl bg-slate-200"
            aria-label="Voice search"
          >
            <span className="material-symbols-outlined">mic</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <button onClick={readAloud} className="px-4 py-2 rounded-xl bg-slate-700 text-white font-semibold" aria-label="Read search results aloud">
            Read Results
          </button>
          <button onClick={() => setHighContrast(!highContrast)} className="px-4 py-2 rounded-xl bg-slate-700 text-white font-semibold" aria-label="Toggle high contrast mode">
            High Contrast
          </button>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={langHindi}
              onChange={() => setLangHindi(!langHindi)}
              className="scale-125"
              aria-label="Language Toggle"
            />
            <span>{langHindi ? 'English' : 'हिन्दी'}</span>
          </label>
        </div>

        {/* Results */}
        <div className={`mt-6 text-left bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[100px] results-area ${containerClass}`} role="region" aria-live="polite">
          {error && <p className="text-slate-600">{error}</p>}
          {results.map((job, i) => (
            <div key={i} className="mb-4 p-3 bg-white rounded-lg border border-slate-200">
              <h3 className="font-bold text-lg">{job.title}</h3>
              <p className="text-sm text-slate-500">Code: {job.code}</p>
              <p className="text-sm font-semibold text-primary">Confidence: {job.confidence_score}%</p>
              <p className="text-sm text-slate-600 mt-1">{job.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
