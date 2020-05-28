import { mineStore } from '@store'

Page({
  store: {
    mineStore,
  },

  onLoadAfter: false,

  async onLoad() {
    await mineStore.fetchData()
    this.onLoadAfter = true
  },

  onShow() {
    this.onLoadAfter && mineStore.fetchData()
  },

})
