export default function JobCard({ job, lang = 'en' }) {
  const codeLabel = lang === 'hi' ? 'कोड' : 'Code';
  const confLabel = lang === 'hi' ? 'विश्वास' : 'Confidence';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-primary/40 transition-all">
      <h3 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h3>
      <p className="text-sm text-slate-500 mb-1">{codeLabel}: {job.code}</p>
      {job.confidence_score !== undefined && (
        <p className="text-sm font-semibold text-primary mb-2">
          {confLabel}: {job.confidence_score}%
        </p>
      )}
      {job.intent && (
        <span className="inline-block px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-bold mb-2">
          {job.intent}
        </span>
      )}
      <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>
      {job.reasoning && (
        <p className="text-xs text-slate-400 mt-2 italic">{job.reasoning}</p>
      )}
    </div>
  );
}
