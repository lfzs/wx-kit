// 列表滚动加载底部状态
Component({
  properties: {
    status: Object,
    emptyText: String,

    reachBottomText: {
      type: String,
      value: '已经到底了',
    },
  },
})
