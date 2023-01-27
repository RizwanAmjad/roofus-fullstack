<script setup>
import Input from "./Form/Input.vue"

defineProps(["limit", "page", "totalPages"])
</script>

<template>
  <div class="flex gap-4 items-center">
    <Input label="Limit" min="1" type="number" :value="limit" />
    <div>
      <div class="flex gap-2">
        <div
          class="bg-gray-500 cursor-pointer px-4 py-2 rounded-md"
          :class="{ '!bg-gray-900': pageNumber === page.data }"
          v-for="pageNumber in totalPages"
          @click="page.data = pageNumber"
        >
          {{ pageNumber }}
        </div>
      </div>
    </div>
  </div>
</template>
