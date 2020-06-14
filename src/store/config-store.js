import { observable, flow, action } from 'mobx'
import { fetchAction, request, wxp } from '@util'

export default new class {
  @observable data = {}
  @observable qiniuMeta = null

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

  setQiniuMeta = flow(function* () {
    const { data } = yield request.get('qiniu_meta')
    this.qiniuMeta = data
    setTimeout(() => this.clearQiniuMeta(), data.expires_in * 1000)
  })

  @action
  clearQiniuMeta() {
    this.qiniuMeta = null
  }

  // 上传
  async upload(filePath = '') {
    if (!this.qiniuMeta) await this.setQiniuMeta()
    const { bucket_domain, token } = this.qiniuMeta

    try {
      const { data } = await wxp.uploadFile({ url: 'https://upload-z2.qiniup.com', name: 'file', filePath, formData: { token } })
      const key = JSON.parse(data).key
      return `https://${bucket_domain}/${key}`
    } catch (error) {
      this.clearQiniuMeta()
    }

  }

}
