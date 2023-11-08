<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="props.id"></use>
  </svg>
</template>

<script setup>
const props = defineProps(['id'])
</script>
