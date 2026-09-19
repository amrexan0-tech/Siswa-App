// src/utils/auth.js
// Utilitas auth berbasis localStorage — sumber kebenaran utama

const STORAGE_KEY = 'educore_user'

/**
 * Ambil user dari localStorage (parsed).
 * Return null jika tidak ada atau JSON invalid.
 */
export const getUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Cek apakah user sudah login (berdasarkan localStorage).
 */
export const isAuthenticated = () => {
  return !!getUser()
}

/**
 * Simpan user ke localStorage.
 */
export const setStoredUser = (user) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } catch {
    // silent
  }
}

/**
 * Hapus user dari localStorage (logout).
 */
export const clearStoredUser = () => {
  localStorage.removeItem(STORAGE_KEY)
}

export { STORAGE_KEY }
