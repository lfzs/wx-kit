// 选择图片
import { wxp, toast } from '@util'

export default async function(maxCount, maxSize = 1) { // maxSize 单位 M
  const { tempFiles } = await wxp.chooseImage({ count: maxCount, sizeType: 'compressed' })
  const tempFilePaths = tempFiles.filter(file => file.size / 1024 / 1024 <= maxSize).map(file => file.path)
  if (tempFilePaths.length < tempFiles.length) toast(`图片大小限制 ${maxSize}M 内`)
  return tempFilePaths
}
