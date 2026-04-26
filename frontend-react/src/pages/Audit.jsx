import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAuditLogs } from '../services/api';

export default function Audit() {
  const { isAdmin } = useAuth();
  const [logs, setLogs] = useState([]);
  const [searchCategory, setSearchCategory] = useState('device');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAdmin) {
      getAuditLogs()
        .then((res) => setLogs(res.data))
        .catch((err) => console.error('Error loading audit logs:', err));
    }
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/login" />;

  const filtered = searchTerm
    ? logs.filter((log) => String(log[searchCategory]).toLowerCase().includes(searchTerm.toLowerCase()))
    : logs;

  return (
    <div className="max-w-6xl mx-auto w-full p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-slate-900">Audit Report</h1>

      <div className="flex gap-4 mb-4 flex-wrap">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="border border-slate-300 px-3 py-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        >
          <option value="device">Device</option>
          <option value="action">Action</option>
          <option value="time">Time</option>
        </select>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="flex-1 min-w-[200px] px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
      </div>

      <div className="overflow-x-auto shadow rounded-2xl border border-slate-200">
        <table className="min-w-full border border-slate-200 bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-slate-200 text-slate-700 sticky top-0 bg-slate-100">Device</th>
              <th className="py-2 px-4 border-b border-slate-200 text-slate-700 sticky top-0 bg-slate-100">Action</th>
              <th className="py-2 px-4 border-b border-slate-200 text-slate-700 sticky top-0 bg-slate-100">Time</th>
              <th className="py-2 px-4 border-b border-slate-200 text-slate-700 sticky top-0 bg-slate-100">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log, i) => (
              <tr key={i}>
                <td className="border border-slate-200 px-4 py-2 text-sm">{log.device}</td>
                <td className="border border-slate-200 px-4 py-2 text-sm">{log.action}</td>
                <td className="border border-slate-200 px-4 py-2 text-sm">{log.time}</td>
                <td className="border border-slate-200 px-4 py-2">
                  <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(log.details, null, 2)}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
