import { observable, flow } from 'mobx'
import { fetchAction, request, subscribeMessageModal, autoLoading } from '@/util'
import { Cache, waitPayOrderListStore, allOrderListStore, waitConfirmOrderListStore, waitSendOrderListStore, PayOrderStore, configStore } from '@/store'

export default class extends Cache {
  @observable data = {}

  @fetchAction
  fetchData() {
    return request.get(`orders/${this.id}`)
  }

  // 待付款 => 取消订单
  cancelOrder = flow(function* () {
    const { data } = yield request.put(`orders/${this.id}/close`)
    this.data = data
    waitPayOrderListStore.removeItemById(this.id)
    allOrderListStore.replaceItem(data)
  })

  // 确认收货
  confirmOrder = flow(function* () {
    const { data } = yield request.put(`orders/${this.id}/confirm_goods`)
    this.data = data
    waitConfirmOrderListStore.removeItemById(this.id)
    allOrderListStore.replaceItem(data)
  })

  // 支付订单
  async payOrder() {
    const payOrderStore = new PayOrderStore(this.id)
    try {
      await autoLoading(payOrderStore.pay())
      waitSendOrderListStore.unshift(this.data)
      await this.subscribeModal()
    } catch (error) {
      waitPayOrderListStore.unshift(this.data)
      throw error
    } finally {
      allOrderListStore.unshift(this.data)
    }
  }

  async subscribeModal() {
    await configStore.tryFetchData()
    await subscribeMessageModal({
      content: '支付成功',
      targetType: 'MagicBean::Order',
      targetId: this.id,
      tmplIds: configStore.data.tmplIds.afterPaySuccess,
    })
  }
}
