<template>
  <div class="header">
    <div class="title">底部导航栏</div>
    <icon id="#-ico-help" class="iconfont" />
  </div>
  <div class="body">
    <el-form :model="data" label-width="100px">
      <el-form-item label="样式" class="between">
        <el-radio-group v-model="data.style" @change="onStyleChange">
          <el-radio-button value="normal">常规</el-radio-button>
          <el-radio-button value="rudder1">舵式1</el-radio-button>
          <el-radio-button value="rudder2">舵式2</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="按钮数量">
        <el-radio-group v-model="data.btnNum">
          <el-radio-button value="1" :disabled="data.style === 'rudder1' || data.style === 'rudder2'">1</el-radio-button>
          <el-radio-button value="2" :disabled="data.style === 'rudder1' || data.style === 'rudder2'">2</el-radio-button>
          <el-radio-button value="3">3</el-radio-button>
          <el-radio-button value="4" :disabled="data.style === 'rudder1' || data.style === 'rudder2'">4</el-radio-button>
          <el-radio-button value="5">5</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div class="upload-tips">
        - 按钮图标格式：png、gif、jpg, 文件大小不超过1MB<br />
        - 长宽比：1:1，建议尺寸:72*72px<br />
        - 图标背景色透明或与导航栏背景色一致
      </div>
      <draggable tag="ul" class="btns" handle=".handle" :list="data.btns" ghost-class="btn-ghost" drag-class="btn-drag" item-key="id">
        <template #item="{ element, index }">
          <li v-if="index < data.btnNum">
            <icon id="#-ico-handle" class="handle" />

            <el-upload class="avatar-uploader" action="#" :http-request="upload" :data="{ index: index }" :show-file-list="false">
              <div class="upl">
                <div class="percentage" v-if="currentIndex === index">{{ percentage }}%</div>
                <span v-if="!element.imgUrl">+</span>
                <img v-else :src="element.imgUrl" />
              </div>
            </el-upload>
            <div class="link">
              <el-input size="small" v-model="element.title" placeholder="按钮名称"></el-input>
              <el-input size="small" v-model="element.link" placeholder="链接"></el-input>
            </div>
            <!-- <div class="del" @click="delBtn(index)">
                <el-icon><Delete /></el-icon>
              </div> -->
          </li>
        </template>
      </draggable>
    </el-form>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'
import axios from 'axios'
import draggable from 'vuedraggable'

const data = inject('sectionFooter')
const percentage = ref(0)
const currentIndex = ref(-1)
function upload(file) {
  const formData = new FormData()
  formData.append('smfile', file.file)
  currentIndex.value = file.data.index
  axios({
    url: 'api/upload',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'qgfMlDz62BpgaH4qcxn7YLvxqQ0YYTSp'
    },
    onUploadProgress: (progress) => {
      percentage.value = Math.round(progress.loaded / progress.total) * 100 // 进度条百分比
    }
  }).then((res) => {
    if (res.data.code === 'image_repeated') {
      data.value.btns[file.data.index].imgUrl = res.data.images
    } else {
      data.value.btns[file.data.index].imgUrl = res.data.data.url
    }
    currentIndex.value = -1
  })
}

function onStyleChange() {
  const n = data.value.btnNum
  if (['rudder1', 'rudder2'].includes(data.value.style)) {
    if (n > 3) {
      data.value.btnNum = 5
    } else {
      data.value.btnNum = 3
    }
  }
}
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
    position: relative;
    align-items: center;
    border: 1px solid #f2f3f4;
    padding: 12px 12px 12px 0;

    // &:hover .del {
    //   visibility: visible;
    // }
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
    box-sizing: content-box;
    width: 48px;
    height: 48px;
    border-radius: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 8px 0 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 48px;
    }
  }

  .link {
    height: 55px;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
  }
  // .del {
  //   visibility: hidden;
  //   position: absolute;
  //   right: 3px;
  //   top: 30px;
  //   border-radius: 24px;
  //   height: 24px;
  //   width: 24px;
  //   background: #00000080;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   color: #fff;
  //   cursor: pointer;
  //   &:hover {
  //     background: var(--color-main-highlight);
  //   }
  // }
}

.percentage {
  position: absolute;
  background: #000000cc;
  color: #fff;
  height: 48px;
  width: 48px;
  border-radius: 48px;
  font-size: 12px;
  line-height: 48px;
  text-align: center;
}

.btn-drag {
  background-color: #fff;
  // color: #fff;
}

.btn-ghost {
  > * {
    visibility: hidden;
  }
  // background-color: var(--color-main-highlight);

  background-size: 8px 8px; /* 控制条纹的大小 */
  background-color: rgb(147, 202, 236);
  background-image: -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0.25, rgba(255, 255, 255, 0.2)), color-stop(0.25, transparent), color-stop(0.5, transparent), color-stop(0.5, rgba(255, 255, 255, 0.2)), color-stop(0.75, rgba(255, 255, 255, 0.2)), color-stop(0.75, transparent), to(transparent));
  background-image: -moz-linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);
  background-image: -o-linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);
  background-image: linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);
}

.upload-tips {
  padding: 8px;
  font-size: 12px;
  line-height: 140%;
  color: #e6a23c;
  background-color: #fdf6ec;
}
</style>
