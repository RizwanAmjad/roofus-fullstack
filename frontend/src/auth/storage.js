const AUTH_TOKEN_KEY = "AUTH_TOKEN"

export default {
  saveAuthToken: (token) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  },
  removeAuthToken: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  },
  getUser: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  },
}
