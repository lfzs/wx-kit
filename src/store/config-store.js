import { makeAutoObservable } from 'mobx'
import { fetchAction, request } from '@/util'

export default new class {
  data = {}

  constructor() {
    makeAutoObservable(this)
  }

  @fetchAction
  async fetchData() {
    const { data } = await request.get('site_configs')
    const { activity_will_start, lottery_result, withdraw_fail, withdraw_success, delivery } = data.subscribe_template_keys
    data.tmplIds = {
      afterJoinActivity: [activity_will_start],
      afterJoinLottery: [lottery_result],
      afterPaySuccess: [delivery],
      afterApplyWithdraw: [withdraw_fail, withdraw_success],
    }
    return data
  }
}
