<script setup>
defineProps(["onSubmit"])
</script>

<template>
  <button
    class="bg-gray-900 px-4 py-2 rounded-md hover:bg-gray-400 hover:text-gray-900 transition-all"
    @click="onSubmit"
  >
    <slot></slot>
  </button>
</template>
