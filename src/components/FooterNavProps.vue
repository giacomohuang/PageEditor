<template>
  <div class="header">
    <div class="title">底部导航栏</div>
    <icon id="#-ico-help" class="iconfont" />
  </div>
  <div class="body"></div>
</template>

<script setup>
import { ref, inject } from 'vue'

const sectionFooter = inject('sectionFooter')
const props = defineProps(['idx'])
const data = sectionFooter.data
console.log(data)
</script>

<style scoped lang="scss">
@import url('../assets/props.scss');
</style>
