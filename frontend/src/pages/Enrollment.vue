<script setup>
import { reactive, ref, watchEffect } from "vue"

import EnrollmentItem from "../components/EnrollmentItem.vue"
import Modal from "../components/Modal.vue"
import Pagination from "../components/Pagination.vue"
import SelectMenu from "../components/Form/SelectMenu.vue"
import TableHeader from "../components/TableHeader.vue"
import Submit from "../components/Form/Submit.vue"

import enrollmentApi from "../api/enrollment"
import openHouseApi from "../api/openHouse"
import userApi from "../api/user"

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

const enrollments = ref([])
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

// load openHouses
watchEffect(async () => {
  const response = await openHouseApi.listOpenHouse()

  const { data: resultOpenHouses } = response.data
  if (resultOpenHouses) {
    // update properties
    openHouses.value = resultOpenHouses
  }
})

// load enrollments

const loadEnrollments = async () => {
  const response = await enrollmentApi.listEnrollments(
    paginationState.limit.data,
    paginationState.page.data
  )

  const { data: resultEnrollments } = response.data
  if (resultEnrollments) {
    // update enrollments
    enrollments.value = resultEnrollments
    // update total pages in UI
    paginationState.totalPages = response.data.totalPages
  }
}
// load enrollments
watchEffect(loadEnrollments)

const handleCreateEnrollment = async () => {
  const response = await enrollmentApi.createEnrollment({
    openHouse: enrollmentFormState.openHouse.data,
    user: enrollmentFormState.user.data,
  })
  const { data: result } = response
  if (response.ok) {
    return await loadEnrollments()
  }
  alert(result.error)
}

const handleDelete = async (id) => {
  const sureToDelete = confirm("Are you sure to delete Enrollment?")
  if (!sureToDelete) return

  const response = await enrollmentApi.deleteEnrollment(id)
  const { data: result } = response
  if (response.ok) {
    enrollments.value = enrollments.value.filter(
      ({ _id }) => _id !== result.data._id
    )
    return
  }
}

const handleOpenUpdate = (id) => {
  editingId.data = id
  const enrollment = enrollments.value.find(
    (enrollment) => enrollment._id === id
  )

  enrollmentUpdateFormState.openHouse.data = enrollment.openHouse._id
  enrollmentUpdateFormState.user.data = enrollment.user._id
}

const handleUpdate = async () => {
  const updates = {
    openHouse: enrollmentUpdateFormState.openHouse.data,
    user: enrollmentUpdateFormState.user.data,
  }
  // update in backend
  const response = await enrollmentApi.updateEnrollments(
    editingId.data,
    updates
  )
  // update in UI
  const { data: result } = response
  if (response.ok) {
    await loadEnrollments()
  } else {
    alert(result.error)
  }

  // close the modal
  editingId.data = undefined
}
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
  <div class="mt-4">
    <TableHeader :headers="['Property', 'User', 'Date']" />
    <EnrollmentItem
      v-for="enrollment in enrollments"
      :property="enrollment.openHouse.property"
      :date="formatDate(enrollment.date)"
      :user="enrollment.user.name"
      :onDelete="() => handleDelete(enrollment._id)"
      :onUpdate="() => handleOpenUpdate(enrollment._id)"
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
      <SelectMenu
        class="my-1"
        label="Open House"
        :options="openHouses"
        :showKey="
          (key) => `${key.property.address} (${formatDate(key.startDate)})`
        "
        :value="enrollmentUpdateFormState.openHouse"
      />
      <SelectMenu
        class="my-1"
        label="User"
        :options="users"
        :showKey="(key) => key.name"
        :value="enrollmentUpdateFormState.user"
      />

      <Submit class="my-1" :onSubmit="handleUpdate">Update Enrollment</Submit>
    </div>
  </Modal>
</template>
