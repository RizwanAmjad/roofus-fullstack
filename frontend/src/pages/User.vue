<script setup>
import { reactive, ref, watchEffect } from "vue"

import Input from "../components/Form/Input.vue"
import Submit from "../components/Form/Submit.vue"

import userApi from "../api/user"
import UserItem from "../components/UserItem.vue"

const userFormState = reactive({ name: { data: "" } })
const users = ref([])

watchEffect(async () => {
  const response = await userApi.listUser()

  const { data: resultUsers } = response.data
  if (resultUsers) {
    users.value = resultUsers
  }
})
</script>

<template>
  <h2 class="text-2xl mb-5">Users</h2>

  <div class="w-1/3">
    <Input
      class="my-1"
      type="text"
      label="Name"
      placeholder="Name"
      :value="userFormState.name"
    />
    <Submit class="my-1">Create User</Submit>
  </div>
  <div class="mt-4">
    <UserItem v-for="user in users" :name="user.name" />
  </div>
</template>
