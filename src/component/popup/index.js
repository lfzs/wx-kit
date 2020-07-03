// 图片弹窗

import { authApi, nav, toast } from '@util'

Component({
  properties: {
    show: Boolean,
    img: String,
    url: String,
    saveBtn: Boolean,
    closeBtn: Boolean,
  },

  data: {
    imgSuccess: false,
  },

  methods: {

    loadImg() {
      this.setData({ imgSuccess: true })
    },

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
      this.triggerEvent('save')
      await toast('保存成功')
    },
  },

})
