import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { store } from '@/store'
import { logout } from '@/store/slices/auth-slice'

// API基础URL - 使用环境变量或默认值
const API_BASE_URL = 'http://localhost:3000/api'

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒超时
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从Redux store获取token
    const token = store.getState().auth.token
    
    // 如果有token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    // 处理401未授权错误（token过期或无效）
    if (error.response?.status === 401) {
      // 分发登出action
      store.dispatch(logout())
      // 可以在这里添加重定向到登录页面的逻辑
    }
    
    // 处理其他错误
    return Promise.reject(error)
  }
)

// 通用GET请求
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.get(url, config)
    return response.data
  } catch (error) {
    throw error
  }
}

// 通用POST请求
export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.post(url, data, config)
    return response.data
  } catch (error) {
    throw error
  }
}

// 通用PUT请求
export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.put(url, data, config)
    return response.data
  } catch (error) {
    throw error
  }
}

// 通用DELETE请求
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.delete(url, config)
    return response.data
  } catch (error) {
    throw error
  }
}

// 通用PATCH请求
export const patch = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.patch(url, data, config)
    return response.data
  } catch (error) {
    throw error
  }
}

export default apiClient