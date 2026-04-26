import { useState, useEffect, useRef } from 'react';
import { searchJobs, getIntentAnalysis } from '../services/api';
import { useLang } from '../context/LanguageContext';
import useVoiceInput from '../hooks/useVoiceInput';
import JobCard from '../components/JobCard';

async function translateText(text, targetLang) {
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const json = await res.json();
    return json[0].map((item) => item[0]).join('');
  } catch {
    return text;
  }
}

async function translateResults(results, targetLang) {
  const translated = [];
  for (const job of results) {
    translated.push({
      ...job,
      title: await translateText(job.title, targetLang),
      description: await translateText(job.description || '', targetLang),
    });
  }
  return translated;
}

export default function Search() {
  const { lang, toggleLang, t } = useLang();
  const [query, setQuery] = useState('');
  const [queryEn, setQueryEn] = useState('');
  const [resultsEn, setResultsEn] = useState([]);
  const [resultsHi, setResultsHi] = useState([]);
  const [intent, setIntent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState('');
  const [ttsState, setTtsState] = useState('idle');
  const utteranceRef = useRef(null);

  const voiceLang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  const { isListening, startListening } = useVoiceInput(voiceLang);

  const displayResults = lang === 'hi' && resultsHi.length > 0 ? resultsHi : resultsEn;

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  // Auto-translate query when Hindi is selected
  useEffect(() => {
    if (lang !== 'hi') return;
    if (!queryEn.trim()) return;
    const timer = setTimeout(() => {
      translateText(queryEn, 'hi').then((translated) => setQuery(translated));
    }, 500);
    return () => clearTimeout(timer);
  }, [queryEn, lang]);

  // When switching language, translate existing query and results
  useEffect(() => {
    if (lang === 'hi') {
      if (queryEn.trim()) {
        translateText(queryEn, 'hi').then((translated) => setQuery(translated));
      }
      if (resultsEn.length > 0 && resultsHi.length === 0) {
        setTranslating(true);
        translateResults(resultsEn, 'hi').then((hi) => {
          setResultsHi(hi);
          setTranslating(false);
        });
      }
    } else {
      if (queryEn.trim()) {
        setQuery(queryEn);
      }
    }
  }, [lang]);

  const handleQueryChange = (value) => {
    setQuery(value);
    setQueryEn(value);
  };

  const handleSearch = async () => {
    const searchQuery = lang === 'hi' ? queryEn : query;
    if (!searchQuery.trim()) {
      setError(t.noQuery);
      return;
    }

    setLoading(true);
    setError('');
    setIntent(null);
    setResultsEn([]);
    setResultsHi([]);
    stopTTS();

    try {
      const [searchRes, intentRes] = await Promise.allSettled([
        searchJobs(searchQuery, 'en'),
        getIntentAnalysis(searchQuery),
      ]);

      if (searchRes.status === 'fulfilled') {
        const data = searchRes.value.data;
        if (!data || data.error || data.length === 0) {
          setError(t.noResults);
        } else {
          setResultsEn(data);
          if (lang === 'hi') {
            setTranslating(true);
            const hiResults = await translateResults(data, 'hi');
            setResultsHi(hiResults);
            setTranslating(false);
          }
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

  useEffect(() => {
    if (resultsEn.length > 0 && lang === 'hi' && resultsHi.length === 0) {
      setTranslating(true);
      translateResults(resultsEn, 'hi').then((hi) => {
        setResultsHi(hi);
        setTranslating(false);
      });
    }
  }, [lang]);

  const handleVoice = () => {
    startListening((transcript) => {
      setQuery(transcript);
      setTimeout(handleSearch, 100);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // --- TTS Controls ---
  const readResults = () => {
    if (displayResults.length === 0) return;

    speechSynthesis.cancel();

    const text = displayResults
      .map((job) => `${job.title}. Confidence: ${job.confidence_score}%. Code: ${job.code}. ${job.description}`)
      .join('. Next result: ');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setTtsState('idle');
    utterance.onerror = () => setTtsState('idle');
    utteranceRef.current = utterance;

    speechSynthesis.speak(utterance);
    setTtsState('speaking');
  };

  const pauseTTS = () => {
    speechSynthesis.pause();
    setTtsState('paused');
  };

  const resumeTTS = () => {
    speechSynthesis.resume();
    setTtsState('speaking');
  };

  const stopTTS = () => {
    speechSynthesis.cancel();
    setTtsState('idle');
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
            onChange={(e) => handleQueryChange(e.target.value)}
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
        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600">
            <input
              type="checkbox"
              checked={lang === 'hi'}
              onChange={toggleLang}
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span>{t.langLabel}</span>
          </label>

          {/* TTS Controls */}
          {displayResults.length > 0 && (
            <div className="flex items-center gap-2">
              {ttsState === 'idle' && (
                <button
                  onClick={readResults}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">volume_up</span>
                  Read Results
                </button>
              )}
              {ttsState === 'speaking' && (
                <>
                  <button
                    onClick={pauseTTS}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">pause</span>
                    Pause
                  </button>
                  <button
                    onClick={stopTTS}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">stop</span>
                    Stop
                  </button>
                </>
              )}
              {ttsState === 'paused' && (
                <>
                  <button
                    onClick={resumeTTS}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">play_arrow</span>
                    Resume
                  </button>
                  <button
                    onClick={stopTTS}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">stop</span>
                    Stop
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Translating indicator */}
        {translating && (
          <p className="mt-3 text-sm text-amber-600 flex items-center gap-2">
            <span className="inline-block size-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
            Translating results to Hindi...
          </p>
        )}

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
          {displayResults.map((job, idx) => (
            <JobCard key={job.code + idx} job={job} lang={lang} />
          ))}
        </div>
      </div>
    </div>
  );
}
