import axios, { AxiosRequestConfig } from 'axios'

type CreateAxiosOptions ={
  baseUrl: string;
} & AxiosRequestConfig;

const options: CreateAxiosOptions = {
  baseUrl: '/',
}

// 创建axios请求实例
const resultInstance = axios.create(options);

// 请求拦截
resultInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// 响应拦截
resultInstance.interceptors.response.use(
  (response) => {
    if (response?.status === 200) {
      return response?.data;
    } else {
      return {
        code: -1,
        msg: '未知错误',
        data: null,
      };
    }
  },
  (error) => Promise.reject(error)
);

export default resultInstance;
