<template>
  <div>
    <div v-if="data.type === 'line'" :style="{ padding: data.paddingTB + 'px ' + data.paddingLR + 'px' }">
      <div style="height: 1px" :style="{ 'border-top': data.size + 'px ' + data.lineType + ' ' + utils.rgba2hex(data.color) }"></div>
    </div>
    <div v-if="data.type === 'gap'" :style="{ height: data.height + 'px' }"></div>
  </div>
</template>
<script setup>
import { ref, inject } from 'vue'
import utils from '../base/utils'

const lineTypeEnum = utils.createEnum({
  solid: [1, '实线'],
  dashed: [2, '虚线'],
  dotted: [3, '点线']
})
const typeEnum = utils.createEnum({
  line: [1, '分割线'],
  gap: [2, '空白占位']
})
const sections = inject('sections')
const props = defineProps(['index'])
const data = sections.value[props.index].data
// const refPadding = console.log('aaaa', refPadding)
</script>

<style scoped lang="scss"></style>
