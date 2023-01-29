<script setup>
import { reactive, ref, watchEffect } from "vue"

import Modal from "../components/Modal.vue"
import Pagination from "../components/Pagination.vue"
import PropertyItem from "../components/PropertyItem.vue"

import Input from "../components/Form/Input.vue"
import Submit from "../components/Form/Submit.vue"

import propertyApi from "../api/property"
import TableHeader from "../components/TableHeader.vue"

const propertyFormState = reactive({
  address: { data: "" },
  price: { data: undefined },
  description: { data: "" },
})

const propertyUpdateFormState = reactive({
  address: { data: "" },
  price: { data: undefined },
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

const handleDelete = async (id) => {
  const sureToDelete = confirm("Are you sure to delete Property?")
  if (!sureToDelete) return

  const response = await propertyApi.deleteProperty(id)
  const { data: result } = response
  if (response.ok) {
    properties.value = properties.value.filter(
      ({ _id }) => _id !== result.data._id
    )
    return
  }
}

const handleOpenUpdate = (id) => {
  editingId.data = id
  const property = properties.value.find((property) => property._id === id)

  propertyUpdateFormState.address.data = property.address
  propertyUpdateFormState.price.data = property.price
  propertyUpdateFormState.description.data = property.description
}

const handleUpdate = async () => {
  const updates = {
    address: propertyUpdateFormState.address.data,
    price: propertyUpdateFormState.price.data,
    description: propertyUpdateFormState.description.data,
  }
  // update in backend
  await propertyApi.updateProperty(editingId.data, updates)
  // update in UI
  properties.value = properties.value.map((property) =>
    property._id === editingId.data ? { ...property, ...updates } : property
  )

  // close the modal
  editingId.data = undefined
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
      min="0"
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
    <TableHeader :headers="['Address', 'Price', 'Description']" />
    <PropertyItem
      v-for="property in properties"
      :address="property.address"
      :description="property.description"
      :propertyId="property._id"
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

  <Modal :shown="editingId">
    <div class="w-2/3 m-auto">
      <Input
        class="my-1"
        type="text"
        label="Address"
        placeholder="Address"
        :value="propertyUpdateFormState.address"
      />
      <Input
        class="my-1"
        type="number"
        label="Price"
        placeholder="Price"
        :value="propertyUpdateFormState.price"
      />
      <Input
        class="my-1"
        type="text"
        label="Description"
        placeholder="Description"
        :value="propertyUpdateFormState.description"
      />
      <Submit class="my-1" :onSubmit="() => handleUpdate()"
        >Update Property</Submit
      >
    </div>
  </Modal>
</template>
