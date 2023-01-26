<script setup>
defineProps(["headers"])
</script>

<template>
  <div class="bg-gray-800 font-bold mb-2 px-2 py-4 rounded-md text-lg">
    <div class="grid w-5/6" :class="`grid-cols-${headers.length}`">
      <div v-for="header in headers">{{ header }}</div>
    </div>
  </div>
</template>
