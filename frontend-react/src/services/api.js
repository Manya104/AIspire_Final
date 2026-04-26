import axios from 'axios';

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const searchJobs = (query, lang = 'en') =>
  api.get('/search', { params: { query, lang } });

export const getCareers = () =>
  api.get('/api/careers');

export const getCareerPath = (job) =>
  api.get('/career-path', { params: { job } });

export const getEmbeddings = () =>
  api.get('/get_embeddings');

export const updateEmbeddings = (data) =>
  api.post('/update_embeddings', { data });

export const logAudit = (action, details) =>
  api.post('/log_audit', {
    device: navigator.userAgent,
    action,
    details,
  });

export const getAuditLogs = () =>
  api.get('/get_audit_logs');

export const login = (username, password) =>
  api.post('/auth/login', { username, password });

export const getJobClusters = () =>
  api.get('/api/clusters');

export const getIntentAnalysis = (query) =>
  api.get('/api/intent', { params: { query } });

export default api;
