<script setup>
import { ref, watchEffect } from "vue"
import { useRoute } from "vue-router"

import propertyApi from "../api/property"

const { params } = useRoute()

const property = ref()

watchEffect(async () => {
  const response = await propertyApi.getPropertyById(params.id)
  const { data: result } = response
  if (response.ok) {
    property.value = result.data
  }
})
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
</template>
