import axios, { AxiosRequestConfig } from 'axios';

export const fetcher = (url: string, options?: AxiosRequestConfig) =>
  axios(url, { ...options, withCredentials: true }).then((res) => res.data);
