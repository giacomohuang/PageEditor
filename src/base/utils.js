const utils = {
  deepCopyJson(obj) {
    return JSON.parse(JSON.stringify(obj))
  },

  createEnum(definition) {
    const strToValueMap = {}
    const numToDescMap = {}
    for (const enumName of Object.keys(definition)) {
      const [value, desc] = definition[enumName]
      strToValueMap[enumName] = value
      numToDescMap[value] = desc
    }
    return {
      ...strToValueMap,
      getDesc(enumName) {
        return (definition[enumName] && definition[enumName][1]) || ''
      },
      getDescFromValue(value) {
        return numToDescMap[value] || ''
      }
    }
  },
  rgba2hex(obj) {
    if (!obj) return ''
    const r = obj.r.toString(16).padStart(2, '0')
    const g = obj.g.toString(16).padStart(2, '0')
    const b = obj.b.toString(16).padStart(2, '0')
    const a = Math.floor(obj.a * 255)
      .toString(16)
      .padStart(2, '0')
    return `#${r}${g}${b}${a}`
  },
  hex2rgba(hex) {
    let [r, g, b, a = 255] = hex.match(/\w\w/g).map((v) => parseInt(v, 16))
    a = a / 255
    return { r: r, g: g, b: b, a: a.toFixed(1) }
  },
  setStyle(item, value) {
    let root = document.documentElement
    root.style.setProperty(item, value)
  },
  getTime() {
    const now = new Date()
    const hour = ('0' + now.getHours()).slice(-2)
    const min = ('0' + now.getMinutes()).slice(-2)
    return `${hour}:${min}`
  }
}

export default utils
