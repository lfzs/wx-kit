// 左滑
Component({

  options: {
    multipleSlots: true,
  },

  properties: {
    rightWidth: Number, // 传入 px, 显示还是作为 rpx
  },

  data: {
    width: 0,
  },

  startX: 0,
  moveX: 0,
  open: false,

  methods: {
    clear() {
      this.startX = 0
      this.moveX = 0
    },

    onOpen() {
      if (this.open) return
      this.open = true
      this.setData({ width: this.data.rightWidth })
      this.clear()
    },

    onClose() {
      if (!this.open) return
      this.open = false
      this.setData({ width: 0 })
      this.clear()
    },

    onStart(e) {
      this.startX = e.changedTouches[0].pageX
    },

    onMove(e) {
      const moveX = this.startX - e.changedTouches[0].pageX
      this.moveX = moveX
      if (this.open) {
        const { rightWidth } = this.data
        moveX <= 0 && this.setData({ width: rightWidth + moveX })
      } else {
        moveX >= 0 && this.setData({ width: this.moveX })
      }
    },

    onEnd() {
      if (this.open) {
        this.moveX <= -10 ? this.onClose() : this.onOpen() // 滑动距离阀值 10
      } else {
        this.moveX >= 10 ? this.onOpen() : this.onClose()
      }
    },

  },
})
