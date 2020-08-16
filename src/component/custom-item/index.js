// 根据接口返回的组件配置 => 渲染出对应组件
import { nav, request, toast } from '@/util'

Component({

  properties: {
    components: Array,
  },

  observers: {
    'components': function(components) {
      const cpl = components.filter(component => component.name === 'custom-product-list')
      if (cpl.length) this.getItemsById(cpl)
    },
  },

  data: {
    swiperIndex: {}, // 轮播的索引
    itemsList: {}, // 产品列表
  },

  methods: {

    swiperChange(e) {
      const { current } = e.detail
      const { key } = e.target.dataset
      this.setData({ [`swiperIndex.${key}`]: current })
    },

    nav(e) {
      const { url } = e.currentTarget.dataset
      url && nav(url)
    },

    copyText(e) {
      const { text } = e.currentTarget.dataset
      wx.setClipboardData({ data: text, success: () => toast('复制成功') })
    },

    async getItemsById(cpl) {
      // 根据列表 id 获取对应的商品
      const items = cpl.map(item => request.get(`custom_list/${item.data.data[0].id}`).catch(() => ({ data: {} })))
      const data = await Promise.all(items)

      const itemsList = {}
      cpl.forEach((item, index) => itemsList[item.key] = data[index].data)
      this.setData({ itemsList })
    },
  },

})
