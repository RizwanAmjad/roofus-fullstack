<script setup>
import { reactive, ref, watchEffect } from "vue"

import Input from "../components/Form/Input.vue"
import SelectMenu from "../components/Form/SelectMenu.vue"
import Submit from "../components/Form/Submit.vue"

import openHouseApi from "../api/openHouse"
import propertyApi from "../api/property"

const openHouseFormState = reactive({
  property: { data: "" },
  visitorAmount: { data: undefined },
  startDate: { data: undefined },
  endDate: { data: undefined },
})

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
</template>
