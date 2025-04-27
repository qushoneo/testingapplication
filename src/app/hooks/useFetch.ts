import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';

type UseFetchOptions = {
  revalidateOnFocus?: boolean;
  revalidateOnMount?: boolean;
  revalidateOnReconnect?: boolean;
  refreshInterval?: number;
  shouldRetryOnError?: boolean;
};

export function useFetch(url: string, options: UseFetchOptions = {}) {
  const { data, error, isLoading, mutate } = useSWR(`/api/${url}`, fetcher, {
    revalidateOnFocus: true,
    ...options,
  });

  console.log(error);

  return {
    data: data,
    error,
    isLoading,
    mutate,
  };
}
