import { useState } from 'react';
import { searchJobs } from '../services/api';

const skillIndiaJobs = [
  { title: "Electrician", sector: "Power", skills: ["Wiring", "Circuit repair", "Safety protocols"] },
  { title: "Plumber", sector: "Construction", skills: ["Pipe fitting", "Drainage systems", "Water supply"] },
  { title: "Welder", sector: "Manufacturing", skills: ["Arc welding", "Gas welding", "Blueprint reading"] },
  { title: "Data Entry Operator", sector: "IT-ITeS", skills: ["Typing", "MS Office", "Database management"] },
  { title: "Beauty Therapist", sector: "Beauty & Wellness", skills: ["Skincare", "Hair styling", "Client consultation"] },
  { title: "Solar Panel Technician", sector: "Green Energy", skills: ["PV installation", "Inverter setup", "Maintenance"] },
  { title: "Automotive Mechanic", sector: "Automotive", skills: ["Engine repair", "Diagnostics", "Brake systems"] },
  { title: "Healthcare Assistant", sector: "Healthcare", skills: ["Patient care", "Vital signs", "First aid"] },
];

export default function SkillCard() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [ncoResults, setNcoResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (job) => {
    setSelectedJob(job);
    setLoading(true);
    try {
      const res = await searchJobs(job.title);
      setNcoResults(res.data.slice(0, 5));
    } catch {
      setNcoResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Skill India Job Cards</h1>
        <p className="text-slate-600 text-center mb-8">
          Explore skill-based jobs and find matching NCO occupations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {skillIndiaJobs.map((job) => (
            <div
              key={job.title}
              onClick={() => handleSelect(job)}
              className={`cursor-pointer p-5 rounded-xl border transition-all ${
                selectedJob?.title === job.title
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : 'border-slate-200 bg-white hover:border-primary/40 hover:shadow-md'
              }`}
            >
              <h3 className="font-bold text-slate-900 mb-1">{job.title}</h3>
              <p className="text-xs text-slate-500 mb-2">Sector: {job.sector}</p>
              <div className="flex flex-wrap gap-1">
                {job.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedJob && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
            <h2 className="text-xl font-bold text-primary mb-1">{selectedJob.title}</h2>
            <p className="text-slate-500 text-sm mb-4">Sector: {selectedJob.sector}</p>

            <h3 className="font-semibold text-slate-800 mb-2">Matching NCO Occupations</h3>
            {loading ? (
              <p className="text-slate-500">Loading...</p>
            ) : ncoResults.length > 0 ? (
              <div className="grid gap-3">
                {ncoResults.map((r, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-slate-800">{r.title}</p>
                        <p className="text-xs text-slate-500">Code: {r.code}</p>
                      </div>
                      <span className="text-sm font-bold text-primary">{r.confidence_score}%</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{r.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No NCO matches found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
