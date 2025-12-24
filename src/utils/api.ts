// Environment configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 10000,

  // Auth endpoints
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    logout: "/auth/logout",
    profile: "/auth/profile",
  },

  // User endpoints
  user: {
    base: "/user",
    byId: (id: number) => `/user/${id}`,
  },

  // Health Document endpoints
  healthDocument: {
    base: "/health-document",
    byId: (id: number) => `/health-document/${id}`,
    byUserId: (userId: number) => `/health-document/user/${userId}`,
  },
}

// API Response wrapper type
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

// Common error handling
export const handleApiError = (error: unknown) => {
  if (typeof error === "object" && error !== null) {
    const errObj = error as { data?: { message?: unknown }; message?: unknown }
    if (typeof errObj.data?.message === "string") {
      return errObj.data.message
    }
    if (typeof errObj.message === "string") {
      return errObj.message
    }
  }
  return "Đã xảy ra lỗi không xác định"
}

// Token management
export const tokenManager = {
  getToken: () => localStorage.getItem("access_token"),
  setToken: (token: string) => localStorage.setItem("access_token", token),
  removeToken: () => localStorage.removeItem("access_token"),
  isAuthenticated: () => !!localStorage.getItem("access_token"),
}
