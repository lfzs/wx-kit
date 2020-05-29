import { request, wxp } from '@util'

export default async function({ content = '', tmplIds = [], targetType = '', targetId = '' }) {
  tmplIds = tmplIds.filter(Boolean)
  if (!tmplIds.length) return wxp.showToast({ title: content, icon: 'none' })
  wx.hideLoading()

  const sendSubscribeMessage = (res = {}) => {
    const acceptIds = Object.keys(res).filter(id => res[id] === 'accept')
    if (acceptIds.length) request.post('subscribe_records/batch', { targetable_type: targetType, targetable_id: targetId, template_ids: acceptIds })
  }

  const { subscriptionsSetting: { mainSwitch, itemSettings = {} } } = await wxp.getSetting({ withSubscriptions: true })
  if (!mainSwitch) return wxp.showToast({ title: content, icon: 'none' })

  const onceIds = tmplIds.filter(id => !itemSettings[id]) // 订阅一次的 id
  if (!onceIds.length) {
    wx.requestSubscribeMessage({ tmplIds, success: res => sendSubscribeMessage(res) })
    return wxp.showToast({ title: content, icon: 'none' })
  }

  return new Promise(resolve => {
    wx.showModal({
      content,
      confirmText: '确定',
      showCancel: false,
      fail: resolve,
      success: ({ confirm }) => {
        if (!confirm) return resolve()
        wx.requestSubscribeMessage({
          tmplIds,
          success: res => sendSubscribeMessage(res),
          complete: resolve,
        })
      },
    })
  })
}
