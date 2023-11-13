<template>
  <div class="title">{{ data.title }}</div>
  <div>{{}}</div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps(['data'])
const data = ref(props.data)
data.value.title = 'aaaaaa'
</script>
<style scoped lang="scss"></style>
