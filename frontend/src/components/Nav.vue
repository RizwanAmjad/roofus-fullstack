<script setup>
import { RouterLink } from "vue-router"
import { useAuthStore } from "../stores/auth"
import auth from "../auth"

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  auth.logout()
  window.location.hash = "/login"
}
</script>

<template>
  <div class="bg-gray-900 flex font-medium">
    <template v-if="authStore.user">
      <div class="px-4 py-2"><RouterLink to="/">Home</RouterLink></div>
      <div class="px-4 py-2"><RouterLink to="/user">User</RouterLink></div>
      <div class="px-4 py-2">
        <RouterLink to="/property">Property</RouterLink>
      </div>
      <div class="px-4 py-2">
        <RouterLink to="/open-house">Open House</RouterLink>
      </div>
      <div class="px-4 py-2">
        <RouterLink to="/enrollment">Enrollment</RouterLink>
      </div>
      <div class="px-4 py-2 cursor-pointer" @click="handleLogout">Logout</div>
    </template>
    <div class="px-4 py-2" v-else>
      <RouterLink to="/login">Login</RouterLink>
    </div>
  </div>
</template>
