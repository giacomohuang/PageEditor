<template>
  <div class="header wx-miniprogram" :style="{ 'background-color': utils.rgba2hex(data.navBgColor.color) }">
    <!-- <div class="bg">
      <div class="status">
        <span class="time" style="">{{ utils.getTime() }}</span>
        <span class="pagetheme icon-battery sicon"></span>
        <span class="pagetheme icon-wifi sicon"></span>
        <span class="pagetheme icon-cellular sicon"></span>
      </div>
      <div class="btn" :style="{ 'border-color': utils.rgba2hex(data.navBgColor.color) }">2323 | 4234</div>
    </div> -->
    <div class="nav-wrap" v-if="data.navbar">
      <span class="title">{{ data.title || '首页' }}</span>
    </div>
  </div>
</template>
<script setup>
import utils from '../base/utils'
import { inject } from 'vue'
const data = inject('sectionHeader')
</script>

<style scoped lang="scss">
.header {
  width: 375px;
  height: 90px;
  background-color: var(--t-nav-bg-color);
}
.wx-miniprogram {
  background-image: url('../assets/img/wx_miniprogram_header@2x.png');
  background-size: 100%;
}

// .bg {
//   width: 375px;
//   height: 90px;
//   background-color: currentColor;
//   position: absolute;
// }

// .status {
//   padding: 15px 12px 0 30px;
//   filter: grayscale(1) contrast(9999) invert(1);
// }
// .sicon {
//   font-size: 12px;
//   float: right;
//   margin-right: 5px;
// }

// .btn {
//   float: right;
//   border: 1px solid #000;
//   border-radius: 30px;
//   height: 30px;
//   filter: grayscale(1) contrast(9999) invert(1);
// }

.nav-wrap {
  font-size: 18px;
  position: relative;
  top: 52px;
  text-align: center;
}

// .title {
//   // filter: grayscale(1) contrast(9999) invert(1);
// }
</style>
