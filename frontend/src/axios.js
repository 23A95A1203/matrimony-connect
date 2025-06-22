// axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://matrimony-connect.onrender.com/',
  withCredentials: true, // required for cookie auth
});

export default api;
