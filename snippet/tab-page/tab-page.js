import { allOrderListStore, waitPayOrderListStore, waitSendOrderListStore, waitConfirmOrderListStore } from '@store'
const page = [
  { text: '全部', name: 'allOrderListStore' },
  { text: '待付款', name: 'waitPayOrderListStore' },
  { text: '待发货', name: 'waitSendOrderListStore' },
  { text: '待收货', name: 'waitConfirmOrderListStore' },
]

Page({
  store: { allOrderListStore, waitPayOrderListStore, waitSendOrderListStore, waitConfirmOrderListStore },

  data: {
    current: 0,
    page,
  },

  onLoad({ index = 0 }) {
    this.setData({ current: Number(index) })
    return this.getStore().fetchData()
  },

  getStore() {
    const { current } = this.data
    return this.store[page[current].name]
  },

  onNav(e) {
    const { current } = e.currentTarget.dataset
    this.setData({ current })
    this.getStore().tryFetchData()
  },

  onSwiperChange(e) {
    const { source, current } = e.detail
    if (source === 'touch') {
      this.setData({ current })
      this.getStore().tryFetchData()
    }
  },

  onLoadMore() {
    return this.getStore().tryFetchMoreData()
  },

})
