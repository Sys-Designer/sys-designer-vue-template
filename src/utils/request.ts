import { useGlobal, useUser } from '@/store';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { createDiscreteApi } from 'naive-ui'
const { message } = createDiscreteApi(['message']);

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useUser().getToken()
    if (token) {
      config.headers['Authorization'] = ('Bearer ' + token) as any;
    }
    const global =  useGlobal();
    const projectId = global.getProjectId()
    if(projectId){
      config.headers['x-project-id'] = projectId
    }
    return config
  },
  err => Promise.reject(err)
)

// 响应拦截器
service.interceptors.response.use(
  (res: AxiosResponse<any>) => {
    return res
  },
  err => {
    const data = err.response?.data;
    // const code = data?.code;
    const msg = data?.message;
    if(msg){
      message.error(msg)
    }
    return Promise.reject(err)
  }
)

export default service

export const request = {
  service: service,
  onErrorResponse: (_error: AxiosError)=>{
  }
}