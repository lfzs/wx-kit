// 图片弹窗

import { authApi, nav } from '@util'

Component({
  properties: {
    show: Boolean,
    img: String,
    url: String,
    saveBtn: Boolean,
    closeBtn: Boolean,
  },

  methods: {
    onClose() {
      this.setData({ show: false })
    },

    onImg() {
      const { img, url } = this.data
      url ? nav(url) : wx.previewImage({ urls: [img] })
    },

    async onSave() {
      await authApi('saveImageToPhotosAlbum')
      wx.saveImageToPhotosAlbum({ filePath: this.data.img }) // filePath 需要是临时路径
      this.onClose()
    },
  },

})
