<script setup>
defineProps(["label", "placeholder", "type"])
</script>

<template>
  <div class="bg-gray-900 flex gap-2 items-center p-2 rounded-md">
    <label v-bind:for="label" class="flex-grow">{{ label }}</label>
    <input
      class="p-1 rounded-sm text-gray-900 outline-none"
      :id="label"
      :placeholder="placeholder"
      :type="type"
    />
  </div>
</template>
