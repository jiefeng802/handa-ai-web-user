import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { DEFAULT_BACKEND_URL } from "../config/CONSTANTS";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL ?? DEFAULT_BACKEND_URL}`,
});

export const useAxios = (): { axiosInstance: AxiosInstance } => {

  axiosInstance.interceptors.request.clear();
  axiosInstance.interceptors.request.use(
    async (value: InternalAxiosRequestConfig) => {
      value.headers["Authorization"] = `Bearer ${process.env.NEXT_PUBLIC_API_KEY ?? ""}`;

      return value;
    },
    (error: AxiosError) => {
      console.error({ error });

      return Promise.reject(error);
    }
  );

  return {
    axiosInstance,
  };
};
