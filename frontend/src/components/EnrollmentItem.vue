<script setup>
import { RouterLink } from "vue-router"

defineProps(["openHouse", "property", "date", "user", "onDelete", "onUpdate"])
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="grid grid-cols-3 w-5/6 text-center">
      <RouterLink
        :to="`property/${property}`"
        class="font-bold text-left hover:text-sky-500 underline"
      >
        <code class="text-ellipsis overflow-hidden">{{ property }}</code>
      </RouterLink>
      <div>{{ user }}</div>
      <div>{{ date }}</div>
    </div>
    <div class="flex gap-2 w-auto">
      <button
        class="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition-all my-1"
        @click="onUpdate"
      >
        Update
      </button>
      <button
        class="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition-all my-1"
        @click="onDelete"
      >
        Delete
      </button>
    </div>
  </div>
</template>
