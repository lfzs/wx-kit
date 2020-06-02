Page({
  data: {
    path: '',
  },

  onLoad({ path }) {
    this.setData({ path: decodeURIComponent(path) })
  },
})
