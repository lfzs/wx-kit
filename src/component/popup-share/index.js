// 分享弹窗
Component({
  properties: {
    show: Boolean,
  },

  methods: {
    onClose() {
      this.setData({ show: false })
    },

    onImg() {
      this.triggerEvent('img')
      this.onClose()
    },
  },

})
