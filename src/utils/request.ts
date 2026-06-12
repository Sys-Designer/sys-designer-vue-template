import { useGlobal, useUser } from '@/store';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

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
// service.interceptors.response.use(
//   (res: AxiosResponse<any>) => {
//     // const { code, message } = res.data
//     // 业务状态码统一处理
//     // if (code !== 200) {
//     //   $message.error(message || '接口请求失败')
//     //   // 401 token过期
//     //   if (code === 401) {
//     //     removeToken()
//     //     location.reload()
//     //   }
//     //   return Promise.reject(res.data)
//     // }
//     return res.data
//   },
//   err => {
//     // const msg = err.response?.data?.message || '服务器异常'
//     // $notification.error({ title: '请求错误', content: msg })
//     return Promise.reject(err)
//   }
// )

export default service

export const request = {
  service: service,
  onErrorResponse: (error: AxiosError)=>{
    console.log(error)
  }
}