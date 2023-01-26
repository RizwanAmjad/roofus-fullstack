<script setup>
import { ref, computed, watchEffect } from "vue"

import Nav from "./components/Nav.vue"

import Enrollment from "./pages/Enrollment.vue"
import Home from "./pages/Home.vue"
import Login from "./pages/Login.vue"
import OpenHouse from "./pages/OpenHouse.vue"
import Property from "./pages/Property.vue"
import User from "./pages/User.vue"

import { useAuthStore } from "./stores/auth"
import auth from "./auth"

const authStore = useAuthStore()

// check if we are authenticated
const user = auth.user()
if (user) authStore.login(user)

const routes = {
  "/": Home,
  "/login": Login,
  "/enrollment": Enrollment,
  "/open-house": OpenHouse,
  "/property": Property,
  "/user": User,
}

const currentPath = ref(window.location.hash)

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"] || NotFound
})
</script>

<template>
  <Nav class="p-4"></Nav>
  <div class="m-4">
    <component :is="currentView" />
  </div>
</template>
