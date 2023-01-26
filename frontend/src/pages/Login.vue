<script setup>
import { reactive } from "vue"

import Input from "../components/Form/Input.vue"
import Submit from "../components/Form/Submit.vue"

import adminApi from "../api/admin"

import { useAuthStore } from "../stores/auth"

const authStore = useAuthStore()
const loginState = reactive({ email: { data: "" }, password: { data: "" } })

if (authStore.user) window.location.hash = "/"

const handleLogin = async () => {
  const result = await adminApi.adminAuth({
    email: loginState.email.data,
    password: loginState.password.data,
  })

  const { data: response } = result

  if (result.ok) {
    authStore.login(response.data)
    window.location.hash = "/"
    return
  }

  return alert(response.error)
}
</script>

<template>
  <div class="mx-auto w-1/3">
    <Input
      class="my-1"
      label="Email"
      type="email"
      placeholder="Email"
      :value="loginState.email"
    />
    <Input
      class="my-1"
      label="Password"
      type="password"
      placeholder="Password"
      :value="loginState.password"
    />
    <Submit :onSubmit="handleLogin">Submit</Submit>
  </div>
</template>
