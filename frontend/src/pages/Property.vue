<script setup>
import { reactive, ref, watchEffect } from "vue"

import Pagination from "../components/Pagination.vue"
import PropertyItem from "../components/PropertyItem.vue"

import Input from "../components/Form/Input.vue"
import Submit from "../components/Form/Submit.vue"

import propertyApi from "../api/property"

const propertyFormState = reactive({
  address: { data: "" },
  price: { data: undefined },
  description: { data: "" },
})

const propertyUpdateFormState = reactive({
  address: { data: "" },
  price: { data: 0 },
  description: { data: "" },
})

const paginationState = reactive({
  limit: { data: 5 },
  page: { data: 1 },
  totalPages: 0,
})

const properties = ref([])
const editingId = reactive({ data: undefined })

watchEffect(async () => {
  const response = await propertyApi.listProperties(
    paginationState.limit.data,
    paginationState.page.data
  )

  const { data: resultProperties } = response.data
  if (resultProperties) {
    // update properties
    properties.value = resultProperties
    // set total pages
    paginationState.totalPages = response.data.totalPages
  }
})

const handleCreateProperty = async () => {
  const response = await propertyApi.createProperty({
    address: propertyFormState.address.data,
    price: propertyFormState.price.data,
    description: propertyFormState.description.data,
  })
  const { data: result } = response
  if (response.ok) {
    properties.value = [result.data, ...properties.value].splice(
      0,
      paginationState.limit.data
    )
    return
  }
  alert(result.error)
}
</script>

<template>
  <h2 class="text-2xl mb-5">Properties</h2>

  <div class="w-1/3">
    <Input
      class="my-1"
      type="text"
      label="Address"
      placeholder="Address"
      :value="propertyFormState.address"
    />
    <Input
      class="my-1"
      type="number"
      label="Price"
      placeholder="Price"
      :value="propertyFormState.price"
    />
    <Input
      class="my-1"
      type="text"
      label="Description"
      placeholder="Description"
      :value="propertyFormState.description"
    />
    <Submit class="my-1" :onSubmit="handleCreateProperty"
      >Create Property</Submit
    >
  </div>

  <div class="mt-4">
    <PropertyItem
      v-for="property in properties"
      :address="property.address"
      :description="property.description"
      :price="property.price"
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
