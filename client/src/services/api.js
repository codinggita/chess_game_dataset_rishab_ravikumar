/* ── API Client ──
   Axios instance with full interceptor strategy per PRD §8.
   - Request: attach Bearer token from localStorage
   - Response 401: refresh token + retry once
   - Response 5xx: retry GET/PUT/PATCH/DELETE once with 1s backoff
   - network error: retry once
*/

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/* ── Request interceptor: attach auth token ── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* ── Response interceptor: 401 refresh + 5xx retry ── */
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;

    /* Don't retry if already retried or no config */
    if (!config || config._retry) {
      return Promise.reject(error);
    }

    /* ── 401 Unauthorized → try refresh token ── */
    if (error.response?.status === 401) {
      config._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        const newToken = data.data?.accessToken || data.data?.token;

        if (newToken) {
          localStorage.setItem('token', newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
          return api(config);
        }
        throw new Error('No token in refresh response');
      } catch {
        /* Refresh failed → clear auth and redirect to login */
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    /* ── 5xx or network error → retry once (idempotent methods only) ── */
    if (
      (error.response?.status >= 500 || !error.response) &&
      ['get', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())
    ) {
      config._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return api(config);
    }

    return Promise.reject(error);
  },
);

export default api;
