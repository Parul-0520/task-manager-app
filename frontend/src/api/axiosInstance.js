import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'task-manager-app-production-6495.up.railway.app',
})

axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

export default axiosInstance