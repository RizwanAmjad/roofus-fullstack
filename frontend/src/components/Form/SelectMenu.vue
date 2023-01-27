<script setup>
defineProps(["label", "options", "showKey", "value"])
</script>

<template>
  <div class="bg-gray-900 flex gap-2 items-center p-2 rounded-md">
    <label v-bind:for="label" class="flex-grow">{{ label }}</label>

    <select
      class="bg-white flex-grow p-1 rounded-sm text-gray-900"
      v-model="value.data"
    >
      <option v-for="option in options" :value="option._id">
        {{ option[showKey] }}
      </option>
    </select>
  </div>
</template>
