import { homeStore } from '@/store'
import { pullDownRefresh } from '@/util'

Page({
  store: {
    homeStore,
  },

  onLoad() {
    return homeStore.fetchData()
  },

  @pullDownRefresh
  onPullDownRefresh() {
    return homeStore.fetchData()
  },
})
