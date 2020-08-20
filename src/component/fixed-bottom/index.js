// 吸底占位（该组件需要放置到非 tabbar 页面最底部）使用这个这个组件的页面 css 需要添加 `page { padding-bottom: 0; }`
Component({
  data: {
    height: 0, // 单位 px
  },

  lifetimes: {
    ready() { this.setHeight('fixed-bottom') },
  },

  methods: {
    setHeight(id) {
      wx.createSelectorQuery()
        .in(this)
        .select(`#${id}`)
        .boundingClientRect()
        .exec(res => this.setData({ height: res[0].height }))
    },
  },

})
