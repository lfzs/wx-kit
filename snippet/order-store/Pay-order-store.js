import { OrderDetailStore } from '@store'
import { request, wxp, sleep } from '@util'

export default class PayOrderStore {
  constructor(orderId) {
    this.orderId = orderId
  }

  async pay() {
    const { data } = await request.post(`orders/${this.orderId}/request_payment`)
    await wxp.requestPayment(data)
    await this.isSuccess()
  }

  async isSuccess() {
    const MAX = 5
    const orderDetailStore = OrderDetailStore.findOrCreate(this.orderId)

    for (let index = 0; index < MAX; index++) {
      await sleep(1000)
      await orderDetailStore.fetchData()
      if (orderDetailStore.data.status === 'wait_seller_send_goods') break
    }

    if (orderDetailStore.data.status === 'wait_buyer_pay') throw new Error('查询订单超时，请稍后查看订单状态')
  }

}
