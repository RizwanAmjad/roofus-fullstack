<script setup>
import { reactive, ref, watchEffect } from "vue"

import SelectMenu from "../components/Form/SelectMenu.vue"
import Submit from "../components/Form/Submit.vue"

import userApi from "../api/user"
import openHouseApi from "../api/openHouse"

const enrollmentFormState = reactive({
  openHouse: { data: undefined },
  user: { data: undefined },
})

const enrollmentUpdateFormState = reactive({
  openHouse: { data: undefined },
  user: { data: undefined },
})

const paginationState = reactive({
  limit: { data: 5 },
  page: { data: 1 },
  totalPages: 0,
})

const openHouses = ref([])
const users = ref([])

const editingId = reactive({ data: undefined })

const formatDate = (date) => new Date(date).toLocaleDateString()

// load users
watchEffect(async () => {
  const response = await userApi.listUser()

  const { data: resultProperties } = response.data
  if (resultProperties) {
    // update properties
    users.value = resultProperties
  }
})

// load openHouse
watchEffect(async () => {
  const response = await openHouseApi.listOpenHouse()

  const { data: resultProperties } = response.data
  if (resultProperties) {
    // update properties
    openHouses.value = resultProperties
  }
})

const handleCreateEnrollment = () => {}
</script>

<template>
  <h2 class="text-2xl mb-5">Enrollment</h2>

  <div class="w-1/3">
    <SelectMenu
      class="my-1"
      label="Open House"
      :options="openHouses"
      :showKey="
        (key) => `${key.property.address} (${formatDate(key.startDate)})`
      "
      :value="enrollmentFormState.openHouse"
    />
    <SelectMenu
      class="my-1"
      label="User"
      :options="users"
      :showKey="(key) => key.name"
      :value="enrollmentFormState.user"
    />

    <Submit class="my-1" :onSubmit="handleCreateEnrollment"
      >Create Enrollment</Submit
    >
  </div>
</template>
