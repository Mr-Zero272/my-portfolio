import { env } from '@/config/env';
import axios from 'axios';

const baseUrl = typeof window !== 'undefined' ? '/api' : `${env.SITE_URL}/api`;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // proxy will handle all logic of token
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default axiosInstance;
