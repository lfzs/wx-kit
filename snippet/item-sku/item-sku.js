// 商品 sku 弹窗
Component({
  properties: {
    show: Boolean,
    item: Object,
  },

  observers: {
    'item': function(item) {
      if (item?.id) this.defaultSku()
    },
  },

  data: {
    sku: {}, // 选择的 sku
    quantity: 1,
    items: [], // 选择的 item 集合
  },

  methods: {
    // 默认选择一个 sku
    defaultSku() {
      const { stock_keeping_units } = this.data.item
      const sku = stock_keeping_units.find(sku => sku.on_sale)
      sku ? this.setData({ sku, items: this._getItemsBySku(sku) }) : this.setData({ sku: {}, items: [] })
    },

    _getItemsBySku(sku) {
      const { sku_options } = this.data.item
      const items = []
      sku_options.map(item => {
        item.sku_values.map(v => sku.vids.indexOf(v.id) > -1 && items.push(v))
      })
      return items
    },

    // 点击某一 item
    onItem(e) {
      const { items } = this.data
      const { item } = e.currentTarget.dataset
      const index = items.findIndex(v => v.sku_property_id === item.sku_property_id)
      index > -1 ? items[index] = item : items.push(item)
      this.setData({ items })
      this._getSkuByItems(items)
    },

    _getSkuByItems(items) {
      const { stock_keeping_units } = this.data.item
      if (items.length !== stock_keeping_units[0].vids.length) return
      const vids = items.map(item => item.id)
      const sku = stock_keeping_units.find(item => item.vids.sort().join() === vids.sort().join())
      this.setData({ sku })
    },

    // 提交
    onSubmit() {
      const { sku, quantity } = this.data
      this.onClose()
      this.triggerEvent('submit', { sku, quantity })
    },

    // 步进器变化
    onStepper(e) {
      this.setData({ quantity: e.detail })
    },

    onClose() { this.setData({ show: false }) },
  },
})
