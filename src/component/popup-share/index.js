// 分享弹窗
Component({
  properties: {
    show: Boolean,
    closeable: Boolean, // 是否显示关闭按钮
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
