import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    title: "Discover Your Career",
    subtitle: "Find the perfect job using AI-enabled semantic search (based on NCO 2015)",
    placeholder: "e.g., jobs for women in agriculture",
    searchBtn: "Search",
    langLabel: "हिन्दी",
    noQuery: "Please enter a search query.",
    noResults: "No matching jobs found.",
    error: "Something went wrong. Try again later.",
    codeLabel: "Code",
    confidenceLabel: "Confidence",
  },
  hi: {
    title: "अपना करियर खोजें",
    subtitle: "AI-सक्षम सर्च के माध्यम से सही नौकरी खोजें (NCO 2015 पर आधारित)",
    placeholder: "जैसे, कृषि में महिलाओं के लिए नौकरियाँ",
    searchBtn: "खोजें",
    langLabel: "English",
    noQuery: "कृपया एक खोज क्वेरी दर्ज करें।",
    noResults: "कोई मिलती-जुलती नौकरियाँ नहीं मिलीं।",
    error: "कुछ गलत हो गया। बाद में पुनः प्रयास करें।",
    codeLabel: "कोड",
    confidenceLabel: "विश्वास",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const toggleLang = () => setLang((l) => (l === 'en' ? 'hi' : 'en'));
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
