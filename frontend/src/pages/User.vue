<script setup>
import { reactive, ref, watchEffect } from "vue"

import Input from "../components/Form/Input.vue"
import Submit from "../components/Form/Submit.vue"

import userApi from "../api/user"
import UserItem from "../components/UserItem.vue"
import Pagination from "../components/Pagination.vue"

const userFormState = reactive({ name: { data: "" } })
const paginationState = reactive({
  limit: { data: 5 },
  page: { data: 1 },
  totalPages: 0,
})

const users = ref([])

watchEffect(async () => {
  const response = await userApi.listUser(
    paginationState.limit.data,
    paginationState.page.data
  )

  const { data: resultUsers } = response.data
  if (resultUsers) {
    // update users
    users.value = resultUsers
    // set total pages
    paginationState.totalPages = response.data.totalPages
  }
})

const handleCreateUser = async () => {
  const response = await userApi.createUser({ name: userFormState.name.data })
  const { data: result } = response
  if (response.ok) {
    users.value = [result.data, ...users.value].splice(
      0,
      paginationState.limit.data
    )
    return
  }
  alert(result.error)
}
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
    <Submit class="my-1" :onSubmit="handleCreateUser">Create User</Submit>
  </div>

  <div class="mt-4">
    <UserItem v-for="user in users" :name="user.name" />
  </div>

  <Pagination
    class="my-4"
    :limit="paginationState.limit"
    :page="paginationState.page"
    :totalPages="paginationState.totalPages"
  />
</template>
