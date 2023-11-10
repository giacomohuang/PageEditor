<template>
  <header :class="{ dragfix: dragging }">
    <div class="title">页面编辑器{{ selectedSectionIdx }},{{ sections.length }},{{ dragging }}</div>
  </header>
  <div class="main-wrap">
    <aside>
      <el-scrollbar :native="false">
        <draggable forceFallback="true" class="components" @start="dragStart" @end="dragEnd" :list="Components" ghost-class="component-ghost" drag-class="component-drag" item-key="id" :sort="false" :clone="dropComponent" :group="{ name: 'comp', pull: 'clone', put: false }">
          <template #item="{ element }">
            <div class="relative">
              <div class="item">
                <div class="icon"><icon :id="element.icon" class="icon handle" /></div>
                <div>{{ element.name }}</div>
              </div>
            </div>
          </template>
        </draggable>
      </el-scrollbar>
    </aside>
    <main @click="onClickOutside">
      <el-scrollbar :native="false" @scroll="handleScroll" ref="scrollRef">
        <div class="sections">
          <!--header -->
          <div class="item" @click.stop="selectedSectionIdx = -100" :class="{ active: selectedSectionIdx === -100, dragfix: dragging }">
            <HeaderNav></HeaderNav>
          </div>
          <div class="tips" v-if="!sections || sections.length == 0">请点击组件或将组件拖动到这里</div>
          <!--body -->
          <draggable forceFallback="true" handle=".handle" scrollSensitivity="200" @start="dragStart" @end="dragEnd" style="min-height: 750px" :list="sections" item-key="id" chosen-class="section-chosen" ghost-class="section-ghost" group="comp" @change="onSectionDropped">
            <template #item="{ element, index }">
              <div>
                <div class="relative">
                  <div class="item handle" :class="{ active: index === selectedSectionIdx, dragfix: dragging }" @mousedown.stop="editComponent($event, index)">
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
          </draggable>
          <!--footer -->
          <div class="item footer" @click.stop="selectedSectionIdx = -200" :class="{ hide: !sectionFooter.enabled, active: selectedSectionIdx === -200, dragfix: dragging }">
            <div>底部</div>
          </div>
        </div>
      </el-scrollbar>
      <div class="nav-btn" @click.stop="toggleNav">
        <el-icon><Memo style="padding-top: 4px" /></el-icon> <span>页面导航</span>
      </div>
    </main>

    <!--页面导航 -->
    <aside class="navs">
      <div class="title">
        <div class="text">页面导航</div>
        <div class="close" @click.stop="toggleNav">
          <el-icon><Close /></el-icon>
        </div>
      </div>
      <el-scrollbar :native="false">
        <draggable forceFallback="true" :options="{ direction: 'vertical' }" class="list" @start="dragStart" @end="dragEnd" :list="sections" item-key="id" handle=".handle" chosen-class="nav-chosen" @change="onSectionDropped">
          <template #header>
            <div class="relative">
              <div @click.stop="selectedSectionIdx = -100" :class="{ selected: selectedSectionIdx === -100, dragfix: dragging }" class="item" style="padding-left: 20px">
                <div class="title">0. 头部导航</div>
              </div>
            </div>
          </template>
          <template #item="{ index, element }">
            <div class="relative">
              <div @click.stop="selectedSectionIdx = index" class="item" :class="{ selected: selectedSectionIdx === index, dragfix: dragging }">
                <div class="title">
                  <icon id="#-ico-handle" class="handle" />
                  <span>{{ index + 1 }}. {{ element.name }}</span>
                  <span class="del" @click.stop="deleteItem(index)"
                    ><el-icon><Delete /></el-icon
                  ></span>
                </div>
              </div>
            </div>
          </template>
          <template #footer>
            <div class="relative">
              <div @click.stop="selectedSectionIdx = -200" :class="{ selected: selectedSectionIdx === -200, dragfix: dragging }" class="item flex-between" style="padding: 0 8px 0 20px">
                <div class="title">{{ sections.length + 1 }}. 底部菜单</div>
                <el-switch v-model="sectionFooter.enabled" size="small" />
              </div>
            </div>
          </template>
        </draggable>
      </el-scrollbar>
    </aside>

    <!--属性 -->
    <aside class="props">
      <div class="title"></div>
      <component :is="PropsComponent" :index="selectedSectionIdx" :key="selectedSectionIdx"></component>
    </aside>
  </div>
</template>

<script setup>
import { provide, ref, computed, nextTick } from 'vue'
import draggable from 'vuedraggable'
import Utils from '../base/utils'
import { Components } from '../components/Components'
import Icon from '../components/Icon.vue'
import { HeaderNav, FooterNav, Carousel, Image, RichText, Split, Text, CarouselProps, HeaderNavProps, FooterNavProps, ImageProps, RichTextProps, SplitProps, TextProps } from '../components/'
import { nanoid } from 'nanoid'

const selectedSectionIdx = ref(-1)
const sections = ref([])
const sectionFooter = ref({ enabled: true })
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
  Text,
  HeaderNav,
  FooterNav
}
const propsList = {
  CarouselProps,
  ImageProps,
  RichTextProps,
  SplitProps,
  TextProps,
  HeaderNavProps,
  FooterNavProps
}

// const PropsComponents = {
//   MultiChoiceProps,
//   SingleChoiceProps
// }

const PropsComponent = computed(() => {
  if (selectedSectionIdx.value === -100) {
    return propsList['HeaderNavProps']
  } else if (selectedSectionIdx.value === -200) {
    return propsList['FooterNavProps']
  } else {
    return selectedSectionIdx.value >= 0 && sections.value ? propsList[sections.value[selectedSectionIdx.value].type + 'Props'] : null
  }
})

function dragStart() {
  dragging.value = true
  //fix Draggble css
  let ElList = document.querySelectorAll('.components>div:not(.component-drag)')
  ElList.forEach((item) => {
    item.classList.add('nohover')
  })
  // console.log(document.querySelector('.sortable-drag'))
  // document.querySelector('.sortable-drag').style.height = document.querySelector('.section-ghost').offsetHeight + 'px'
}

function dragEnd() {
  dragging.value = false
  //fix Draggble css
  let ElList = document.querySelectorAll('.components>div:not(.component-drag)')
  ElList.forEach((item) => {
    item.classList.remove('nohover')
  })
}

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
  const rect = document.querySelector('.sections .item.active').getBoundingClientRect()
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
.dragfix {
  pointer-events: none;
}

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
  .item {
    width: 80px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: var(--color-main-highlight);
      color: #fff;
    }
  }
  .icon {
    font-size: 40px;
    height: 46px;
    width: 40px;
    padding: 0;
    margin: 0;
  }
  .nohover .item:hover {
    background-color: #fff;
    color: var(--color-text);
  }
}

.component-drag .item {
  background-color: var(--color-main-highlight);
  color: #fff;
}

.component-ghost .item {
  background-color: #fff;
  color: var(--color-text);
}

main {
  // position: relative;
  min-width: 620px;
  flex: 1;
  border-right: 1px solid #f1f1fa;
  background: #f0f0f2;
}

.sections {
  position: relative;
  margin: 0 auto;
  width: 375px;
  min-height: 812px;
  background-color: #fff;
  margin: 40px auto 100px auto;
  user-select: none;
  box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.05);

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
  .flex-start {
    align-self: flex-start;
  }
  .item {
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
      position: relative;
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

.section-chosen {
  pointer-events: auto;
  .oprs {
    display: none;
  }
}

.section-ghost {
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
  height: 200px;

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
  box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.05);
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
    height: 1em;
    font-size: 1em;
    margin: 0;
    cursor: pointer;
  }

  .item {
    position: relative;
    display: flex;
    line-height: 40px;
    border: 1px solid #f1f1f1;
    background-color: #fff;

    .title {
      display: flex;
      align-items: center;
    }

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

  .handle {
    margin: 0px 3px 0 3px;
    visibility: hidden;
    color: #999;
    width: 1.2em;
    height: 1.2em;
    &:hover {
      color: var(--color-main-highlight);
      cursor: move;
    }
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

  .footer {
    height: 40px;
  }
}

.nav-chosen .item {
  background-color: var(--color-main-highlight) !important;
  color: #fff !important;
}

.props {
  width: 360px;
  min-width: 360px;
}
</style>
