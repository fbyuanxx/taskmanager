import axios from 'axios';

const axiosInstance = axios.create({
  // Use the current origin. In production, Nginx proxies /api to Express.
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
