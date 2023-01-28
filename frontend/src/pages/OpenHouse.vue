<script setup>
import { reactive, ref, watchEffect } from "vue"

import Input from "../components/Form/Input.vue"
import Modal from "../components/Modal.vue"
import OpenHouseItem from "../components/OpenHouseItem.vue"
import Pagination from "../components/Pagination.vue"
import SelectMenu from "../components/Form/SelectMenu.vue"
import Submit from "../components/Form/Submit.vue"
import TableHeader from "../components/TableHeader.vue"

import openHouseApi from "../api/openHouse"
import propertyApi from "../api/property"

const openHouseFormState = reactive({
  property: { data: "" },
  visitorAmount: { data: undefined },
  startDate: { data: undefined },
  endDate: { data: undefined },
})

const openHouseUpdateFormState = reactive({
  property: { data: "" },
  visitorAmount: { data: undefined },
  startDate: { data: undefined },
  endDate: { data: undefined },
})

const paginationState = reactive({
  limit: { data: 5 },
  page: { data: 1 },
  totalPages: 0,
})

const openHouses = ref([])
const properties = ref([])
const editingId = reactive({ data: undefined })

// load properties
watchEffect(async () => {
  const response = await propertyApi.listProperties()

  const { data: resultProperties } = response.data
  if (resultProperties) {
    // update properties
    properties.value = resultProperties
  }
})

// load open house
watchEffect(async () => {
  const response = await openHouseApi.listOpenHouse(
    paginationState.limit.data,
    paginationState.page.data
  )

  const { data: resultOpenHouses } = response.data
  if (resultOpenHouses) {
    // update properties
    openHouses.value = resultOpenHouses
    // set total pages
    paginationState.totalPages = response.data.totalPages
  }
})

const formatDate = (date) => new Date(date).toLocaleDateString()
const formatDateForHtml = (date) =>
  formatDate(date).replaceAll("/", "-").split("-").reverse().join("-")

const handleCreateOpenHouse = async () => {
  const response = await openHouseApi.createOpenHouse({
    property: openHouseFormState.property.data,
    visitorAmount: openHouseFormState.visitorAmount.data,
    startDate: openHouseFormState.startDate.data,
    endDate: openHouseFormState.endDate.data,
  })

  const { data: result } = response

  if (response.ok) {
    openHouses.value = [result.data, ...openHouses.value].splice(
      0,
      paginationState.limit.data
    )
    return
  }
  alert(result.error)
}

// delete open house
const handleDelete = async (id) => {
  const sureToDelete = confirm("Are you sure to delete Open House?")
  if (!sureToDelete) return

  const response = await openHouseApi.deleteOpenHouse(id)
  const { data: result } = response
  if (response.ok) {
    openHouses.value = openHouses.value.filter(
      ({ _id }) => _id !== result.data._id
    )
    return
  }
}

const handleOpenUpdate = (id) => {
  editingId.data = id
  const openHouse = openHouses.value.find((openHouse) => openHouse._id === id)

  openHouseUpdateFormState.property.data = openHouse.property._id
    ? openHouse.property._id
    : openHouse.property
  openHouseUpdateFormState.visitorAmount.data = openHouse.visitorAmount
  openHouseUpdateFormState.startDate.data = formatDateForHtml(
    openHouse.startDate
  )
  openHouseUpdateFormState.endDate.data = formatDateForHtml(openHouse.endDate)
}

const handleUpdate = async () => {
  const updates = {
    property: openHouseUpdateFormState.property.data,
    visitorAmount: openHouseUpdateFormState.visitorAmount.data,
    startDate: openHouseUpdateFormState.startDate.data,
    endDate: openHouseUpdateFormState.endDate.data,
  }
  // update in backend
  const response = await openHouseApi.updateOpenHouse(editingId.data, updates)

  // update in UI
  const { data: result } = response
  if (response.ok) {
    openHouses.value = openHouses.value.map((openHouse) =>
      openHouse._id === editingId.data
        ? { ...openHouse, ...updates }
        : openHouse
    )
  } else {
    alert(result.error)
  }

  // close the modal
  editingId.data = undefined
}
</script>

<template>
  <h2 class="text-2xl mb-5">Open House</h2>

  <div class="w-1/3">
    <SelectMenu
      label="Property"
      :options="properties"
      :showKey="(key) => key.address"
      :value="openHouseFormState.property"
    />
    <Input
      class="my-1"
      type="number"
      label="Visitor Amount"
      min="0"
      placeholder="Visitor Amount"
      :value="openHouseFormState.visitorAmount"
    />

    <Input
      class="my-1"
      type="date"
      label="Start Date"
      :min="new Date().toISOString().split('T')[0]"
      placeholder="Start Date"
      :value="openHouseFormState.startDate"
    />
    <Input
      class="my-1"
      type="date"
      label="End Date"
      :min="openHouseFormState.startDate.data"
      placeholder="End Date"
      :value="openHouseFormState.endDate"
    />

    <Submit class="my-1" :onSubmit="handleCreateOpenHouse"
      >Create Open House</Submit
    >
  </div>

  <div class="mt-4">
    <TableHeader
      :headers="['Property', 'Visitor Amount', 'Start Date', 'End Date']"
    />
    <OpenHouseItem
      v-for="openHouse in openHouses"
      :endDate="formatDate(openHouse.endDate)"
      :property="
        openHouse.property._id ? openHouse.property._id : openHouse.property
      "
      :startDate="formatDate(openHouse.startDate)"
      :visitorAmount="openHouse.visitorAmount"
      :onDelete="() => handleDelete(openHouse._id)"
      :onUpdate="() => handleOpenUpdate(openHouse._id)"
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
        label="Property"
        :options="properties"
        :showKey="(key) => key.address"
        :value="openHouseUpdateFormState.property"
      />
      <Input
        class="my-1"
        type="number"
        label="Visitor Amount"
        min="0"
        placeholder="Visitor Amount"
        :value="openHouseUpdateFormState.visitorAmount"
      />

      <Input
        class="my-1"
        type="date"
        label="Start Date"
        :min="new Date().toISOString().split('T')[0]"
        placeholder="Start Date"
        :value="openHouseUpdateFormState.startDate"
      />
      <Input
        class="my-1"
        type="date"
        label="End Date"
        :min="openHouseUpdateFormState.startDate.data"
        placeholder="End Date"
        :value="openHouseUpdateFormState.endDate"
      />

      <Submit class="my-1" :onSubmit="handleUpdate">Update Open House</Submit>
    </div>
  </Modal>
</template>
