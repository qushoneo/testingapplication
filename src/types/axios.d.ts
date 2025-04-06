import 'axios';

interface AxiosErrorResponse {
  data: Array<{
    message: string;
    field: string;
  }>;
}

declare module 'axios' {
  export interface AxiosError<T = AxiosErrorResponse> extends Error {
    response: AxiosResponse<T>;
  }
}
