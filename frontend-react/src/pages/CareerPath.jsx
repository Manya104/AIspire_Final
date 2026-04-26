import { useState, useEffect, useRef } from 'react';
import { getCareers, getCareerPath } from '../services/api';

export default function CareerPath() {
  const [allCareers, setAllCareers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const networkRef = useRef(null);
  const visNetworkRef = useRef(null);

  useEffect(() => {
    getCareers()
      .then((res) => setAllCareers(res.data.map((t) => t.title)))
      .catch(() => {});
  }, []);

  const filteredCareers = searchText.trim()
    ? allCareers.filter((c) => c.toLowerCase().includes(searchText.toLowerCase()))
    : allCareers;

  const fetchPath = async () => {
    const q = searchText.trim();
    if (!q) {
      setError('Please type a job keyword.');
      return;
    }
    setError('');
    try {
      const res = await getCareerPath(q);
      if (res.data.error) {
        setError(res.data.error);
        setSummary(null);
        renderNetwork(null);
      } else {
        setSummary(res.data);
        renderNetwork(res.data);
      }
    } catch {
      setError('Something went wrong while loading the career path.');
    }
  };

  const renderNetwork = async (data) => {
    if (!networkRef.current) return;

    const vis = await import('vis-network/standalone');

    if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
      if (visNetworkRef.current) visNetworkRef.current.setData({ nodes: [], edges: [] });
      return;
    }

    const nodes = new vis.DataSet(
      data.nodes.map((node) => ({
        id: node.id,
        label: node.label,
        level: node.level || 1,
        shape: 'box',
        margin: 16,
        font: { size: 16, color: '#0f766e', face: "'Space Grotesk', sans-serif" },
        borderWidth: 2,
        shadow: { enabled: true, color: 'rgba(45,212,191,0.2)', size: 10, x: 0, y: 4 },
        color: {
          border: '#2dd4bf',
          background: '#f0fdfa',
          highlight: { border: '#0f766e', background: '#ccfbf1' },
          hover: { border: '#14b8a6', background: '#e0f2fe' },
        },
      }))
    );

    const edges = new vis.DataSet(
      data.edges.map((e) => ({
        from: e.from,
        to: e.to,
        arrows: { to: { enabled: true, scaleFactor: 0.8 } },
        color: { color: '#94a3b8', highlight: '#2dd4bf', hover: '#2dd4bf' },
        width: 3,
        smooth: { type: 'cubicBezier', forceDirection: 'horizontal', roundness: 0.4 },
      }))
    );

    const options = {
      layout: {
        hierarchical: { enabled: true, direction: 'LR', sortMethod: 'directed', levelSeparation: 220, nodeSpacing: 100 },
      },
      physics: { enabled: false },
      interaction: { hover: true, tooltipDelay: 150, zoomView: true, dragView: true },
    };

    if (!visNetworkRef.current) {
      visNetworkRef.current = new vis.Network(networkRef.current, { nodes, edges }, options);
    } else {
      visNetworkRef.current.setData({ nodes, edges });
      visNetworkRef.current.setOptions(options);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-[1100px] w-full bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-blue">
              Career Progression Paths
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Explore NCO-based next-step roles from your current occupation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {/* Left Panel */}
          <div className="bg-white/95 rounded-xl p-5 border border-slate-200 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Select a starting occupation</h2>
            <div className="relative mb-2">
              <label className="text-sm font-semibold text-slate-500 block mb-1">Search NCO occupation</label>
              <input
                type="text"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setDropdownVisible(true);
                }}
                onFocus={() => setDropdownVisible(true)}
                onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
                onKeyDown={(e) => e.key === 'Enter' && fetchPath()}
                placeholder="Type to search (e.g. Teacher, Nurse)..."
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              />
              {dropdownVisible && filteredCareers.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 max-h-60 overflow-y-auto">
                  {filteredCareers.map((title) => (
                    <li
                      key={title}
                      onMouseDown={() => {
                        setSearchText(title);
                        setDropdownVisible(false);
                        setTimeout(fetchPath, 50);
                      }}
                      className="px-4 py-3 hover:bg-teal-50 hover:text-teal-700 cursor-pointer text-sm font-medium text-slate-700 border-b border-slate-50 last:border-0 transition-colors"
                    >
                      {title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button onClick={fetchPath} className="w-full py-2.5 px-4 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity text-sm">
              View career path
            </button>
            <p className="text-xs text-slate-500 mt-2">
              Uses the NCO 2015 hierarchy and curated progressions to visually map your next steps.
            </p>
            {error && <p className="text-rose-500 font-medium mt-3 text-sm">{error}</p>}
            {summary && (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div className="font-bold text-xl text-primary mb-2">{summary.title}</div>
                {summary.progression && summary.progression.length > 1 && (
                  <>
                    <span className="material-symbols-outlined text-slate-400 my-1">arrow_downward</span>
                    <div className="text-sm font-semibold tracking-wider text-slate-500 uppercase mb-3">Career Progression</div>
                    <div className="flex flex-col items-center">
                      {summary.progression.slice(1).map((step, i) => (
                        <div key={i} className="font-medium text-slate-800 text-lg py-1">{step}</div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Network */}
          <div className="bg-white/95 rounded-xl p-5 border border-slate-200 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Visual progression map</h2>
            <div
              ref={networkRef}
              className="w-full h-[360px] rounded-xl bg-gradient-to-b from-teal-50 to-white border border-slate-200"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
