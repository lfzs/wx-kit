/*
  在 wxml 中需要提前声明
  <canvas canvas-id="canvas" style="width: 375px; height: 375px; background-color: red;"/>
*/

let CTX
export default function(canvasId, config = []) {
  CTX = wx.createCanvasContext(canvasId)

  config.forEach(item => {
    const type = item.type?.toLowerCase()
    switch (type) {
      case 'image':
        drawImage(item)
        break
      case 'text':
        drawText(item)
        break
      case 'background':
        drawBackground(item)
        break
    }
  })

  return new Promise((resolve, reject) => {
    CTX.draw(false, () => wx.canvasToTempFilePath({ canvasId, quality: 1, success: resolve, fail: reject }))
  })
}

function drawImage(config) {
  // info 为 wx.getImageInfo 的信息，即图片的真实宽高
  const { top, left, width, height, url, info } = config
  if (info) {
    // aspectFill 模式，水平100%，垂直居中截取
    CTX.save()
    CTX.beginPath()
    CTX.rect(left, top, width, height)
    CTX.clip()
    const newHeight = width / info.width * info.height
    const topOffset = newHeight > height ? (newHeight - height) / 2 : 0
    CTX.drawImage(url, left, top - topOffset, width, newHeight)
    CTX.restore()
  } else {
    CTX.drawImage(url, left, top, width, height)
  }
}

function drawText(config) {
  const { text, fontSize, left, top, color, maxWidth, maxLine = 1, textAlign = 'left', lineHeight = config.fontSize } = config
  CTX.setFontSize(fontSize)
  CTX.setTextAlign(textAlign)
  CTX.setFillStyle(color)
  CTX.setTextBaseline('top')

  const lines = getTextLines(CTX, { text, fontSize, maxWidth, maxLine })
  lines.map((item, index) => CTX.fillText(item, left, top + (lineHeight * index), maxWidth))
}

function drawBackground(config) {
  const { top, left, width, height, color } = config
  CTX.setFillStyle(color)
  CTX.fillRect(left, top, width, height)
}

// 传入 text 配置 => 返回每一行的文字数组
export function getTextLines(ctx, { text, fontSize, maxWidth, maxLine }) { // 不传 maxLine 将计算所有
  ctx.save()
  ctx.setFontSize(fontSize)

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
