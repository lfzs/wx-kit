import { request, wxp, toast } from '@util'

export default async function({ content = '', tmplIds = [], targetType = '', targetId = '' }, modal = true) { // modal: false 兼容页面的点击回调（页面点击订阅，不需要手动 modal）
  tmplIds = tmplIds.filter(Boolean)

  if (!tmplIds.length) return toast(content)
  const { subscriptionsSetting: { mainSwitch } } = await wxp.getSetting({ withSubscriptions: true })
  if (!mainSwitch) return toast(content)

  const sendResult = (res = {}) => {
    const acceptIds = Object.keys(res).filter(id => res[id] === 'accept')
    if (acceptIds.length) request.post('subscribe_records/batch', { targetable_type: targetType, targetable_id: targetId, template_ids: acceptIds })
  }

  const showModal = () => new Promise(resolve => {
    wx.showModal({
      content,
      confirmText: '确定',
      showCancel: false,
      fail: resolve,
      success: ({ confirm }) => {
        if (!confirm) return resolve()
        wx.requestSubscribeMessage({ tmplIds, success: res => sendResult(res), complete: resolve })
      },
    })
  })

  const subscribeMessage = () => new Promise(resolve => wx.requestSubscribeMessage({ tmplIds, success: res => sendResult(res), complete: resolve }))

  return modal ? showModal() : subscribeMessage()
}
