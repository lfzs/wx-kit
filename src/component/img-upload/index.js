import { autoLoading, uploader, chooseImage } from '@/util'

// 上传图片
Component({
  properties: {
    limit: {
      type: Number,
      value: 9,
    },

    size: {
      type: Number,
      value: 1, // 图片尺寸 1M
    },

    images: Array,
  },

  data: {
    errImages: [], // 对应 images 的顺序，存储的是临时路径
  },

  methods: {
    async onChoose() {
      const { limit, images, size } = this.data
      const maxCount = limit - images.length
      if (maxCount < 1) return // 不能在选择了
      const tempFilePaths = await chooseImage({ maxCount, maxSize: size })
      this.upload(tempFilePaths)
    },

    async onRetryChoose(e) {
      const { index } = e.currentTarget.dataset
      const { size, images, errImages } = this.data
      const tempFilePaths = await chooseImage({ maxCount: 1, maxSize: size })
      const url = await autoLoading(uploader.uploadImage(tempFilePaths[0]), '上传中')
      images[index] = url
      url && (errImages[index] = '')

      this.setData({ errImages })
      this.triggerEvent('upload', images)
      // 父组件不要修改 images，因为 errImages 会依赖 images 的顺序
    },

    @autoLoading('上传中')
    async upload(tempFilePaths) {
      const urls = await Promise.all(tempFilePaths.map(filePath => uploader.uploadImage(filePath)))

      const errImages = urls.map((url, index) => url ? '' : tempFilePaths[index])
      this.setData({ errImages })

      this.triggerEvent('upload', this.data.images.concat(urls)) // 注意：images 里面可能会有路径为空的，提交的时候需要 filter(Boolean) 下
    },

    close(e) {
      const images = this.data.images.slice()
      const { index } = e.currentTarget.dataset
      images.splice(index, 1)
      this.triggerEvent('upload', images)
    },
  },
})
