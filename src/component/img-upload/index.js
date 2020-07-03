import { autoLoading, toast } from '@util'
import { configStore } from '@store'

// 上传图片
Component({
  properties: {
    limit: {
      type: Number,
      value: 1, // 最大10个
    },

    size: {
      type: Number,
      value: 1, // 图片尺寸 1M
    },

    images: Array,
  },

  methods: {
    chooseImage() {
      const { limit, images, size } = this.data
      const count = limit - images.length
      wx.chooseImage({
        count: Math.min(count, 10),
        sizeType: ['compressed'],
        success: async ({ tempFiles }) => {
          const tempFilePaths = tempFiles.filter(file => file.size / 1024 / 1024 <= size).map(file => file.path)
          if (tempFilePaths.length < tempFiles.length) await toast(`图片大小不能超过 ${size}M `)
          tempFilePaths.length && this.upload(tempFilePaths)
        },
      })
    },

    @autoLoading('上传中')
    async upload(tempFilePaths) {
      const urls = await Promise.all(tempFilePaths.map(filePath => configStore.upload(filePath)))
      this.triggerEvent('upload', this.data.images.concat(urls))
    },

    close(e) {
      const images = this.data.images.slice()
      const { index } = e.currentTarget.dataset
      images.splice(index, 1)
      this.triggerEvent('upload', images)
    },
  },
})
