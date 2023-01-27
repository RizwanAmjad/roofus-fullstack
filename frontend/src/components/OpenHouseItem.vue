<script setup>
defineProps([
  "endDate",
  "property",
  "startDate",
  "visitorAmount",
  "onDelete",
  "onUpdate",
])
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="grid grid-cols-4 w-5/6 text-center">
      <code class="text-ellipsis overflow-hidden text-left">{{
        property
      }}</code>
      <div>{{ visitorAmount }}</div>
      <div>{{ startDate }}</div>
      <div>{{ endDate }}</div>
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
