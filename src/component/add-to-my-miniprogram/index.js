// 添加到我的小程序
import { ADD_TO_MY_MINIPROGRAM, ui } from '@/util'

Component({

  properties: {
    custom: Boolean, // 当前页面是否是自定义导航
  },

  lifetimes: {
    ready() {
      const { windowWidth } = ui.getSystemInfo()
      const { right, width } = ui.getMenuButtonInfo()
      this.setData({
        rightGap: windowWidth - right,
        upRight: Math.floor(3 / 4 * width),
        totalHeight: this.data.custom ? ui.getNavbarInfo().totalHeight : 0,
      })
      this.toggle()
    },

  },

  data: {
    show: false,
    rightGap: 0,
    upRight: 0,
    totalHeight: 0,
  },

  methods: {
    show() {
      setTimeout(() => this.setData({ show: true }), 5000)
      setTimeout(() => this.setData({ show: false }), 10000)
      wx.setStorage({ key: ADD_TO_MY_MINIPROGRAM, data: Date.now() })
    },

    toggle() {
      const timestamp = wx.getStorageSync(ADD_TO_MY_MINIPROGRAM)
      if (!timestamp) this.show()
    },
  },

})
