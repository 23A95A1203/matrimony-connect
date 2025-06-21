import axios from 'axios';

// Automatically picks live backend URL if provided in .env
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

export default API;
