import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios"
import axios from "axios"

// Base API configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding auth token, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or elsewhere
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  },
)

// Generic type for API responses
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

// Generic API methods with TypeScript
export const api = {
  // GET request with query params
  async get<T>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.get(url, {
      params,
      ...config,
    })
    return response.data.data
  },

  // POST request with body
  async post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.post(url, data, config)
    return response.data.data
  },

  // PUT request
  async put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.put(url, data, config)
    return response.data.data
  },

  // PATCH request
  async patch<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.patch(url, data, config)
    return response.data.data
  },

  // DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.delete(url, config)
    return response.data.data
  },

  // Upload files with multipart/form-data
  async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    })
    return response.data.data
  },

  // Download files
  async download(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<Blob> {
    const response = await apiClient.get(url, {
      params,
      responseType: "blob",
      ...config,
    })
    return response.data
  },
}


export function createApiService<T>(endpoint: string) {
  return {
    getAll: (params?: Record<string, any>) => api.get<T[]>(endpoint, params),
    getById: (id: string) => api.get<T>(`${endpoint}/${id}`),
    create: (data: Omit<T, "id">) => api.post<T, Omit<T, "id">>(endpoint, data),
    update: (id: string, data: Partial<T>) => api.put<T, Partial<T>>(`${endpoint}/${id}`, data),
    patch: (id: string, data: Partial<T>) => api.patch<T, Partial<T>>(`${endpoint}/${id}`, data),
    remove: (id: string) => api.delete<void>(`${endpoint}/${id}`),
    upload: (formData: FormData, subPath: string = "upload") =>
      api.upload<T>(`${endpoint}/${subPath}`, formData),
    download: (params?: Record<string, any>, subPath: string = "download") =>
      api.download(`${endpoint}/${subPath}`, params),
  };
}
