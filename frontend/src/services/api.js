import axios from 'axios'
import { getUser } from '../utils/auth'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/siswa-app/backend/public'

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor request — tambahkan X-Auth-Token dari localStorage
// agar backend bisa auth meski session PHP tidak persist (CORS cookie issue)
api.interceptors.request.use((config) => {
  const user = getUser()
  if (user) {
    config.headers['X-Auth-Token'] = btoa(JSON.stringify(user))
  }
  return config
})

// Interceptor response — hanya log error, TIDAK redirect otomatis
// AuthContext dan PrivateRoute yang bertanggung jawab atas redirect
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const url    = err.config?.url || ''
    console.warn(`[API] Error ${status} pada ${url}`, err.response?.data?.message || '')
    return Promise.reject(err)
  }
)

export const authAPI = {
  login:  (data) => api.post('/auth', { ...data, action: 'login' }),
  logout: ()     => api.post('/auth', { action: 'logout' }),
  me:     ()     => api.get('/auth'),
}

export const dashboardAPI = {
  get: () => api.get('/dashboard'),
}

export const siswaAPI = {
  getAll:  (params)     => api.get('/siswa', { params }),
  getOne:  (id)         => api.get(`/siswa/${id}`),
  create:  (data)       => api.post('/siswa', data),
  update:  (id, data)   => api.put(`/siswa/${id}`, data),
  delete:  (id)         => api.delete(`/siswa/${id}`),
}

export const kelasAPI = {
  getAll:  ()           => api.get('/kelas'),
  create:  (data)       => api.post('/kelas', data),
  update:  (id, data)   => api.put(`/kelas/${id}`, data),
  delete:  (id)         => api.delete(`/kelas/${id}`),
}

export const jurusanAPI = {
  getAll:  ()           => api.get('/jurusan'),
  create:  (data)       => api.post('/jurusan', data),
  update:  (id, data)   => api.put(`/jurusan/${id}`, data),
  delete:  (id)         => api.delete(`/jurusan/${id}`),
}

export const tahunAjaranAPI = {
  getAll:  ()           => api.get('/tahun-ajaran'),
  create:  (data)       => api.post('/tahun-ajaran', data),
  update:  (id, data)   => api.put(`/tahun-ajaran/${id}`, data),
  delete:  (id)         => api.delete(`/tahun-ajaran/${id}`),
}

export const usersAPI = {
  getAll:        ()         => api.get('/users'),
  create:        (data)     => api.post('/users', data),
  update:        (id, data) => api.put(`/users/${id}`, data),
  delete:        (id)       => api.delete(`/users/${id}`),
  updateProfile: (id, data) => api.put(`/users/${id}/profile`, data),
}

export const activityAPI = {
  getAll: (params) => api.get('/activity-logs', { params }),
}

export const uploadAPI = {
  foto: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

/**
 * Export API — menggunakan window.open() agar browser langsung download file.
 * Session PHP tidak bisa dikirim via window.open(), jadi user data dikirim
 * via query param _user (sudah divalidasi di BaseController::requireAuth()).
 */
export const exportAPI = {
  csv: (params = {}) => {
    const user = getUser()
    const query = new URLSearchParams({
      ...params,
      _user: user ? encodeURIComponent(JSON.stringify(user)) : '',
    }).toString()
    window.open(`${BASE_URL}/export/csv?${query}`, '_blank')
  },
  pdf: (params = {}) => {
    const user = getUser()
    const query = new URLSearchParams({
      ...params,
      _user: user ? encodeURIComponent(JSON.stringify(user)) : '',
    }).toString()
    window.open(`${BASE_URL}/export/pdf?${query}`, '_blank')
  },
}

export const importAPI = {
  csv: (formData) => api.post('/import/csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

export default api
