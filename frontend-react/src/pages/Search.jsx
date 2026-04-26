import { useState } from 'react';
import { searchJobs, getIntentAnalysis } from '../services/api';
import { useLang } from '../context/LanguageContext';
import useVoiceInput from '../hooks/useVoiceInput';
import JobCard from '../components/JobCard';

export default function Search() {
  const { lang, toggleLang, t } = useLang();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [intent, setIntent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const voiceLang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  const { isListening, startListening } = useVoiceInput(voiceLang);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError(t.noQuery);
      return;
    }

    setLoading(true);
    setError('');
    setIntent(null);

    try {
      const [searchRes, intentRes] = await Promise.allSettled([
        searchJobs(query, lang),
        getIntentAnalysis(query),
      ]);

      if (searchRes.status === 'fulfilled') {
        const data = searchRes.value.data;
        if (!data || data.error || data.length === 0) {
          setResults([]);
          setError(t.noResults);
        } else {
          setResults(data);
        }
      } else {
        setError(t.error);
      }

      if (intentRes.status === 'fulfilled') {
        setIntent(intentRes.value.data);
      }
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoice = () => {
    startListening((transcript) => {
      setQuery(transcript);
      setTimeout(handleSearch, 100);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 md:py-12">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur rounded-2xl border border-slate-200 shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{t.title}</h1>
        <p className="text-slate-600 mb-6">{t.subtitle}</p>

        {/* Search Bar */}
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t.placeholder}
            className="flex-1 min-w-[200px] px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
          <button
            onClick={handleVoice}
            title="Voice Input"
            className={`px-4 py-3 rounded-xl transition-colors ${
              isListening ? 'bg-red-400 text-white animate-pulse' : 'bg-slate-200 hover:bg-slate-300'
            }`}
          >
            <span className="material-symbols-outlined">mic</span>
          </button>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Searching...' : t.searchBtn}
          </button>
        </div>

        {/* Language Toggle */}
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600">
            <input
              type="checkbox"
              checked={lang === 'hi'}
              onChange={toggleLang}
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span>{t.langLabel}</span>
          </label>
        </div>

        {/* Intent Analysis Badge */}
        {intent && (
          <div className="mt-4 p-3 bg-accent-blue/5 rounded-xl border border-accent-blue/20">
            <p className="text-sm font-semibold text-accent-blue">
              <span className="material-symbols-outlined text-sm align-middle mr-1">psychology</span>
              Detected Intent: <span className="uppercase">{intent.intent}</span>
              {intent.confidence && (
                <span className="text-slate-500 font-normal ml-2">
                  ({(intent.confidence * 100).toFixed(0)}% confidence)
                </span>
              )}
            </p>
            {intent.entities && intent.entities.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {intent.entities.map((ent, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink text-xs font-bold">
                    {ent.label}: {ent.text}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && <p className="mt-6 text-slate-500">{error}</p>}

        {/* Results */}
        <div className="mt-8 grid gap-4">
          {results.map((job, idx) => (
            <JobCard key={job.code + idx} job={job} lang={lang} />
          ))}
        </div>
      </div>
    </div>
  );
}
