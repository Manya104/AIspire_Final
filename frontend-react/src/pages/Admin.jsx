import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEmbeddings, updateEmbeddings, logAudit } from '../services/api';

export default function Admin() {
  const { isAdmin } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [searchBox, setSearchBox] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ code: '', title: '', description: '' });

  useEffect(() => {
    if (isAdmin) loadJobs();
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/login" />;

  const loadJobs = async () => {
    try {
      const res = await getEmbeddings();
      setJobs(res.data);
    } catch (err) {
      console.error('Error loading jobs:', err);
    }
  };

  const saveJobs = async (updatedJobs) => {
    try {
      const res = await updateEmbeddings(updatedJobs);
      if (res.data.status === 'success') {
        setJobs(updatedJobs);
        alert('Jobs updated successfully!');
      } else {
        alert('Error: ' + res.data.message);
      }
    } catch (err) {
      console.error('Error saving:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = [...jobs];
    if (editIndex !== null) {
      logAudit('Edit', { old: jobs[editIndex], new: form });
      updated[editIndex] = form;
    } else {
      logAudit('Add', form);
      updated.push(form);
    }
    saveJobs(updated);
    setForm({ code: '', title: '', description: '' });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setForm({ ...jobs[index] });
  };

  const handleDelete = (index) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    logAudit('Delete', jobs[index]);
    const updated = jobs.filter((_, i) => i !== index);
    saveJobs(updated);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(jobs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'updated_jobs.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredJobs = searchBox
    ? jobs.filter((j) => `${j.code} ${j.title}`.toLowerCase().includes(searchBox.toLowerCase()))
    : jobs;

  return (
    <div className="max-w-6xl mx-auto w-full p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-slate-900">Admin Panel — Manage NCO Jobs</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={searchBox}
          onChange={(e) => setSearchBox(e.target.value)}
          placeholder="Search by title or code..."
          className="flex-1 px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
        <Link to="/audit" className="inline-flex items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
          View Audit Logs
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Job Code</label>
          <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
        </div>
        <div className="md:col-span-3">
          <label className="block font-semibold text-slate-700 mb-1">Job Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
        </div>
        <div className="md:col-span-3 flex gap-4">
          <button type="submit" className="bg-primary hover:opacity-90 text-white px-5 py-2 rounded-xl shadow-lg shadow-primary/20 font-semibold transition-opacity">
            Save Job
          </button>
          <button type="button" onClick={() => { setForm({ code: '', title: '', description: '' }); setEditIndex(null); }}
            className="bg-slate-400 hover:bg-slate-500 text-white px-5 py-2 rounded-xl font-semibold">
            Clear
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-2xl border border-slate-200">
        <table className="min-w-full border border-slate-200 bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-slate-200 text-slate-700 sticky top-0 bg-slate-100">Code</th>
              <th className="py-2 px-4 border-b border-slate-200 text-slate-700 sticky top-0 bg-slate-100">Title</th>
              <th className="py-2 px-4 border-b border-slate-200 text-slate-700 sticky top-0 bg-slate-100">Description</th>
              <th className="py-2 px-4 border-b border-slate-200 text-slate-700 sticky top-0 bg-slate-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job, index) => (
              <tr key={job.code + index}>
                <td className="border px-4 py-2">{job.code}</td>
                <td className="border px-4 py-2">{job.title}</td>
                <td className="border px-4 py-2 max-w-xs truncate">{job.description}</td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  <button onClick={() => handleEdit(index)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(index)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <button onClick={handleDownload} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold transition-colors">
          Download Updated JSON
        </button>
      </div>
    </div>
  );
}
