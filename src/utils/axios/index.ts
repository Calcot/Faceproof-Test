import axios, { AxiosRequestConfig } from "axios";

// Default config options
const defaultOptions = {
  baseURL: import.meta.env.VITE_BASE_URL,
};

// Update instance
export const instance = axios.create(defaultOptions);

// Set the AUTH token for any request
instance.interceptors.request.use(
  (config: any) => {
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
);
// Add a response interceptor

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    "use client";
    // Do something with response error
    return Promise.reject(error.response);
  },
);

export type RequestConfig = AxiosRequestConfig<any> & {
  key: string;
  isUnprotected?: boolean;
  onFinish?: (response: any) => void;
};

export const createApiRequest = (config: RequestConfig) =>
  instance(config as AxiosRequestConfig);

export const createConfig = (config: RequestConfig): RequestConfig => {
  return config;
};

export default createApiRequest;

export { instance as AxiosInstance };
