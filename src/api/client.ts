import axios from 'axios';

/** Shared Axios instance with baseline error normalization. */
export const apiClient = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
  timeout: 10000,
});

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const message: string =
      error?.response?.data?.error ??
      error?.message ??
      'Unexpected network error';
    return Promise.reject(new Error(message));
  }
);