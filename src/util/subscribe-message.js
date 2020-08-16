import { request, wxp, toast } from '@util'

// const target = [
//  ['Activity', 1, [], // [type, id, tmplIds]
//  ['Lottery', 5, [],
// ]

export default async function(content = '', target = [], modal = true) { // modal: false 兼容页面的点击回调（页面点击订阅，不需要手动 modal）
  const tmplIds = target.map(item => item[2]).flat().filter(Boolean)

  if (!tmplIds.length) return toast(content)
  const { subscriptionsSetting: { mainSwitch } } = await wxp.getSetting({ withSubscriptions: true })
  if (!mainSwitch) return toast(content)

  const sendResult = (res = {}) => {
    const acceptIds = Object.keys(res).filter(id => res[id] === 'accept')
    target.forEach(item => item[3] = item[2].filter(id => acceptIds.includes(id)))

    if (acceptIds.length) {
      const body = []
      target.forEach(item => item[3].length && body.push({ targetable_type: item[0], targetable_id: +item[1], template_ids: item[3] }))
      request.post('subscribe_records/batch', body)
    }
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
