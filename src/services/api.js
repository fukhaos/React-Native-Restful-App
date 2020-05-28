import axios from 'axios';

const api = axios.create({
  baseURL: 'https://serene-ridge-44875.herokuapp.com/'
});

export default api;
