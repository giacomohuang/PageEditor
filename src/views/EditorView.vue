<template>
  <header>
    <div class="title">页面编辑器{{ dragging }}</div>
  </header>
  <div class="main-wrap">
    <aside>
      <el-scrollbar :native="false" tag="section">
        <draggable forceFallback="true" class="component-list" @start="dragging = true" @end="dragging = false" :list="ComponentList" item-key="id" tag="ul" :sort="false" :clone="dropComponent" :group="{ name: 'comp', pull: 'clone', put: false }">
          <template #item="{ element }">
            <li>
              <div style="width: 50px; height: 50px; border: 1px solid #f1f1f1; margin-bottom: 8px"></div>
              <div>{{ element.name }}</div>
            </li>
          </template>
        </draggable>
      </el-scrollbar>
    </aside>
    <main @click="onMainClick">
      <el-scrollbar :native="false" tag="section">
        <div class="components">
          <div class="header wx-miniprogram">
            <div class="title">首页</div>
          </div>
          <div class="tips" v-if="!components || components.length == 0">请点击组件或将组件拖动到这里</div>
          <draggable forceFallback="true" scrollSensitivity="200" @start="dragging = true" @end="dragging = false" style="min-height: 722px" draggable=".draggable" :list="components" item-key="id" chosen-class="draggable-chosen" ghost-class="draggable-ghost" group="comp" @change="onComponentDropped">
            <template #item="{ element, index }">
              <div :class="{ draggable: element.draggable }">
                <div class="wrap" :class="{ active: index === selectedComponentIdx, 'wrap-dragging': dragging }" @mousedown.stop="editComponent($event, index)">
                  <div style="height: 100px">
                    <a href="aaaaa">{{ element.name }}</a>
                  </div>
                  <ul class="oprs" :class="{ hide: index !== selectedComponentIdx }">
                    <li>上</li>
                    <li>下</li>
                    <li>置底</li>
                    <li>置顶</li>
                    <li></li>
                  </ul>
                </div>
              </div>
            </template>
          </draggable>
          <!-- <div class="striped-bg" style="width: 640px; height: 200px"></div> -->
        </div>
      </el-scrollbar>
    </main>
    <aside class="navs">sdfsdsdfs</aside>
    <aside class="props">sdfsdfsdf</aside>
  </div>
</template>

<script setup>
import { provide, ref, onMounted, computed, nextTick } from 'vue'
import draggable from 'vuedraggable'
import Utils from '../base/utils'
import { ComponentList } from '../components/ComponentList'
import { nanoid } from 'nanoid'

const selectedComponentIdx = ref(-1)
const components = ref([])
const dragging = ref(false)

// const PropsComponents = {
//   MultiChoiceProps,
//   SingleChoiceProps
// }

// const PropsComponent = computed(() => {
//   return selectedComponentIdx.value >= 0 && topics.value ? PropsComponents[topics.value[selectedTopicIndex.value].type + 'Props'] : null
// })

function dropComponent(payload) {
  payload.id = nanoid()
  return Utils.deepCopyJson(payload)
}

// function clearComponentIdx(e) {
//   console.log(e.target.offsetParent)
//   selectedComponentIdx.value = -1
// }

function onMainClick(e) {
  var elem = e.target
  var targetArea = document.querySelector('.components')
  if (!targetArea.contains(elem)) {
    selectedComponentIdx.value = -1
  }
}

function onComponentDropped(e) {
  // console.log(e)
  // console.log(document.querySelector('ghost'))
  if (e.moved) {
    selectedComponentIdx.value = e.moved.newIndex
  } else if (e.added) {
    selectedComponentIdx.value = e.added.newIndex
  }
}

function editComponent(e, idx) {
  e.target.blur()
  console.log(e.target)
  selectedComponentIdx.value = idx
  console.log(selectedComponentIdx.value)
}
</script>

<style lang="scss">
header {
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  width: auto;
  min-width: 1440px;
  height: 64px;
  font-size: 16px;
  background: #43464f;
  color: #fff;
  /* border-bottom: 1px solid #e3e3e3; */
  z-index: 101;
  /* box-shadow: 0px 4px 4px 0px rgba(210, 210, 210, 0.3); */
  .title {
    margin: 0 20px;
  }
}

.main-wrap {
  background: #f3f3f3;
  display: flex;
  // flex-direction: row;
  height: calc(100vh - 64px);
}

aside {
  width: 280px;
  min-width: 280px;
  background: #fff;
  font-size: 14px;
  border-right: 1px solid #f1f1fa;
}

.navs {
  width: 180px;
  min-width: 180px;
}

.component-list {
  margin: 18px;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: stretch;
  li {
    width: 80px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

main {
  min-width: 620px;
  border-right: 1px solid #f1f1fa;
  background: #f0f0f2;
  flex-grow: 2;
}

.components {
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  width: 375px;
  min-height: 812px;
  background: #fff;
  margin: 40px auto;
  user-select: none;
  box-shadow: 0px 0px 2px 4px rgba(0, 0, 0, 0.05);

  .header {
    width: 375px;
    height: 90px;
  }
  .wx-miniprogram {
    background-image: url('../assets/img/wx_miniprogram_header@2x.png');
    background-size: 100%;
  }

  .title {
    font-size: 18px;
    position: relative;
    top: 52px;
    text-align: center;
  }

  .tips {
    position: absolute;
    top: 90px;
    height: 40px;
    line-height: 40px;
    width: 375px;
    color: #666;
    border: 1px dashed #c1c1c1;
    text-align: center;
  }

  .wrap {
    position: relative;
    user-select: none;
    background: #fff;

    &::before {
      content: '';
      position: absolute;
      width: 379px;
      height: 100%;
      left: -2px;
      top: 0;
      box-sizing: border-box;
      cursor: move;
      border: 0;
    }

    &:hover::before {
      border: 2px dotted #155bd4;
    }
  }

  // fix hover style when dragging
  .wrap-dragging::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .oprs {
    position: absolute;
    left: 376px;
    top: 0;
    background: #fff;
    border: 1px solid #cccccc;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.05);
    z-index: 100;
    li {
      width: 40px;
      height: 40px;
      &:not(:first-child) {
        border-top: 1px solid #f1f1f1;
      }
    }
  }

  .active {
    &:hover::before {
      z-index: 101;
      border: 2px solid #155bd4;
    }

    &::before {
      z-index: 101;
      border: 2px solid #155bd4;
    }
  }

  // .outline {
  //   position: relative;
  //   width: 375px;
  //   height: 100%;
  //   border: 2px dotted red;
  // }
}

.props {
  width: 360px;
  min-width: 360px;
}

// .draggable-chosen {
//   background: blue;
// }

.draggable-chosen {
  .oprs {
    display: none;
  }
}

.draggable-ghost {
  background-size: 8px 8px; /* 控制条纹的大小 */
  background-color: rgb(147, 202, 236);
  background-image: -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0.25, rgba(255, 255, 255, 0.2)), color-stop(0.25, transparent), color-stop(0.5, transparent), color-stop(0.5, rgba(255, 255, 255, 0.2)), color-stop(0.75, rgba(255, 255, 255, 0.2)), color-stop(0.75, transparent), to(transparent));
  background-image: -moz-linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);
  background-image: -o-linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);
  background-image: linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);

  box-shadow: none;
  border-radius: 0;
  border: 0;
  list-style: none;
  height: 40px;

  div {
    display: none;
  }
}
</style>
