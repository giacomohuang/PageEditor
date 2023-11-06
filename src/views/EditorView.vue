<template>
  <header>
    <div class="title">页面编辑器{{ selectedComponentIdx }},{{ components.length }}</div>
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
    <main @click="onClickOutside">
      <el-scrollbar :native="false" tag="section" @scroll="handleScroll" ref="scrollRef">
        <div class="components">
          <div class="header wx-miniprogram">
            <div class="title">首页</div>
          </div>
          <div class="tips" v-if="!components || components.length == 0">请点击组件或将组件拖动到这里</div>
          <draggable forceFallback="true" handle=".handle" scrollSensitivity="200" @start="dragging = true" @end="dragging = false" style="min-height: 750px" draggable=".draggable" :list="components" item-key="id" chosen-class="draggable-chosen" ghost-class="draggable-ghost" group="comp" @change="onComponentDropped">
            <template #item="{ element, index }">
              <div :class="{ draggable: element.draggable }">
                <div style="position: relative">
                  <div class="wrap handle" :class="{ active: index === selectedComponentIdx, 'wrap-dragging': dragging }" @mousedown.stop="editComponent($event, index)">
                    <div style="height: 200px">
                      <a href="aaaaa">{{ element.name }}</a>
                    </div>
                  </div>
                  <ul class="oprs" :class="{ show: index === selectedComponentIdx }">
                    <li @click.stop="moveUpItem(index)" :class="{ disabled: index === 0 }">
                      <el-icon><Top /></el-icon>
                    </li>
                    <li @click.stop="moveDownItem(index)" :class="{ disabled: index === components.length - 1 }">
                      <el-icon><Bottom /></el-icon>
                    </li>
                    <li @click.stop="moveTopItem(index)" :class="{ disabled: index === 0 }">
                      <el-icon><Upload /></el-icon>
                    </li>
                    <li @click.stop="moveBottomItem(index)" :class="{ disabled: index === components.length - 1 }">
                      <el-icon><Download /></el-icon>
                    </li>
                    <li @click.stop="copyItem(index)" :class="{ disabled: index === components.length - 1 }">
                      <el-icon><CopyDocument /></el-icon>
                    </li>

                    <li @click.stop="deleteItem(index)">
                      <el-icon><Delete /></el-icon>
                    </li>
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
const components = ref([
  { id: 'X9cNw_X0YpfIth6fRTMi2', name: '文本', icon: 'titletext.png', draggable: true },
  { id: 'J458Foq2BDtT0rIbgQClX', name: '文本', icon: 'titletext.png', draggable: true },
  { id: 'Q4tL3kpwZifUQ_sD059iC', name: '富文本', icon: 'Richtext.png', draggable: true },
  { id: 'NGmOVLQ5g9fv4MrMRuV0C', name: '富文本', icon: 'Richtext.png', draggable: true },
  { id: 'fEpRZSCDg1ie2n8zO-C2A', name: '富文本', icon: 'Richtext.png', draggable: true },
  { id: 'qJOfwCwzipdRfGm_h56cL', name: '文本', icon: 'titletext.png', draggable: true },
  { id: '3qq_9URpfd8cfu8DMwt4R', name: '富文本', icon: 'Richtext.png', draggable: true },
  { id: 'Fdz_lCWcBcXcTJ-ZexK1C', name: '富文本', icon: 'Richtext.png', draggable: true }
])
const dragging = ref(false)
const scrollRef = ref(null)

// const PropsComponents = {
//   MultiChoiceProps,
//   SingleChoiceProps
// }

// const PropsComponent = computed(() => {
//   return selectedComponentIdx.value >= 0 && topics.value ? PropsComponents[topics.value[selectedTopicIndex.value].type + 'Props'] : null
// })

// /* handle scroll
function handleScroll(e) {
  console.log('scroll', e)
  // const elem = document.querySelector('.oprs.show')
  // const comp = document.querySelector('.wrap.active')
  // const windowHeight = window.innerHeight
  // const scrollY = e.scrollTop
  // const elemTop = comp.getBoundingClientRect().top + scrollY
  // const elemLeft = document.querySelector('.components').getBoundingClientRect().left + 375
  // const elemBottom = elem.getBoundingClientRect().bottom + scrollY
  // console.log(elemTop)
  // if (scrollY + 60 > elemTop) {
  //   elem.style.position = 'fixed'
  //   elem.style.top = '60px'
  //   elem.style.left = elemLeft + 'px'
  // } else {
  //   elem.style.position = 'absolute'
  //   elem.style.top = '0px'
  //   elem.style.left = '375px'
  // }
  // if (elemBottom > windowHeight + scrollY) {
  //   elem.classList.add('bottom')
  // } else {
  //   elem.classList.remove('bottom')
  // }
}
// */

function dropComponent(payload) {
  payload.id = nanoid()
  return Utils.deepCopyJson(payload)
}

function onClickOutside(e) {
  var elem = e.target
  var targetArea = document.querySelector('.components')
  if (!targetArea.contains(elem)) {
    selectedComponentIdx.value = -1
  }
}

function onComponentDropped(e) {
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
}

function moveUpItem(idx) {
  if (idx === 0) return
  swapItem(idx, idx - 1)
}

function moveDownItem(idx) {
  if (idx === components.value.length - 1) return
  swapItem(idx, idx + 1)
}

function moveTopItem(idx) {
  if (idx === 0) return
  swapItem(idx, 0)
}

function moveBottomItem(idx) {
  if (idx === components.value.length - 1) return
  swapItem(idx, components.value.length - 1)
}

function swapItem(idx1, idx2) {
  let t = components.value[idx2]
  components.value.splice(idx2, 1, components.value[idx1])
  components.value[idx1] = t
  selectedComponentIdx.value = idx2
  nextTick(() => {
    fixPos()
  })
}

function copyItem(idx) {
  const newItem = Utils.deepCopyJson(components.value[idx])
  newItem.id = nanoid()
  components.value.splice(idx, 0, newItem)
  selectedComponentIdx.value++
  console.log(components.value)
  nextTick(() => {
    fixPos()
  })
}

function deleteItem(idx) {
  components.value.splice(idx, 1)
  if (idx === components.value.length) {
    selectedComponentIdx.value = components.value.length - 1
  } else if (components.value.length === 0) {
    selectedComponentIdx.value = -1
  }
  nextTick(() => {
    fixPos()
  })
}

function fixPos() {
  const rect = document.querySelector('.wrap.active').getBoundingClientRect()
  const scrollTop = scrollRef.value.$el.children[0].scrollTop
  const windowHeight = window.innerHeight
  var topOffset = rect.top + scrollTop
  var bottomOffset = rect.bottom + scrollTop
  // 判断元素是否在当前视口中
  if (topOffset < scrollTop || bottomOffset > scrollTop + windowHeight) {
    // 计算需要滚动的距离
    var scrollAmount = topOffset - 60 - scrollTop - (windowHeight - Math.min(rect.height, windowHeight)) / 2
    scrollRef.value.scrollTo(0, scrollTop + scrollAmount, 500)
  }
}

/*
// function addClass(el, className) {
//   className.split(' ').forEach((cName) => {
//     cName && el.classList.add(cName)
//   })
// }

// function removeClass(el, className) {
//   className.split(' ').forEach((cName) => {
//     cName && el.classList.remove(cName)
//   })
// }
*/
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
    cursor: pointer;
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
  margin: 40px auto 100px auto;
  user-select: none;
  box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.05);

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
  .wrap-dragging {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    &:hover::before {
      border: 0px;
    }
  }

  .oprs {
    position: absolute;
    display: none;
    left: 375px;
    top: -1px;
    background: #fff;
    border: 1px solid #cccccc;
    border-radius: 0 4px 4px 0;
    box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.05);
    // z-index: 100;
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      font-size: 1em;
      color: #666;
      &:hover {
        color: #fff;
        background: #155bd4;
      }
      &:not(:first-child) {
        border-top: 1px solid #f1f1f1;
      }
    }
    .disabled {
      color: #ccc;
      background: #f1f1f1;
      &:hover {
        color: #ccc;
        background: #f1f1f1;
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

  .show {
    display: block;
  }
  // .outline {
  //   position: relative;
  //   width: 375px;
  //   height: 100%;
  //   border: 2px dotted red;
  // }
}

.sticky {
  position: fixed;
  top: 60px;
}

.bottom {
  position: absolute;
  bottom: 0;
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
