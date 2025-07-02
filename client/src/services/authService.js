// services/authService.js
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const authService = {
  async login(credentials) {
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    })
    return response.json()
  },

  async register(userData) {
    const response = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    })
    return response.json()
  },

  async getUserCount() {
    const response = await fetch('/api/users/count')
    return response.json()
  }
}