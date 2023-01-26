import { defineStore } from "pinia"
import auth from "../auth"

export const useAuthStore = defineStore("auth", {
  state: () => {
    return { user: undefined }
  },
  actions: {
    login(user) {
      auth.login(user)
      this.user = user
    },
    logout() {
      this.user = undefined
    },
  },
})
