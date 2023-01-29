<script setup>
import { RouterView } from "vue-router"

import Nav from "./components/Nav.vue"

import { useAuthStore } from "./stores/auth"
import auth from "./auth"

const authStore = useAuthStore()

// check if we are authenticated
const user = auth.user()
if (user) authStore.login(user)
</script>

<template>
  <Nav class="p-4"></Nav>
  <div class="m-4">
    <RouterView></RouterView>
  </div>
</template>
