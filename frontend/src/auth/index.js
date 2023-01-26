import storage from "./storage"

export default {
  login: (token) => {
    storage.saveAuthToken(token)
  },
  logout: () => {
    storage.removeAuthToken()
  },
  user: () => {
    return storage.getUser()
  },
}
