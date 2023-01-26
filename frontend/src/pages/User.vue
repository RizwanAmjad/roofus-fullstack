<script setup>
import { reactive, ref, watchEffect } from "vue"

import Input from "../components/Form/Input.vue"
import Submit from "../components/Form/Submit.vue"

import userApi from "../api/user"
import UserItem from "../components/UserItem.vue"
import Pagination from "../components/Pagination.vue"
import Modal from "../components/Modal.vue"

const userFormState = reactive({ name: { data: "" } })
const userUpdateFormState = reactive({ name: { data: "" } })
const paginationState = reactive({
  limit: { data: 5 },
  page: { data: 1 },
  totalPages: 0,
})

const users = ref([])
const editingId = reactive({ data: undefined })

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

const handleDelete = async (id) => {
  const response = await userApi.deleteUser(id)
  const { data: result } = response
  if (response.ok) {
    users.value = users.value.filter(({ _id }) => _id !== result.data._id)
    return
  }
}

const handleOpenUpdate = (id) => {
  editingId.data = id
  const user = users.value.find((user) => user._id === id)

  userUpdateFormState.name.data = user.name
}

const handleUpdate = async () => {
  const user = users.value.find((user) => user._id === editingId.data)
  // update in backend
  await userApi.updateUser(editingId.data, {
    name: userUpdateFormState.name.data,
  })
  // update in UI
  users.value = users.value.map((user) =>
    user._id === editingId.data
      ? { ...user, name: userUpdateFormState.name.data }
      : user
  )

  // close the modal
  editingId.data = undefined
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
    <UserItem
      v-for="user in users"
      :name="user.name"
      :onDelete="() => handleDelete(user._id)"
      :onUpdate="() => handleOpenUpdate(user._id)"
    />
  </div>

  <Pagination
    class="my-4"
    :limit="paginationState.limit"
    :page="paginationState.page"
    :totalPages="paginationState.totalPages"
  />

  <Modal :shown="editingId">
    <div class="w-2/3 m-auto">
      <Input
        class="my-1"
        type="text"
        label="Name"
        placeholder="Name"
        :value="userUpdateFormState.name"
      />
      <Submit class="my-1" :onSubmit="() => handleUpdate()">Update User</Submit>
    </div>
  </Modal>
</template>
