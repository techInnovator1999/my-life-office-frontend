/**
 * API Configuration
 * 
 * Axios instance with interceptors for authentication and error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

// Get API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage or sessionStorage (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Try to refresh token
      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken')
        
        if (refreshToken) {
          try {
            const response = await axios.post(
              `${API_BASE_URL}/auth/refresh`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              }
            )

            const { token, refreshToken: newRefreshToken } = response.data

            // Update tokens in the same storage they came from
            const storage = localStorage.getItem('token') ? localStorage : sessionStorage
            storage.setItem('token', token)
            storage.setItem('refreshToken', newRefreshToken)

            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return api(originalRequest)
          } catch (refreshError) {
            // Refresh failed - clear tokens and redirect to login
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('refreshToken')
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            return Promise.reject(refreshError)
          }
        } else {
          // No refresh token - redirect to login
          localStorage.removeItem('token')
          sessionStorage.removeItem('token')
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
      }
    }

    // Handle other errors
    return Promise.reject(error)
  }
)

export default api

