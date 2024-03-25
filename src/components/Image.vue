<template>
  <img src="https://s2.loli.net/2023/12/15/vtxoKka8s3CjLDA.png" style="width: 375px" hotarea />
</template>
<script setup>
import { inject } from 'vue'
const sections = inject('sections')
const props = defineProps(['index'])
const data = sections.value[props.index].data
data.img = 'https://s2.loli.net/2023/12/15/vtxoKka8s3CjLDA.png'
// import { onMounted } from 'vue'
// onMounted(() => {
//   const imgs = document.querySelectorAll('img[hotarea]')
//   for (var img of imgs) {
//     img.addEventListener('click', (ev) => {
//       console.log(ev, 'click')
//     })
//   }
// })
// function onClick(ev) {
//   console.log(ev, 'click')
// }
</script>
