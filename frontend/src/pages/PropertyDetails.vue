<script setup>
import { reactive, ref, watchEffect } from "vue"
import { useRoute } from "vue-router"

import Input from "../components/Form/Input.vue"
import Modal from "../components/Modal.vue"
import OpenHouseItem from "../components/OpenHouseItem.vue"
import Pagination from "../components/Pagination.vue"
import SelectMenu from "../components/Form/SelectMenu.vue"
import Submit from "../components/Form/Submit.vue"
import TableHeader from "../components/TableHeader.vue"

import openHouseApi from "../api/openHouse"
import propertyApi from "../api/property"

const { params } = useRoute()

const openHouses = ref([])
const property = ref()
const properties = ref()
const editingId = reactive({ data: undefined })

const paginationState = reactive({
  limit: { data: 5 },
  page: { data: 1 },
  totalPages: 0,
})

const openHouseUpdateFormState = reactive({
  property: { data: "" },
  visitorAmount: { data: undefined },
  startDate: { data: undefined },
  endDate: { data: undefined },
})

const formatDate = (date) => new Date(date).toLocaleDateString()
const formatDateForHtml = (date) =>
  formatDate(date).replaceAll("/", "-").split("-").reverse().join("-")

// load properties
watchEffect(async () => {
  const response = await propertyApi.listProperties()

  const { data: resultProperties } = response.data
  if (resultProperties) {
    // update properties
    properties.value = resultProperties
  }
})

watchEffect(async () => {
  const response = await propertyApi.getPropertyById(params.id)
  const { data: result } = response
  if (response.ok) {
    property.value = result.data
  }
})

watchEffect(async () => {
  const response = await openHouseApi.listOpenHouse(
    paginationState.limit.data,
    paginationState.page.data,
    params.id, //property id
    true // upcoming
  )
  const { data: result } = response
  if (response.ok) {
    openHouses.value = result.data
  }
})

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
  <h2 class="text-2xl mb-5">Property Details</h2>

  <div class="grid grid-cols-2 w-1/4" v-if="property">
    <div class="font-bold">ID</div>
    <div>{{ params.id }}</div>
    <div class="font-bold">Address</div>
    <div>{{ property.address }}</div>
    <div class="font-bold">Price</div>
    <div>{{ property.price }}</div>
    <div class="font-bold">Description</div>
    <div>{{ property.description }}</div>
  </div>
  <div v-else>Loading</div>

  <div class="mt-4">
    <h2 class="text-xl mb-5">Upcoming Openhouses</h2>
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
