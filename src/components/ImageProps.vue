<template>
  <el-button size="default" @click="dialogSetMapArea = true">配置热区</el-button>

  <el-dialog v-model="dialogSetMapArea" title="Tips" width="1200">
    <template #header
      >{{ mousex }},{{ mousey }}
      <div id="bbbb">zzz</div>
      <div id="aaaa">zzz</div>
    </template>
    <div class="wrap">
      <div class="rect-editor">
        <svg id="canvas" width="640" height="360" class="canvas" @mousedown.stop()="onMouseDownCanvas">
          <g v-for="(mapArea, index) in data.mapAreas" :id="'group_' + mapArea.id">
            <rect :id="'rect_' + mapArea.id" :x="mapArea.x" :y="mapArea.y" :width="mapArea.width" :height="mapArea.height" :fill="mapArea.fill" :key="mapArea.id" @mousedown="onMouseDownRect($event, index)"></rect>
          </g>
          <g id="ctrl_group" v-show="editingId !== ''">
            <circle id="ctrl_nw" r="4" class="ctrl_point" @mousedown.stop="onMouseDownPoint"></circle>
            <circle id="ctrl_ne" r="4" class="ctrl_point" @mousedown.stop="onMouseDownPoint"></circle>
            <circle id="ctrl_sw" r="4" class="ctrl_point" @mousedown.stop="onMouseDownPoint"></circle>
            <circle id="ctrl_se" r="4" class="ctrl_point" @mousedown.stop="onMouseDownPoint"></circle>
          </g>
        </svg>
        <img :src="data.img" style="height: 100%; width: 100%; pointer-events: none; user-drag: none" />
      </div>
      <el-scrollbar :native="false">
        <div class="setting">
          <ul class="list">
            <li v-for="(mapArea, index) in data.mapAreas" :key="mapArea.id" class="item">
              <div class="pal" :style="{ 'background-color': mapArea.fill }">{{ index + 1 }}</div>
              <el-input class="input" v-model="mapArea.link"> </el-input><span @click="removeRect(index)" class="remove">x</span>
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="clearMapArea">清空热区</el-button>
        <el-button @click="dialogSetMapArea = false">取消</el-button>
        <el-button type="primary" @click="dialogSetMapArea = false"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElCheckTag } from 'element-plus'
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { nanoid } from 'nanoid'
const sections = inject('sections')
const selectedSectionIdx = inject('selectedSectionIdx')
const data = sections.value[selectedSectionIdx.value].data
const dialogSetMapArea = ref(false)
const imgWidth = 640
const imgHeight = 360
data.mapAreas = data.mapAreas || []
const mousex = ref(0)
const mousey = ref(0)
const SVG_NS = 'http://www.w3.org/2000/svg'
const editingId = ref('')

// watch(editingId,async(newValue) => {
//   if (newValue === '')

// })
onMounted(() => {
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('keydown', keyDown)
})

onUnmounted(() => {
  console.log('unmounted')
  document.removeEventListener('mousemove', mouseMove)
  document.removeEventListener('keydown', keyDown)
})

function mouseMove(e) {
  const el = document.getElementsByClassName('canvas')
  // console.log(el)
  if (!el || el.length === 0) return
  const obj = el[0].getBoundingClientRect()
  // console.log(obj)
  mousex.value = e.clientX - obj.x
  mousey.value = e.clientY - obj.y
}

function keyDown(e) {
  console.log(e.key)
  switch (e.key) {
    //backspace
    case 'Backspace':
      // console.log('backspace')
      if (editingId.value !== '') {
        data.mapAreas.splice(getMapAreaById(editingId.value), 1)
        editingId.value = ''
      }
      break
  }
}

function getMapAreaById(id) {
  for (let i = 0; i < data.mapAreas.length; i++) {
    if (data.mapAreas[i].id === id) {
      return i
    }
  }
}

function clearMapArea() {
  // console.log('deleted')
  data.mapAreas = []
  editingId.value = ''
}

function removeRect(index) {
  data.mapAreas.splice(index, 1)
  editingId.value = ''
}

function onMouseDownCanvas(e) {
  const bound = e.currentTarget.getBoundingClientRect()
  const start = {}
  const end = {}
  const rectColor = ['#FF000080', '#2D00FF80', '#FF8F0080', '#79CB2680', '#B826CB80', '#CB812680']
  start.x = e.clientX - bound.x
  start.y = e.clientY - bound.y
  if (isInObject(start.x, start.y)) {
    return
  }

  data.mapAreas.push({ id: nanoid(), x: start.x, y: start.y, width: 0, height: 0, fill: rectColor[data.mapAreas.length % rectColor.length] })
  // console.log(getRadomElement(rectColor))
  // console.log('down', start.x, start.y)
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('mouseup', mouseUp)
  function mouseMove(e) {
    end.x = e.clientX - bound.x
    end.y = e.clientY - bound.y

    const mapArea = data.mapAreas[data.mapAreas.length - 1]
    // 边界检测
    if (end.x < 0) end.x = 0
    if (end.y < 0) end.y = 0
    if (end.x > imgWidth) end.x = imgWidth
    if (end.y > imgHeight) end.y = imgHeight
    document.getElementById('aaaa').innerHTML = 'start:' + JSON.stringify(start) + ' end:' + JSON.stringify(end)
    // 碰撞检测
    let rectDrag = { x: end.x < start.x ? end.x : start.x, y: end.y < start.y ? end.y : start.y, width: Math.abs(start.x - end.x), height: Math.abs(start.y - end.y) }
    rectDrag = hitTest(rectDrag, start, end, mapArea.id)
    mapArea.x = rectDrag.x
    mapArea.y = rectDrag.y
    mapArea.width = rectDrag.width
    mapArea.height = rectDrag.height
  }
  function mouseUp() {
    const rect = data.mapAreas[data.mapAreas.length - 1]
    if (rect.width == 0 || rect.height == 0) data.mapAreas.pop()
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('mouseup', mouseUp)
  }
}

function isIntersect(rect1, rect2) {
  return rect2.x < rect1.x + rect1.width && rect2.y < rect1.y + rect1.height && rect2.x + rect2.width > rect1.x && rect2.y + rect2.height > rect1.y
}

function hitTest(rectDrag, start, end, id) {
  for (let i = 0; i < data.mapAreas.length; i++) {
    const rect = data.mapAreas[i]
    if (rect.id === id) continue
    const delta = {}
    delta.x = start.x < end.x ? Math.abs(end.x - rect.x) : Math.abs(end.x - rect.x - rect.width)
    delta.y = start.y < end.y ? Math.abs(end.y - rect.y) : Math.abs(end.y - rect.y - rect.height)
    if (isIntersect(rect, rectDrag)) {
      // console.log('hit', i)
      // 从上边碰撞
      if (start.x >= rect.x && start.y <= rect.y && start.x <= rect.x + rect.width) {
        console.log('上' + i)
        rectDrag.height = Math.abs(start.y - rect.y)
      }
      // 从左上碰撞
      else if (start.x < rect.x && start.y < rect.y) {
        // console.log('左上' + i)
        if (delta.x > delta.y) {
          rectDrag.height = Math.abs(start.y - rect.y)
        } else {
          rectDrag.width = Math.abs(start.x - rect.x)
        }
      }
      // 从左边碰撞
      else if (start.x <= rect.x && start.y >= rect.y && start.y < rect.y + rect.height) {
        // console.log('左' + i)
        rectDrag.width = Math.abs(start.x - rect.x)
        // rectDrag.x=rect.x+rect.wifth
      }
      // 从左下碰撞
      else if (start.x <= rect.x && start.y >= rect.y + rect.height) {
        // console.log('左下' + i)
        if (delta.x > delta.y) {
          rectDrag.y = rect.y + rect.height
          rectDrag.height = Math.abs(start.y - rect.y - rect.height)
        } else {
          rectDrag.width = Math.abs(start.x - rect.x)
        }
      }
      // 从下面碰撞
      else if (start.y >= rect.y + rect.height && start.x >= rect.x && start.x < rect.x + rect.width) {
        // console.log('下面' + i)
        rectDrag.y = rect.y + rect.height
        rectDrag.height = Math.abs(start.y - rect.y - rect.height)
      }
      // 从右下碰撞
      else if (start.x >= rect.x + rect.width && start.y >= rect.y + rect.height) {
        // console.log('右下' + i)
        if (delta.x > delta.y) {
          rectDrag.y = rect.y + rect.height
          rectDrag.height = Math.abs(start.y - rect.y - rect.height)
        } else {
          rectDrag.x = rect.x + rect.width
          rectDrag.width = Math.abs(start.x - rect.x - rect.width)
        }
      }
      // 从右边碰撞
      else if (start.x >= rect.x + rect.width && start.y < rect.y + rect.height && start.y > rect.y) {
        // console.log('右面' + i)
        rectDrag.x = rect.x + rect.width
        rectDrag.width = Math.abs(start.x - rect.x - rect.width)
      }
      // 从右上碰撞
      else if (start.x >= rect.x + rect.width && start.y < rect.y) {
        // console.log('右上' + i)
        if (delta.x > delta.y) {
          rectDrag.height = Math.abs(start.y - rect.y)
        } else {
          rectDrag.x = rect.x + rect.width
          rectDrag.width = Math.abs(start.x - rect.x - rect.width)
        }
      }
    }
  }
  // console.log(rectDrag)
  return rectDrag
}

function getRadomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function isInObject(x, y) {
  let flag = false
  for (let i = 0; i < data.mapAreas.length; i++) {
    const rect = data.mapAreas[i]
    if (x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height) {
      flag = true
    }
  }
  return flag
}

function onMouseDownRect(ev, index) {
  const mapArea = data.mapAreas[index]
  const bound = document.getElementById('canvas').getBoundingClientRect()
  const editingEl = document.getElementById('group_' + mapArea.id)
  const ctrlGroupEl = document.getElementById('ctrl_group')
  const start = {}
  const end = {}
  const dx = ev.clientX - bound.x - mapArea.x
  const dy = ev.clientY - bound.y - mapArea.y
  editingId.value = mapArea.id
  // ctrlGroupEl.style.display = ''

  updatePoint('ctrl_nw', mapArea.x, mapArea.y)
  updatePoint('ctrl_ne', mapArea.x + mapArea.width, mapArea.y)
  updatePoint('ctrl_sw', mapArea.x, mapArea.y + mapArea.height)
  updatePoint('ctrl_se', mapArea.x + mapArea.width, mapArea.y + mapArea.height)
  document.addEventListener('mouseup', mouseUp)
  document.addEventListener('mousemove', mouseMove)
  function mouseMove(ev) {
    const temp = {}
    temp.x = ev.clientX - bound.x - dx
    temp.y = ev.clientY - bound.y - dy
    temp.width = mapArea.width
    temp.height = mapArea.height
    for (let i = 0; i < data.mapAreas.length; i++) {
      if (i === index) continue
      const rect = data.mapAreas[i]
      if (isIntersect(temp, rect)) {
        if (temp.x + temp.width > rect.x) {
          temp.x = rect.x - mapArea.width
        } else if (temp.x < rect.x + rect.width) {
          temp.x = rect.x + rect.width
        }
      }
    }
    if (temp.x < 0) temp.x = 0
    else if (temp.x + temp.width > imgWidth) temp.x = imgWidth - temp.width
    if (temp.y < 0) temp.y = 0
    else if (temp.y + temp.height > imgHeight) temp.y = imgHeight - temp.height

    // if (temp.x < 0) temp.x = 0
    // if (temp.y < 0) temp.y = 0
    mapArea.x = temp.x
    mapArea.y = temp.y
    updatePoint('ctrl_nw', mapArea.x, mapArea.y)
    updatePoint('ctrl_ne', mapArea.x + mapArea.width, mapArea.y)
    updatePoint('ctrl_sw', mapArea.x, mapArea.y + mapArea.height)
    updatePoint('ctrl_se', mapArea.x + mapArea.width, mapArea.y + mapArea.height)
  }
  function mouseUp() {
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('mouseup', mouseUp)
  }
}

function onMouseDownPoint(ev) {
  const pointId = ev.target.id
  const bound = document.getElementById('canvas').getBoundingClientRect()
  const mapArea = data.mapAreas[getMapAreaById(editingId.value)]
  const ma = JSON.parse(JSON.stringify(mapArea))
  // const start = { x: mapArea.x, y: mapArea.y }
  // const end = { x: mapArea.x + mapArea.width, y: mapArea.y + mapArea.height }
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  function onMouseMove(e) {
    e.stopPropagation()
    const start = {}
    const end = {}

    end.x = e.clientX - bound.x
    end.y = e.clientY - bound.y

    switch (pointId) {
      case 'ctrl_nw':
        start.x = ma.x + ma.width
        start.y = ma.y + ma.height
        break
      case 'ctrl_ne':
        start.x = ma.x
        start.y = ma.y + ma.height
        break
      case 'ctrl_sw':
        start.x = ma.x + ma.width
        start.y = ma.y
        break
      case 'ctrl_se':
        start.x = ma.x
        start.y = ma.y
        break
    }

    if (start.x < 0) start.x = 0
    if (start.y < 0) start.y = 0
    if (end.x < 0) end.x = 0
    if (end.y < 0) end.y = 0
    if (start.x > imgWidth) start.x = imgWidth
    if (start.y > imgHeight) start.y = imgHeight
    if (end.x > imgWidth) end.x = imgWidth
    if (end.y > imgHeight) end.y = imgHeight

    document.getElementById('aaaa').innerHTML = 'start:' + JSON.stringify(start) + ' end:' + JSON.stringify(end)
    let rectDrag = { x: end.x < start.x ? end.x : start.x, y: end.y < start.y ? end.y : start.y, width: Math.abs(start.x - end.x), height: Math.abs(start.y - end.y) }
    rectDrag = hitTest(rectDrag, start, end, mapArea.id)
    mapArea.x = rectDrag.x
    mapArea.y = rectDrag.y
    mapArea.width = rectDrag.width
    mapArea.height = rectDrag.height

    // dx = end.x
    // dy = end.y

    updatePoint('ctrl_nw', mapArea.x, mapArea.y)
    updatePoint('ctrl_ne', mapArea.x + mapArea.width, mapArea.y)
    updatePoint('ctrl_sw', mapArea.x, mapArea.y + mapArea.height)
    updatePoint('ctrl_se', mapArea.x + mapArea.width, mapArea.y + mapArea.height)
    document.getElementById('bbbb').innerHTML = JSON.stringify(mapArea)
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
}

function updatePoint(id, x, y) {
  const p = document.getElementById(id)
  p.setAttribute('cx', x)
  p.setAttribute('cy', y)
}
</script>

<style scoped lang="scss">
.wrap {
  display: flex;
  flex-direction: row;
  width: 1200px;
}
.rect-editor {
  position: relative;
  width: 640px;
  height: 360px;
  ::selection {
    background-color: transparent;
  }
}
.setting {
  margin-left: 12px;
  .list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    height: 360px;

    li {
      display: flex;
      height: 40px;
      padding-right: 20px;
      align-items: center;
    }
  }
  .pal {
    display: flex;
    width: 20px;
    height: 20px;

    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-radius: 5px;
  }
  .input {
    margin-left: 10px;
    width: 200px;
  }
  .remove {
    border: 1px solid #d9d9d9;
    display: flex;
    width: 32px;
    height: 32px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    margin-left: 5px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    color: #999;
    cursor: pointer;
    &:hover {
      background: rgb(235, 134, 76);
      border: 1px solid rgb(235, 134, 76);
      color: #fff;
    }
  }
}

.canvas {
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid red;
  // top: 0;
}
</style>

<style>
.ctrl_point {
  fill: #fff;
  stroke: #666;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.ctrl_point:hover {
  fill: #ccc;
  stroke-width: 10;
}

#ctrl_nw:hover,
#ctrl_se:hover {
  cursor: nwse-resize;
}
#ctrl_ne:hover,
#ctrl_sw:hover {
  cursor: nesw-resize;
}
</style>
