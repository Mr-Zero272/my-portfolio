import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `/api`,
  withCredentials: true, // proxy will handle all logic of token
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default axiosInstance;
