import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL ?? undefined;

// send fingerprint (and token if any) in every request
axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('atlas:token');
    if (token) config.headers.Authorization = token;
    const fingerprint = window.localStorage.getItem('atlas:fingerprint');
    config.headers['x-fingerprint'] = fingerprint;
    return config;
  },
  (error) => Promise.reject(error),
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 503) {
      if (window.location.pathname !== '/maintenance') {
        window.location.href = '/maintenance';
      }
    }
    return Promise.reject(error);
  },
);

export default axios;
