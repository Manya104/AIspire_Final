import { useState, useEffect, useRef } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { getJobClusters } from '../services/api';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const CLUSTER_COLORS = [
  '#2dd4bf', '#3b82f6', '#ec4899', '#f59e0b', '#10b981',
  '#8b5cf6', '#ef4444', '#06b6d4', '#f97316', '#84cc16',
  '#e879f9', '#14b8a6', '#fb923c', '#a78bfa', '#22d3ee',
];

export default function Clusters() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    getJobClusters()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load cluster data. Make sure the backend is running.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block size-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium">Loading cluster visualization...</p>
          <p className="text-slate-400 text-sm mt-1">Computing t-SNE projection of 3000+ occupations</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  const { points, clusters, total_jobs, n_clusters } = data;

  const filteredPoints = selectedCluster !== null
    ? points.filter((p) => p.cluster === selectedCluster)
    : points;

  const datasets = [];
  for (let cid = 0; cid < n_clusters; cid++) {
    const clusterPoints = filteredPoints.filter((p) => p.cluster === cid);
    if (clusterPoints.length === 0) continue;

    const clusterInfo = clusters.find((c) => c.id === cid);
    datasets.push({
      label: clusterInfo?.name || `Cluster ${cid}`,
      data: clusterPoints.map((p) => ({ x: p.x, y: p.y, title: p.title, code: p.code })),
      backgroundColor: CLUSTER_COLORS[cid % CLUSTER_COLORS.length] + 'CC',
      borderColor: CLUSTER_COLORS[cid % CLUSTER_COLORS.length],
      borderWidth: 1,
      pointRadius: selectedCluster === cid ? 6 : 4,
      pointHoverRadius: 8,
    });
  }

  const chartData = { datasets };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const point = ctx.raw;
            return `${point.title} (${point.code})`;
          },
        },
        backgroundColor: '#0f172a',
        titleFont: { family: 'Space Grotesk' },
        bodyFont: { family: 'Space Grotesk', size: 13 },
        padding: 12,
        cornerRadius: 8,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    animation: {
      duration: 800,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="flex-1 flex flex-col px-4 py-8">
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            NCO Occupation{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-pink">
              Cluster Map
            </span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {total_jobs.toLocaleString()} occupations clustered into {n_clusters} semantic groups using
            K-Means on SBERT embeddings, projected to 2D via t-SNE.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-primary">{total_jobs.toLocaleString()}</p>
            <p className="text-xs text-slate-500 font-medium">Total Occupations</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-accent-blue">{n_clusters}</p>
            <p className="text-xs text-slate-500 font-medium">Clusters Found</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-accent-pink">384-D</p>
            <p className="text-xs text-slate-500 font-medium">Embedding Dimensions</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-slate-800">all-MiniLM-L6</p>
            <p className="text-xs text-slate-500 font-medium">SBERT Model</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Cluster Legend / Filter Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 sticky top-24">
              <h2 className="font-bold text-slate-900 mb-3">Clusters</h2>
              <button
                onClick={() => setSelectedCluster(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium mb-1 transition-colors ${
                  selectedCluster === null
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Show All ({points.length} points)
              </button>
              <div className="max-h-[500px] overflow-y-auto space-y-1 mt-2">
                {clusters
                  .sort((a, b) => b.size - a.size)
                  .map((cluster) => (
                    <button
                      key={cluster.id}
                      onClick={() =>
                        setSelectedCluster(
                          selectedCluster === cluster.id ? null : cluster.id
                        )
                      }
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                        selectedCluster === cluster.id
                          ? 'bg-slate-100 shadow-sm'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="size-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: CLUSTER_COLORS[cluster.id % CLUSTER_COLORS.length] }}
                        ></span>
                        <span className="font-medium text-slate-800 truncate">
                          {cluster.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 ml-5">
                        <span className="text-xs text-slate-400">{cluster.size} jobs</span>
                      </div>
                      {selectedCluster === cluster.id && (
                        <div className="mt-2 ml-5 space-y-0.5">
                          {cluster.sample_jobs.slice(0, 5).map((job, i) => (
                            <p key={i} className="text-xs text-slate-500 truncate">
                              {job}
                            </p>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900">
                  t-SNE Projection
                  {selectedCluster !== null && (
                    <span className="text-sm font-normal text-slate-500 ml-2">
                      (Showing cluster: {clusters.find((c) => c.id === selectedCluster)?.name})
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                  Hover over points to see job details
                </div>
              </div>
              <div className="h-[550px] md:h-[650px]">
                <Scatter data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* ML Pipeline Info */}
            <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
              <h2 className="font-bold text-slate-900 mb-4">ML Pipeline Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <h3 className="font-bold text-primary mb-2">1. Embedding</h3>
                  <p className="text-sm text-slate-600">
                    Each NCO occupation title + description is encoded into a 384-dimensional
                    vector using <strong>all-MiniLM-L6-v2</strong> (Sentence-BERT).
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-accent-blue/5 to-accent-blue/10 border border-accent-blue/20">
                  <h3 className="font-bold text-accent-blue mb-2">2. Clustering</h3>
                  <p className="text-sm text-slate-600">
                    <strong>K-Means</strong> (k=15) groups semantically similar occupations.
                    Jobs in the same cluster share domain, skills, or sector.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-accent-pink/5 to-accent-pink/10 border border-accent-pink/20">
                  <h3 className="font-bold text-accent-pink mb-2">3. Visualization</h3>
                  <p className="text-sm text-slate-600">
                    <strong>t-SNE</strong> reduces 384 dimensions to 2D for plotting.
                    Nearby points = semantically similar occupations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
