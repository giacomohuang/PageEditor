<template>
  <header>
    <div class="title">页面编辑器{{ selectedSectionIdx }},{{ sections.length }},{{ dragging }}</div>
  </header>
  <div class="main-wrap">
    <aside>
      <el-scrollbar :native="false">
        <draggable forceFallback="true" class="components" @start="dragging = true" @end="dragging = false" :list="Components" item-key="id" tag="ul" :sort="false" :clone="dropComponent" :group="{ name: 'comp', pull: 'clone', put: false }">
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
      <el-scrollbar :native="false" @scroll="handleScroll" ref="scrollRef">
        <div class="sections">
          <draggable forceFallback="true" handle=".handle" scrollSensitivity="200" @start="sdragging = true" @end="dragging = false" style="min-height: 750px" :list="sections" item-key="id" chosen-class="draggable-chosen" ghost-class="draggable-ghost" group="comp" @change="onSectionDropped">
            <template #header>
              <div class="wrap header wx-miniprogram" :class="{ 'wrap-dragging': dragging }">
                <div class="title">首页</div>
              </div>
              <div class="tips" v-if="!sections || sections.length == 0">请点击组件或将组件拖动到这里</div>
            </template>

            <template #item="{ element, index }">
              <div>
                <div style="position: relative">
                  <div class="wrap handle" :class="{ active: index === selectedSectionIdx, 'wrap-dragging': dragging }" @mousedown.stop="editComponent($event, index)">
                    <div style="height: 200px">
                      <component :is="componentList[element.type]" :index="index" :key="element.id"></component>
                    </div>
                  </div>
                  <ul class="oprs" :class="{ show: index === selectedSectionIdx }">
                    <li @click.stop="moveUpItem(index)" :class="{ disabled: index === 0 }">
                      <el-icon><Top /></el-icon>
                    </li>
                    <li @click.stop="moveDownItem(index)" :class="{ disabled: index === sections.length - 1 }">
                      <el-icon><Bottom /></el-icon>
                    </li>
                    <li @click.stop="moveTopItem(index)" :class="{ disabled: index === 0 }">
                      <el-icon><Upload /></el-icon>
                    </li>
                    <li @click.stop="moveBottomItem(index)" :class="{ disabled: index === sections.length - 1 }">
                      <el-icon><Download /></el-icon>
                    </li>
                    <li @click.stop="copyItem(index)" :class="{ disabled: index === sections.length - 1 }">
                      <el-icon><CopyDocument /></el-icon>
                    </li>

                    <li @click.stop="deleteItem(index)">
                      <el-icon><Delete /></el-icon>
                    </li>
                  </ul>
                </div>
              </div>
            </template>

            <template #footer>
              <div class="footer"></div>
            </template>
          </draggable>
        </div>
      </el-scrollbar>
      <div class="nav-btn" @click.stop="toggleNav">
        <el-icon><Memo style="padding-top: 4px" /></el-icon> <span>页面导航</span>
      </div>
    </main>
    <aside class="navs">
      <div class="title">
        <div class="text">页面导航</div>
        <div class="close" @click.stop="toggleNav">
          <el-icon><Close /></el-icon>
        </div>
      </div>
      <el-scrollbar :native="false">
        <draggable forceFallback="true" class="list" @start="dragging = true" @end="dragging = false" :list="sections" item-key="id" handle=".handle" tag="ul" chosen-class="nav-draggable-chosen" @change="onSectionDropped">
          <template #item="{ index, element }">
            <li @click.stop="selectedSectionIdx = index" class="item" :class="{ selected: selectedSectionIdx === index }">
              <div class="title">
                <icon id="#icon-tuodong" class="handle" />
                <span>{{ index + 1 }}. {{ element.name }}</span>
                <span class="del" @click.stop="deleteItem(index)"
                  ><el-icon><Delete /></el-icon
                ></span>
              </div>
            </li>
          </template>
        </draggable>
      </el-scrollbar>
    </aside>
    <aside class="props">
      <component :is="PropsComponent" :index="selectedSectionIdx" :key="selectedSectionIdx"></component>
    </aside>
  </div>
</template>

<script setup>
import { provide, ref, onMounted, computed, nextTick } from 'vue'
import draggable from 'vuedraggable'
import Utils from '../base/utils'
import { Components } from '../components/Components'
import Icon from '../components/Icon.vue'
import { Carousel, Image, RichText, Split, Text, CarouselProps, ImageProps, RichTextProps, SplitProps, TextProps } from '../components/'
import { nanoid } from 'nanoid'

const selectedSectionIdx = ref(-1)
const sections = ref([])
const dragging = ref(false)
const scrollRef = ref(null)
let navShow = true
provide('sections', sections)
provide('selectedSectionIdx', selectedSectionIdx)

const componentList = {
  Carousel,
  Image,
  RichText,
  Split,
  Text
}
const propsList = {
  CarouselProps,
  ImageProps,
  RichTextProps,
  SplitProps,
  TextProps
}

// const PropsComponents = {
//   MultiChoiceProps,
//   SingleChoiceProps
// }

const PropsComponent = computed(() => {
  return selectedSectionIdx.value >= 0 && sections.value ? propsList[sections.value[selectedSectionIdx.value].type + 'Props'] : null
})

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
  var targetArea = document.querySelector('.sections')
  if (!targetArea.contains(elem)) {
    selectedSectionIdx.value = -1
  }
}

function onSectionDropped(e) {
  if (e.moved) {
    selectedSectionIdx.value = e.moved.newIndex
  } else if (e.added) {
    selectedSectionIdx.value = e.added.newIndex
  }
}

function editComponent(e, idx) {
  e.target.blur()
  selectedSectionIdx.value = idx
}

function moveUpItem(idx) {
  if (idx === 0) return
  swapItem(idx, idx - 1)
}

function moveDownItem(idx) {
  if (idx === sections.value.length - 1) return
  swapItem(idx, idx + 1)
}

function moveTopItem(idx) {
  if (idx === 0) return
  swapItem(idx, 0)
}

function moveBottomItem(idx) {
  if (idx === sections.value.length - 1) return
  swapItem(idx, sections.value.length - 1)
}

function swapItem(idx1, idx2) {
  let t = sections.value[idx2]
  sections.value.splice(idx2, 1, sections.value[idx1])
  sections.value[idx1] = t
  selectedSectionIdx.value = idx2
  nextTick(() => {
    fixPos()
  })
}

function copyItem(idx) {
  const newItem = Utils.deepCopyJson(sections.value[idx])
  newItem.id = nanoid()
  sections.value.splice(idx, 0, newItem)
  selectedSectionIdx.value++
  console.log(sections.value)
  nextTick(() => {
    fixPos()
  })
}

function deleteItem(idx) {
  sections.value.splice(idx, 1)
  if (idx < selectedSectionIdx.value) {
    selectedSectionIdx.value--
  } else if (selectedSectionIdx.value === sections.value.length) {
    selectedSectionIdx.value = sections.value.length - 1
  }

  nextTick(() => {
    if (sections.value.length) fixPos()
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

function toggleNav() {
  console.log('toggle')
  if (navShow) {
    document.querySelector('.navs').style.display = 'none'
    document.querySelector('.nav-btn').style.display = 'block'
    navShow = false
    // document.querySelector()
  } else {
    document.querySelector('.navs').style.display = ''
    document.querySelector('.nav-btn').style.display = 'none'
    navShow = true
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

.components {
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
  position: relative;
  min-width: 620px;
  border-right: 1px solid #f1f1fa;
  background: #f0f0f2;
  flex-grow: 2;
}

.sections {
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  width: 375px;
  min-height: 812px;
  background-color: #fff;
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
    background-color: #fff;

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
      border: 2px dotted var(--color-main-highlight);
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
        background: var(--color-main-highlight);
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
      border: 2px solid var(--color-main-highlight);
    }

    &::before {
      z-index: 101;
      border: 2px solid var(--color-main-highlight);
    }
  }

  .show {
    display: block;
  }
}

.sticky {
  position: fixed;
  top: 60px;
}

.props {
  width: 360px;
  min-width: 360px;
}

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

.nav-btn {
  position: absolute;
  display: none;
  top: 15px;
  right: 15px;
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  border: 1px solid #ddd;
  box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.05);
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.navs {
  user-select: none;
  width: 180px;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  // box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.05);
  > .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    background-color: #f1f4f4;
    padding: 12px;
  }
  .text {
    font-size: 14px;
  }
  .close {
    height: 1.2em;
    font-size: 1.2em;
    margin: 0;
    cursor: pointer;
  }

  .item {
    position: relative;
    height: 40px;
    line-height: 40px;
    padding-left: 5px;
    border: 1px solid #f1f1f1;
    background-color: #fff;

    &:hover .handle {
      visibility: visible;
    }
    &:hover .del {
      display: inline-block;
    }
    &.selected {
      border: 1px solid var(--color-main-highlight);
    }
  }
  .item.nav-draggable-chosen {
    background-color: var(--color-main-highlight);
    border: 0;
    color: #fff;
  }

  .handle {
    visibility: hidden;
    color: #999;
    &:hover {
      color: var(--color-main-highlight);
      cursor: move;
    }
    margin: auto 4px;
  }

  .del {
    padding-top: 2px;
    display: none;
    position: absolute;
    right: 8px;

    &:hover {
      color: var(--color-main-highlight);
      cursor: pointer;
    }
  }
}
</style>
