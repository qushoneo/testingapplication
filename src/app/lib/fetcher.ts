import axios, { AxiosRequestConfig } from 'axios';

export const fetcher = (url: string, options: AxiosRequestConfig) =>
  axios(url, options).then((res) => res.data);
