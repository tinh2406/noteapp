export const URL_BASE = "http://nguyeqoctih.id.vn:10002";
// export const URL_BASE = "http://192.168.156.242:10002";

import axiosDefault, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { useState } from "react";

import Toast from "react-native-toast-message";

export class Axios {
  _axios = axiosDefault.create({
    baseURL: URL_BASE,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  post = async <RESPONSE, INPUT>(
    url: string,
    data?: INPUT,
    config?: AxiosRequestConfig<INPUT>
  ) => {
    try {
      const res = await this._axios.post<
        RESPONSE,
        AxiosResponse<RESPONSE>,
        INPUT
      >(url, data, config);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      Toast.show({
        type: "error",
        text1: "Error " + err.response?.status,
        text2: `${err.response?.data}`,
      });
      throw err;
    }
  };

  put = async <RESPONSE, INPUT>(
    url: string,
    data?: INPUT,
    config?: AxiosRequestConfig<INPUT>
  ) => {
    try {
      const res = await this._axios.put<
        RESPONSE,
        AxiosResponse<RESPONSE>,
        INPUT
      >(url, data, config);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      Toast.show({
        type: "error",
        text1: "Error " + err.response?.status,
        text2: `${err.response?.data}`,
      });
      throw err;
    }
  };

  patch = async <RESPONSE, INPUT>(
    url: string,
    data?: INPUT,
    config?: AxiosRequestConfig<INPUT>
  ) => {
    try {
      const res = await this._axios.patch<
        RESPONSE,
        AxiosResponse<RESPONSE>,
        INPUT
      >(url, data, config);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      Toast.show({
        type: "error",
        text1: "Error " + err.response?.status,
        text2: `${err.response?.data}`,
      });
      throw err;
    }
  };

  delete = async <RESPONSE, INPUT>(
    url: string,
    config?: AxiosRequestConfig<INPUT>
  ) => {
    try {
      const res = await this._axios.delete<
        RESPONSE,
        AxiosResponse<RESPONSE>,
        INPUT
      >(url, config);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      Toast.show({
        type: "error",
        text1: "Error " + err.response?.status,
        text2: `${err.response?.data}`,
      });
      throw err;
    }
  };

  get = async <RESPONSE, INPUT = any>(
    url: string,
    config?: AxiosRequestConfig<INPUT>
  ) => {
    try {
      const res = await this._axios.get<
        RESPONSE,
        AxiosResponse<RESPONSE>,
        INPUT
      >(url, config);
      return res.data;
    } catch (error) {
      console.log(JSON.stringify(error));
      
      const err = error as AxiosError;
      console.log(JSON.stringify(Object.keys(err)));

      Toast.show({
        type: "error",
        text1: "Error " + err.response?.status,
        text2: `${err.response?.data}`,
      });
      throw err;
    }
  };
}

const axios = new Axios();

export const useMutation = function <RESPONSE, INPUT>({
  fn: callback,
  onSuccess,
  onError,
}: {
  fn: (data: INPUT) => Promise<RESPONSE>;
  onSuccess?: (data: RESPONSE) => void;
  onError?: (error: AxiosError) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<RESPONSE | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);

  const mutate = async (data: INPUT) => {
    setIsLoading(true);
    try {
      const res = await callback(data);
      setData(res);
      if (onSuccess) {
        onSuccess(res);
      }
    } catch (error) {
      setError(error as AxiosError);
      if (onError) {
        onError(error as AxiosError);
      }
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    data,
    error,
    mutate,
  };
};

export default axios;
