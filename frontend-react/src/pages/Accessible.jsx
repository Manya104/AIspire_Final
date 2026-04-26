import { useState, useEffect } from 'react';
import { searchJobs } from '../services/api';
import useVoiceInput from '../hooks/useVoiceInput';

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

const UI_TEXT = {
  en: {
    heading: 'Inclusive Career Search',
    subtitle: 'This portal is designed for people with disabilities to search for careers using an accessible interface.',
    placeholder: 'e.g., jobs for visually impaired',
    searchBtn: 'Search',
    readBtn: 'Read Results',
    pauseBtn: 'Pause',
    resumeBtn: 'Resume',
    stopBtn: 'Stop',
    contrastBtn: 'High Contrast',
    noQuery: 'Please enter a search query.',
    noResults: 'No matching jobs found.',
    errorMsg: 'Something went wrong. Please try again.',
    codeLabel: 'Code',
    confLabel: 'Confidence',
    langToggle: 'हिन्दी',
  },
  hi: {
    heading: 'समावेशी करियर खोज',
    subtitle: 'यह पोर्टल विकलांग व्यक्तियों के लिए एक सुलभ इंटरफ़ेस का उपयोग करके करियर खोजने के लिए बनाया गया है।',
    placeholder: 'जैसे, दृष्टिबाधित लोगों के लिए नौकरियाँ',
    searchBtn: 'खोजें',
    readBtn: 'परिणाम पढ़ें',
    pauseBtn: 'रोकें',
    resumeBtn: 'जारी रखें',
    stopBtn: 'बंद करें',
    contrastBtn: 'उच्च कंट्रास्ट',
    noQuery: 'कृपया एक खोज क्वेरी दर्ज करें।',
    noResults: 'कोई मिलती-जुलती नौकरियाँ नहीं मिलीं।',
    errorMsg: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
    codeLabel: 'कोड',
    confLabel: 'विश्वास',
    langToggle: 'English',
  },
};

export default function Accessible() {
  const [query, setQuery] = useState('');
  const [queryEn, setQueryEn] = useState('');
  const [resultsEn, setResultsEn] = useState([]);
  const [resultsHi, setResultsHi] = useState([]);
  const [error, setError] = useState('');
  const [highContrast, setHighContrast] = useState(false);
  const [langHindi, setLangHindi] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [ttsState, setTtsState] = useState('idle');

  const t = langHindi ? UI_TEXT.hi : UI_TEXT.en;
  const displayResults = langHindi && resultsHi.length > 0 ? resultsHi : resultsEn;
  const voiceLang = langHindi ? 'hi-IN' : 'en-IN';
  const { startListening } = useVoiceInput(voiceLang);

  useEffect(() => {
    return () => speechSynthesis.cancel();
  }, []);

  // Auto-translate query text when Hindi is selected
  useEffect(() => {
    if (!langHindi) return;
    if (!queryEn.trim()) return;
    const timer = setTimeout(() => {
      translateText(queryEn, 'hi').then((translated) => {
        setQuery(translated);
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [queryEn, langHindi]);

  // When switching language, translate existing query and results
  useEffect(() => {
    if (langHindi) {
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
  }, [langHindi]);

  const handleQueryChange = (value) => {
    setQuery(value);
    // Always store as English source — if user types in English while Hindi is on,
    // the debounced effect will auto-translate the display
    setQueryEn(value);
  };

  const handleSearch = async () => {
    const searchQuery = langHindi ? queryEn : query;
    if (!searchQuery.trim()) {
      setError(t.noQuery);
      return;
    }
    setError('');
    setResultsEn([]);
    setResultsHi([]);
    stopTTS();
    try {
      const res = await searchJobs(searchQuery, 'en');
      const data = res.data;
      if (!data || data.error || data.length === 0) {
        setError(t.noResults);
      } else {
        setResultsEn(data);
        if (langHindi) {
          setTranslating(true);
          const hi = await translateResults(data, 'hi');
          setResultsHi(hi);
          setTranslating(false);
        }
      }
    } catch {
      setError(t.errorMsg);
    }
  };

  const readAloud = () => {
    if (displayResults.length === 0) {
      alert(langHindi ? 'पढ़ने के लिए कोई परिणाम नहीं।' : 'No results to read.');
      return;
    }

    speechSynthesis.cancel();

    const text = displayResults
      .map((job) => `${job.title}. ${t.confLabel}: ${job.confidence_score}%. ${t.codeLabel}: ${job.code}. ${job.description}`)
      .join('. ');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang;
    utterance.onend = () => setTtsState('idle');
    utterance.onerror = () => setTtsState('idle');

    speechSynthesis.speak(utterance);
    setTtsState('speaking');
  };

  const pauseTTS = () => { speechSynthesis.pause(); setTtsState('paused'); };
  const resumeTTS = () => { speechSynthesis.resume(); setTtsState('speaking'); };
  const stopTTS = () => { speechSynthesis.cancel(); setTtsState('idle'); };

  const containerClass = highContrast ? 'high-contrast' : '';

  return (
    <div className={`flex-1 flex flex-col items-center px-4 py-8 ${containerClass}`}>
      <div className={`max-w-[650px] w-full bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-lg p-8 text-center ${containerClass}`}>
        <h1 tabIndex={0} className="text-2xl font-bold mb-2">{t.heading}</h1>
        <p tabIndex={0} className="text-slate-600 mb-6">{t.subtitle}</p>

        {/* Search */}
        <div className="flex flex-wrap gap-2 justify-center" role="search">
          <label htmlFor="accessible-query" className="sr-only">Search Job</label>
          <input
            id="accessible-query"
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t.placeholder}
            className="px-4 py-3 border-2 border-slate-500 rounded-xl text-base min-w-[250px]"
            aria-label="Job search input"
          />
          <button
            onClick={handleSearch}
            className="px-5 py-3 rounded-xl bg-primary text-white font-semibold"
            aria-label="Search Button"
          >
            {t.searchBtn}
          </button>
          <button
            onClick={() => startListening((transcript) => { setQuery(transcript); setTimeout(handleSearch, 100); })}
            className="px-4 py-3 rounded-xl bg-slate-200"
            aria-label="Voice search"
          >
            <span className="material-symbols-outlined">mic</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          {ttsState === 'idle' && (
            <button onClick={readAloud} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-700 text-white font-semibold" aria-label="Read search results aloud">
              <span className="material-symbols-outlined text-base">volume_up</span>
              {t.readBtn}
            </button>
          )}
          {ttsState === 'speaking' && (
            <>
              <button onClick={pauseTTS} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold" aria-label="Pause reading">
                <span className="material-symbols-outlined text-base">pause</span>
                {t.pauseBtn}
              </button>
              <button onClick={stopTTS} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white font-semibold" aria-label="Stop reading">
                <span className="material-symbols-outlined text-base">stop</span>
                {t.stopBtn}
              </button>
            </>
          )}
          {ttsState === 'paused' && (
            <>
              <button onClick={resumeTTS} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white font-semibold" aria-label="Resume reading">
                <span className="material-symbols-outlined text-base">play_arrow</span>
                {t.resumeBtn}
              </button>
              <button onClick={stopTTS} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white font-semibold" aria-label="Stop reading">
                <span className="material-symbols-outlined text-base">stop</span>
                {t.stopBtn}
              </button>
            </>
          )}

          <button
            onClick={() => setHighContrast(!highContrast)}
            className="px-4 py-2 rounded-xl bg-slate-700 text-white font-semibold"
            aria-label="Toggle high contrast mode"
          >
            {t.contrastBtn}
          </button>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={langHindi}
              onChange={() => setLangHindi(!langHindi)}
              className="scale-125"
              aria-label="Language Toggle"
            />
            <span>{t.langToggle}</span>
          </label>
        </div>

        {/* Translating indicator */}
        {translating && (
          <p className="mt-3 text-sm text-amber-600 flex items-center justify-center gap-2">
            <span className="inline-block size-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
            {langHindi ? 'हिन्दी में अनुवाद हो रहा है...' : 'Translating...'}
          </p>
        )}

        {/* Results */}
        <div className={`mt-6 text-left bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[100px] results-area ${containerClass}`} role="region" aria-live="polite">
          {error && <p className="text-slate-600">{error}</p>}
          {displayResults.map((job, i) => (
            <div key={i} className="mb-4 p-3 bg-white rounded-lg border border-slate-200">
              <h3 className="font-bold text-lg">{job.title}</h3>
              <p className="text-sm text-slate-500">{t.codeLabel}: {job.code}</p>
              <p className="text-sm font-semibold text-primary">{t.confLabel}: {job.confidence_score}%</p>
              <p className="text-sm text-slate-600 mt-1">{job.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
