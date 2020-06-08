import { request, wxp, toast } from '@util'

export default async function({ content = '', tmplIds = [], targetType = '', targetId = '' }) {
  tmplIds = tmplIds.filter(Boolean)

  if (!tmplIds.length) return toast(content)

  const { subscriptionsSetting: { mainSwitch } } = await wxp.getSetting({ withSubscriptions: true })
  if (!mainSwitch) return toast(content)

  const sendSubscribeMessage = (res = {}) => {
    const acceptIds = Object.keys(res).filter(id => res[id] === 'accept')
    if (acceptIds.length) request.post('subscribe_records/batch', { targetable_type: targetType, targetable_id: targetId, template_ids: acceptIds })
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
