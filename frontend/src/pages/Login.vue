<script setup>
import { reactive } from "vue"

import Input from "../components/Form/Input.vue"
import Submit from "../components/Form/Submit.vue"

const loginState = reactive({ email: { data: "" }, password: { data: "" } })

const handleSubmit = () => {}
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
    <Submit :onSubmit="handleSubmit">Submit</Submit>
  </div>
</template>
