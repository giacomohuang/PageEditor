<template>
  <header :class="{ dragfix: dragging }">
    <div class="title">微页面编辑器</div>
    <div class="page-title">{{ sectionHeader.title }}</div>
    <div class="oprs">
      <el-button>预览</el-button>
      <el-button>保存</el-button>
      <el-button>退出</el-button>
    </div>
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
      <div style="margin: 8px 12px; position: absolute; z-index: 150">
        <el-radio-group size="small">
          <el-radio-button label="小程序" value="小程序" />
          <el-radio-button label="H5" value="H5" />
          <el-radio-button disabled label="Android" value="Android" />
          <el-radio-button disabled label="iOS" value="iOS" />
        </el-radio-group>
      </div>
      <el-scrollbar :native="false" ref="scrollRef">
        <div class="sections" :class="{ grayscale: sectionHeader.grayscale === 'all' }" :style="{ 'background-color': utils.rgba2hex(sectionHeader.bgColor.color) }">
          <!--header -->
          <div class="item no-drag" @click.stop="selectedSectionIdx = -10" :class="{ active: selectedSectionIdx === -10, dragfix: dragging }">
            <HeaderNav></HeaderNav>
          </div>
          <div class="tips" v-if="!sections || sections.length == 0">请将组件拖动到这里</div>
          <!--body -->
          <draggable forceFallback="true" handle=".handle" scrollSensitivity="200" @start="dragStart" @end="dragEnd" class="body" :list="sections" item-key="id" chosen-class="section-chosen" ghost-class="section-ghost" group="comp" @change="onSectionDropped">
            <template #item="{ element, index }">
              <div class="lh0">
                <div class="relative">
                  <div class="item handle" :class="{ active: index === selectedSectionIdx, dragfix: dragging }" @mousedown.stop="editComponent($event, index)">
                    <component :is="componentList[element.type]" :index="index" :key="element.id"></component>
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
                    <li @click.stop="copyItem(index)">
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
          <div class="item footer no-drag" @click.stop="selectedSectionIdx = -20" :class="{ hide: !sectionFooter.enabled, active: selectedSectionIdx === -20, dragfix: dragging }">
            <FooterNav></FooterNav>
          </div>
          <div class="size-mark ip8">iPhone 6/7/8 屏幕高度</div>
          <div class="size-mark ipx">iPhone X 屏幕高度</div>
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
        <div class="relative">
          <div class="item" :class="{ selected: selectedSectionIdx === -10, dragfix: dragging }" @click.stop="selectedSectionIdx = -10">
            <icon id="#-ico-disallow" class="disallow" />
            <span>0. 页面和标题栏</span>
          </div>
        </div>
        <draggable class="list" :list="sections" item-key="id" handle=".handle" chosen-class="nav-chosen" ghost-class="nav-ghost" @change="onSectionDropped">
          <template #item="{ index, element }">
            <div class="relative">
              <div class="item" :class="{ selected: selectedSectionIdx === index, dragfix: dragging }" @click.stop="selectedSectionIdx = index">
                <icon id="#-ico-handle" class="handle" />
                <span>{{ index + 1 }}. {{ element.name }}</span>
                <span class="del" @click.stop="deleteItem(index)">
                  <el-icon><Delete /></el-icon>
                </span>
              </div>
            </div>
          </template>
        </draggable>
        <div class="relative">
          <div class="item" :class="{ selected: selectedSectionIdx === -20, dragfix: dragging }" @click.stop="selectedSectionIdx = -20">
            <icon id="#-ico-disallow" class="disallow" />
            <span class="">{{ sections.length + 1 }}. 固底导航</span>
            <el-switch class="switch" v-model="sectionFooter.enabled" @change="toggleFooter" size="small" />
          </div>
        </div>
      </el-scrollbar>
    </aside>

    <!--属性 -->
    <aside class="props" :class="{ dragfix: dragging }">
      <el-scrollbar :native="false">
        <component :is="PropsComponent" :key="selectedSectionIdx"></component>
      </el-scrollbar>
    </aside>
  </div>
</template>

<script setup>
import { provide, ref, computed, nextTick, defineAsyncComponent, watch } from 'vue'
import draggable from 'vuedraggable'
import utils from '../base/utils'
import { Components, propsList, componentList } from '../components/Components'
import { nanoid } from 'nanoid'

const selectedSectionIdx = ref(-1)
const sections = ref([])
const sectionHeader = ref({
  title: '默认页面',
  bgColor: { color: { r: 235, g: 235, b: 235, a: 1 } },
  grayscale: 'off',
  navStyle: '',
  navBgColor: { color: { r: 255, g: 255, b: 255, a: 1 } }
})

const sectionFooter = ref({
  enabled: true,
  style: 'normal',
  btnNum: 5,
  btns: [
    { title: '首页', imgUrl: '', link: '' },
    { title: '商户', imgUrl: '', link: '' },
    { title: '活动', imgUrl: '', link: '' },
    { title: '停车', imgUrl: '', link: '' },
    { title: '我的', imgUrl: '', link: '' }
  ]
})

const dragging = ref(false)
const scrollRef = ref(null)
const HeaderNav = defineAsyncComponent(() => import('../components/HeaderNav.vue'))
const FooterNav = defineAsyncComponent(() => import('../components/FooterNav.vue'))
let navShow = true
let sectionsChanged = false

provide('selectedSectionIdx', selectedSectionIdx)
provide('sections', sections)
provide('sectionHeader', sectionHeader)
provide('sectionFooter', sectionFooter)

// 监听内容变更
const changedWatcher = watch(
  sections,
  () => {
    console.log('changed')
    sectionsChanged = true
    // 停止监听
    changedWatcher()
  },
  { deep: true }
)

const PropsComponent = computed(() => {
  const idx = selectedSectionIdx.value
  if (idx === -10) {
    return propsList.HeaderNavProps
  } else if (idx === -20) {
    return propsList.FooterNavProps
  } else {
    return idx >= 0 && sections.value ? propsList[sections.value[idx].type + 'Props'] : null
  }
})
toggleFooter()
// document.documentElement.setAttribute('theme', 'dark')

function toggleFooter() {
  let root = document.documentElement
  if (sectionFooter.value.enabled) {
    root.style.setProperty('--section-minheight', '639px')
  } else {
    root.style.setProperty('--section-minheight', '722px')
  }
}

function dragStart() {
  dragging.value = true
  // fix hover css problem when dragging
  let ElList = document.querySelectorAll('.components>div:not(.component-drag)')
  ElList.forEach((item) => {
    item.classList.add('nohover')
  })
}

function dragEnd() {
  dragging.value = false
  // fix hover css problem when dragging
  let ElList = document.querySelectorAll('.components>div:not(.component-drag)')
  ElList.forEach((item) => {
    item.classList.remove('nohover')
  })
}

function dropComponent(payload) {
  payload.id = nanoid()
  return utils.deepCopyJson(payload)
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
    // Fix the out-of-range index bug in vuedraggable when dynamically loading components
    if (e.moved.newIndex > sections.value.length - 1) {
      selectedSectionIdx.value = sections.value.length - 1
    } else {
      selectedSectionIdx.value = e.moved.newIndex
    }
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
  const newItem = utils.deepCopyJson(sections.value[idx])
  newItem.id = nanoid()
  sections.value.splice(idx, 0, newItem)
  selectedSectionIdx.value++
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

<style>
@import '../assets/theme.scss';
</style>

<style lang="scss" scoped>
:root {
  --section-minheight: 722px;
}

.dragfix {
  pointer-events: none;
}

// .grayscale::before {
//   content: '';
//   position: absolute;
//   inset: 0;
//   backdrop-filter: grayscale(95%);
//   z-index: 1000;
//   height: 812px;
//   pointer-events: none;
// }

.lh0 {
  line-height: 0;
}

.strip {
  background-size: 8px 8px; /* 控制条纹的大小 */
  background-color: rgb(147, 202, 236);
  background-image: -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0.25, rgba(255, 255, 255, 0.2)), color-stop(0.25, transparent), color-stop(0.5, transparent), color-stop(0.5, rgba(255, 255, 255, 0.2)), color-stop(0.75, rgba(255, 255, 255, 0.2)), color-stop(0.75, transparent), to(transparent));
  background-image: -moz-linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);
  background-image: -o-linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);
  background-image: linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);
}

header {
  display: flex;
  position: sticky;
  align-items: center;
  min-width: 1440px;
  height: 64px;
  font-size: 16px;
  background-color: var(--color-main-highlight);
  color: #fff;
  justify-items: flex-start;
  z-index: 0;

  .title {
    margin: 0 20px;
    font-size: 22px;
    line-height: 20px;
    font-weight: bold;
  }
  .page-title {
    font-size: 16px;
    line-height: 16px;
    padding: 0 20px;
    border-left: 1px solid #aaa;
    color: #eee;
    flex: 1;
  }
  .oprs {
    font-size: 14px;
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
  position: relative;
  min-width: 620px;
  flex: 1;
  border-right: 1px solid #f1f1fa;
  background: #f0f0f2;
}

.sections {
  position: relative;
  margin: 0 auto;
  width: 375px;
  margin: 50px auto 100px auto;
  user-select: none;
  -webkit-user-select: none;
  box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.05);
  .body {
    min-height: var(--section-minheight);
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
  .flex-start {
    align-self: flex-start;
  }
  .item {
    position: relative;
    user-select: none;
    -webkit-user-select: none;
    z-index: 102;
    // box-sizing: content-box;
    &::before {
      content: '';
      position: absolute;
      width: 379px;
      height: calc(100% + 2px);
      left: -2px;
      top: -2px;
      box-sizing: border-box;
      border: 0;
      z-index: 1;
    }
    &:not(.no-drag)::before {
      cursor: move;
    }
    &:hover::before {
      border: 2px dotted var(--color-main-highlight);
    }
  }

  .oprs {
    position: absolute;
    display: none;
    left: 375px;
    top: -2px;
    z-index: 101;
    background: #fff;
    border: 1px solid #cccccc;
    border-radius: 0 4px 4px 0;
    box-shadow: 2px 0px 2px 0px rgba(0, 0, 0, 0.05);
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
      z-index: 1;
      border: 2px solid var(--color-main-highlight);
    }

    &::before {
      z-index: 1;
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
  @extend .strip;
  box-shadow: none;
  border-radius: 0;
  border: 0;
  list-style: none;
  height: 48px;

  div {
    display: none;
  }
}

.size-mark {
  position: absolute;
  color: #999;
  border-top: 1px dashed #ccc;
  padding: 2px 12px 12px;
  left: 375px;
  white-space: nowrap;
  font-size: 12px;
  &.ip8 {
    top: 667px;
  }
  &.ipx {
    top: 812px;
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
  -webkit-user-select: none;
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
    border: 1px solid var(--color-split);
    background-color: #fff;
    align-items: center;

    &:hover .handle {
      visibility: visible;
    }
    &:hover .disallow {
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
    font-size: 14px;
    margin: 0px 3px 0 3px;
    visibility: hidden;
    color: #999;
    &:hover {
      color: var(--color-main-highlight);
      cursor: move;
    }
  }

  .disallow {
    font-size: 14px;
    margin: 0px 3px 0 3px;
    visibility: hidden;
    color: #ccc;
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

  .switch {
    position: absolute;
    right: 8px;
  }

  .footer {
    height: 40px;
  }
}

.nav-chosen .item {
  background-color: var(--color-main-highlight) !important;
  border: 1px solid var(--color-main-highlight);
  color: #fff !important;
}

.nav-ghost {
  @extend .strip;
  * {
    visibility: hidden;
  }
}

.props {
  width: 360px;
  min-width: 360px;
}
</style>
