<script setup>
import { useRoute } from "vue-router"

const { params } = useRoute()
</script>

<template>
  <h2>Property Details</h2>
  <span>{{ params.id }}</span>
</template>
