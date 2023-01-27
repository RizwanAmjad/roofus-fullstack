<script setup>
defineProps(["headers"])
</script>

<template>
  <div
    class="bg-gray-800 font-bold mb-2 px-2 py-4 rounded-md text-lg text-center"
  >
    <div class="grid w-5/6" :class="`grid-cols-${headers.length}`">
      <div v-for="(header, index) in headers" :class="{ 'text-left': !index }">
        {{ header }}
      </div>
    </div>
  </div>
</template>
