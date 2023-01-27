<script setup>
import { reactive, ref, watchEffect } from "vue"

import Input from "../components/Form/Input.vue"
import Pagination from "../components/Pagination.vue"
import SelectMenu from "../components/Form/SelectMenu.vue"
import Submit from "../components/Form/Submit.vue"
import TableHeader from "../components/TableHeader.vue"

import openHouseApi from "../api/openHouse"
import propertyApi from "../api/property"
import OpenHouseItem from "../components/OpenHouseItem.vue"

const openHouseFormState = reactive({
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

const handleCreateOpenHouse = async () => {
  const response = openHouseApi.createOpenHouse({
    property: openHouseFormState.property.data,
    visitorAmount: openHouseFormState.visitorAmount.data,
    startDate: openHouseFormState.startDate.data,
    endDate: openHouseFormState.endDate.data,
  })

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
  <h2 class="text-2xl mb-5">Open House</h2>

  <div class="w-1/3">
    <SelectMenu
      label="Property"
      :options="properties"
      showKey="address"
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
      :property="openHouse.property"
      :startDate="formatDate(openHouse.startDate)"
      :visitorAmount="openHouse.visitorAmount"
      :onDelete="() => handleDelete(property._id)"
      :onUpdate="() => handleOpenUpdate(property._id)"
    />
  </div>

  <Pagination
    class="my-4"
    :limit="paginationState.limit"
    :page="paginationState.page"
    :totalPages="paginationState.totalPages"
  />
</template>
