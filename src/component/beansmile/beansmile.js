// 页脚声明
Component({

  properties: {
    reachBottom: Boolean,
  },

  observers: {
    'reachBottom': function(reachBottom) {
      reachBottom && setTimeout(() => this.setData({ show: true }), 1000)
    },
  },

  data: {
    show: false,
  },
})
