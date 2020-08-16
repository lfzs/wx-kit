import { observable, action } from 'mobx'
import { request } from '@/util'

export default new class CreateOrderStore {

  @observable data = {} // 预览订单的结果
  @observable body = {} // 预览订单的参数

  @action
  updateBody(body) {
    this.body = { ...this.body, ...body }
  }

  @action
  clear() {
    this.data = {}
    this.body = {
      buyer_message: undefined,
      is_preview: true,
      address_id: undefined,
    }
  }

  before() {
    if (!this.body.is_preview) {
      const { scene } = wx.getLaunchOptionsSync()
      this.updateBody({ scene_code: scene })
    }
  }

  async create(config = {}) { // config 里面传入的是需要刷新的参数
    this.before()
    const body = { ...this.body, ...config }
    const data = await request.post('orders/direct_buy', body)
    this.updateBody(config)
    this.after(data)
    return data
  }

  @action
  after(data) {
    if (this.body.is_preview) {
      this.data = data.data
      this.updateBody({ address_id: this.data.order?.address?.id })
    }
  }
}
