<script setup>
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
      <div class="px-4 py-2"><a href="#/">Home</a></div>
      <div class="px-4 py-2"><a href="#/user">User</a></div>
      <div class="px-4 py-2"><a href="#/property">Property</a></div>
      <div class="px-4 py-2"><a href="#/open-house">Open House</a></div>
      <div class="px-4 py-2"><a href="#/enrollment">Enrollment</a></div>
      <div class="px-4 py-2 cursor-pointer" @click="handleLogout">Logout</div>
    </template>
    <div class="px-4 py-2" v-else>
      <a href="#/login">Login</a>
    </div>
  </div>
</template>
