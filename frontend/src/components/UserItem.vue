<script setup>
defineProps(["name", "onDelete", "onUpdate"])
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <div>{{ name }}</div>
    </div>
    <div class="flex gap-2">
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
