<template>
  <div class="header">
    <div class="title">底部导航栏</div>
    <icon id="#-ico-help" class="iconfont" />
  </div>
  <div class="body">
    <el-form :model="data" label-width="100px">
      <el-form-item label="样式" class="between">
        <el-radio-group v-model="data.style">
          <el-radio-button label="normal">常规</el-radio-button>
          <el-radio-button label="rudder1">舵式1</el-radio-button>
          <el-radio-button label="rudder2">舵式2</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="功能按钮">
        <draggable tag="ul" class="btns" handle=".handle" :list="data.btns" ghost-class="btn-ghost" drag-class="btn-drag" item-key="id">
          <template #item="{ element, index }">
            <li>
              <icon id="#-ico-handle" class="handle" />
              <div class="upl">{{ index }}</div>
              <el-input size="small" v-model="element.title"></el-input>
            </li>
          </template>
        </draggable>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import draggable from 'vuedraggable'

const data = inject('sectionFooter')
// const props = defineProps(['idx'])
// const data = sectionFooter
// console.log(data)
</script>

<style scoped lang="scss">
@import url('../assets/props.scss');

.btns {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #fff;
  li {
    display: flex;
    align-items: center;
    border: 1px solid #f2f3f4;
  }
  .handle {
    flex-shrink: 0;
    font-size: 14px;
    margin: 0px 3px 0 3px;
    // visibility: hidden;
    color: #999;
    &:hover {
      color: var(--color-main-highlight);
      cursor: move;
    }
  }
  .upl {
    flex-shrink: 0;
    border: 1px dashed #ccc;
    width: 40px;
    height: 40px;
    border-radius: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 8px 8px 8px 0;
  }
}

.btn-drag {
  background-color: #fff;
  // color: #fff;
}
.btn-ghost {
  background-color: var(--color-main-highlight);
  > * {
    visibility: hidden;
  }
  background-size: 8px 8px; /* 控制条纹的大小 */
  background-color: rgb(147, 202, 236);
  background-image: -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0.25, rgba(255, 255, 255, 0.2)), color-stop(0.25, transparent), color-stop(0.5, transparent), color-stop(0.5, rgba(255, 255, 255, 0.2)), color-stop(0.75, rgba(255, 255, 255, 0.2)), color-stop(0.75, transparent), to(transparent));
  background-image: -moz-linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);
  background-image: -o-linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);
  background-image: linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);
}
</style>
