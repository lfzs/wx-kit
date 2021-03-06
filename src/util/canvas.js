/*
  在页面的 wxml 中需要提前声明
  <canvas id="canvas" type="2d" style="position:fixed; left: 100vw;" />
*/

import { ui, wxp } from '@/util'

let CTX, canvas
export default async function({ id = 'canvas', width = 300, height = 150, config = [], cvs }) { // 可传入 canvas 实例 cvs
  canvas = cvs || await getCanvas(id)

  const { pixelRatio } = ui.getSystemInfo()
  canvas.width = width * pixelRatio
  canvas.height = height * pixelRatio

  CTX = canvas.getContext('2d')
  CTX.scale(pixelRatio, pixelRatio)

  await start(config)
  const { tempFilePath } = await wxp.canvasToTempFilePath({ canvas })
  return tempFilePath
}

async function start(config) {
  const TYPE = {
    'image': drawImage,
    'text': drawText,
    'background': drawBackground,
  }

  for (const item of config) {
    const fn = TYPE[item.type?.toLowerCase()]
    fn && await fn(item)
  }
}

function drawImage(config) {
  const { top, left, width, height, url, round } = config

  const img = canvas.createImage()
  img.src = url
  return new Promise((resolve, reject) => {
    // 绘制图片时宽度 100% 垂直方向居中截取
    img.onload = () => {
      CTX.save()
      CTX.beginPath()
      CTX.rect(left, top, width, height)
      CTX.clip()
      if (round) { // 如果指定半径，将将会以该矩形中心绘制圆形
        const x = (left + width) / 2
        const y = (top + height) / 2
        CTX.beginPath()
        CTX.arc(x, y, round, 0, 2 * Math.PI)
        CTX.clip()
      }
      const newHeight = width / img.width * img.height
      const topOffset = (newHeight - height) / 2
      CTX.drawImage(img, left, top - topOffset, width, newHeight)
      CTX.restore()
      resolve()
    }
    img.onerror = reject
  })
}

function drawText(config) {
  const { text, left, top, color, maxWidth, maxLine, strokeColor, lineWidth = 1, textAlign = 'left', fontSize = 10, lineHeight = config.fontSize || 10, baseline = 'top' } = config
  CTX.save()
  CTX.textAlign = textAlign
  CTX.fillStyle = color
  CTX.lineWidth = lineWidth
  CTX.strokeStyle = strokeColor
  CTX.textBaseline = baseline
  CTX.font = `${fontSize}px sans-serif` // 斜体、加粗 真机暂时无效

  const lines = getTextLines(canvas, { text, fontSize, maxWidth, maxLine })

  lines.map((item, index) => {
    const args = [item, left, top + (lineHeight * index)].concat(maxWidth === undefined ? [] : [maxWidth]) // maxWidth 要么有值要么不传，传 undefined 真机无效
    CTX.fillText(...args)
    strokeColor && CTX.strokeText(...args) // 有设置描边颜色，就描边(配合 lineWidth 可以用来实现文字加粗)
  })
  CTX.restore()
}

function drawBackground(config) {
  const { top, left, width, height, color } = config
  CTX.save()
  CTX.fillStyle = color
  CTX.fillRect(left, top, width, height)
  CTX.restore()
}

// 传入 text 配置 => 返回每一行的文字数组 maxLine 不传将计算所有
export function getTextLines(canvas, { text, fontSize, maxWidth, maxLine }) {
  const ctx = canvas.getContext('2d')
  ctx.save()
  ctx.font = `${fontSize}px sans-serif`

  const { width } = ctx.measureText(text)
  if (!maxWidth || width < maxWidth) return [text]

  const lines = [''] // 每一行的文字
  let isOver = false // 文字是否多余

  for (const word of text) {
    const last = lines[lines.length - 1]
    const { width } = ctx.measureText(last)

    if (width < maxWidth) lines[lines.length - 1] = `${last}${word}`
    else {
      if (maxLine && lines.length >= maxLine) {
        isOver = true
        break
      }
      lines.push(word)
    }
  }

  if (isOver) {
    const last = lines[lines.length - 1]
    lines[lines.length - 1] = `${last.substring(0, last.length - 1)}...`
  }

  ctx.restore()
  return lines
}

// 获取 canvas 实例
export function getCanvas(id) {
  return new Promise((resolve, reject) => {
    try {
      wx.createSelectorQuery()
        .select(`#${id}`)
        .fields({ node: true, size: true })
        .exec(res => resolve(res[0].node))
    } catch (error) {
      reject(error)
    }
  })
}
