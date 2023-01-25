<script setup>
import Input from "../components/Form/Input.vue"
import Submit from "../components/Form/Submit.vue"
</script>

<template>
  <div class="mx-auto w-1/3">
    <Input class="my-1" label="Email" type="email" placeholder="Email" />
    <Input
      class="my-1"
      label="Password"
      type="password"
      placeholder="Password"
    />
    <Submit>Submit</Submit>
  </div>
</template>
