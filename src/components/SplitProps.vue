<template>
  <div class="header">
    <div class="title">分割占位</div>
    <icon id="#-ico-help" class="iconfont" />
  </div>
  <div class="body">
    <el-form :model="data" label-width="80px">
      <el-form-item label="线型" class="h40">
        <div class="val pr12">{{ typeEnum.getDesc(data.type) }}</div>
        <el-radio-group v-model="data.type" size="small">
          <el-radio-button label="line"><icon id="#-ico-splitline" /></el-radio-button>
          <el-radio-button label="gap"><icon id="#-ico-splitgap" /></el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="线型" class="h40" v-show="data.type === 'line'">
        <div class="val pr12">{{ lineTypeEnum.getDesc(data.lineType) }}</div>
        <el-radio-group v-model="data.lineType" size="small">
          <el-radio-button label="solid"><icon id="#-ico-solid" /></el-radio-button>
          <el-radio-button label="dashed"><icon id="#-ico-dashed" /></el-radio-button>
          <el-radio-button label="dotted"><icon id="#-ico-dotted" /></el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="左右间距" v-show="data.type === 'line'">
        <el-slider v-model="data.paddingLR" size="small" :min="0" :max="40" style="width: 190px" />
        <div class="val pl12">{{ data.paddingLR }}px</div>
      </el-form-item>
      <el-form-item label="上下间距" v-show="data.type === 'line'">
        <el-slider v-model="data.paddingTB" size="small" :min="0" :max="200" style="width: 190px" />
        <div class="val pl12">{{ data.paddingTB }}px</div>
      </el-form-item>
      <el-form-item label="线宽" v-show="data.type === 'line'">
        <el-slider v-model="data.size" size="small" :min="1" :max="10" style="width: 190px" />
        <div class="val pl12">{{ data.size }}px</div>
      </el-form-item>
      <el-form-item label="颜色" v-show="data.type === 'line'">
        <ColorPicker v-model="data.lineColor" size="medium" modebar="none"></ColorPicker>
        <div class="val pl12">{{ data.lineColor.hex }}</div>
      </el-form-item>
      <el-form-item label="高度" v-show="data.type === 'gap'">
        <el-slider v-model="data.height" size="small" :min="0" :max="200" style="width: 190px" />
        <div class="val pl12">{{ data.height }}px</div>
      </el-form-item>
      <!-- <el-divider /> -->
    </el-form>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import utils from '../base/utils'
import ColorPicker from '@mcistudio/vue-colorpicker'
import '@mcistudio/vue-colorpicker/dist/style.css'

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
const selectedSectionIdx = inject('selectedSectionIdx')
const data = sections.value[selectedSectionIdx.value].data
// console.log(data.color)
</script>

<style scoped lang="scss">
@import url('../assets/props.scss');
</style>

<style>
.h40 .el-form-item__label {
  height: 40px;
  line-height: 40px;
}
</style>
