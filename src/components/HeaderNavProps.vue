<template>
  <div class="header">
    <div class="title">页面和标题栏</div>
    <icon id="#-ico-help" class="iconfont" />
  </div>
  <div class="body">
    <el-form :model="data" label-width="100px">
      <div class="title">页面</div>
      <el-form-item label="页面标题" class="between">
        <el-input v-model="data.title" placeholder="请填写页面名称，不超过8个汉字" />
      </el-form-item>
      <el-form-item label="背景色">
        <ColorPicker v-model="data.bgColor" size="medium" modebar="none"></ColorPicker>
        <div class="val pl12">{{ data.bgColor.hex }}</div>
      </el-form-item>
      <!-- <el-form-item label="背景图片">
        <el-upload class="avatar-uploader" action="#" :http-request="upload" :show-file-list="false">
          <img v-if="data.backgroundImageUrl" :src="data.backgroundImageUrl" style="width: 178px" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item> -->
      <el-form-item label="灰白模式">
        <el-switch v-model="data.grayscale" />
      </el-form-item>
      <el-divider />
      <div class="title" style="display: flex; align-items: center"><span style="padding-right: 12px">标题栏</span><el-switch v-model="data.navbar" /></div>
      <el-form-item label="标题栏风格">
        <el-radio-group v-model="data.navStyle">
          <el-radio-button label="fixed">固顶</el-radio-button>
          <el-radio-button label="scroll">滚动</el-radio-button>
          <el-radio-button label="custom">沉浸式</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="背景色">
        <ColorPicker v-model="data.navBgColor" size="medium" modebar="none"></ColorPicker>
        <div class="val pl12">{{ data.navBgColor.hex }}</div>
      </el-form-item>
      <el-form-item label="标题">
        <el-radio-group v-model="data.titleType" style="">
          <el-radio-button label="none">无</el-radio-button>
          <el-radio-button label="text">文字</el-radio-button>
          <el-radio-button label="image">图片</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="功能按钮">
        <div>
          <div>sdfsfsdf</div>
          <div>sdfsfsdf</div>
          <div>sdfsfsdf</div>
          <div>sdfsfsdf</div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'
import axios from 'axios'
import utils from '../base/utils'
import ColorPicker from '@mcistudio/vue-colorpicker'
import '@mcistudio/vue-colorpicker/dist/style.css'

// const lineTypeEnum = utils.createEnum({
//   solid: [1, '实线'],
//   dashed: [2, '虚线'],
//   dotted: [3, '点线']
// })
// const typeEnum = utils.createEnum({
//   line: [1, '分割线'],
//   gap: [2, '空白占位']
// })
const section = inject('sectionHeader')
const data = section.value
console.log(data)
// const selectedSectionIdx = inject('selectedSectionIdx')
// const data = sectionHeader
</script>
<style scoped lang="scss">
@import url('../assets/props.scss');
</style>
