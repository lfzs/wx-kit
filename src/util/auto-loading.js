import { wxp, toast, getErrorMessage } from '@util'

const ignoreErrors = [].join('')

async function loading(promise, title = '加载中', successText, failText) {
  try {
    wx.showLoading({ title, mask: true })
    const res = await promise
    wx.hideLoading()
    if (successText) await toast(successText, 'success', 3000)
    return res
  } catch (e) {
    wx.hideLoading()
    const errorMessage = getErrorMessage(e)
    if (!ignoreErrors.includes(errorMessage)) await wxp.showModal({ title: '提示', content: failText || errorMessage, showCancel: false, confirmText: '知道了' })
    throw e
  }
}

function loadingDecorator(...args) {
  return function(target, name, descriptor) {
    const func = descriptor.value
    descriptor.value = function(...funcArgs) {
      return loading(func.apply(this, funcArgs), ...args)
    }
  }
}

export default function(...args) {

  if (typeof args[0] === 'function') { // 被当作普通函数调用 且 args[0] 是普通函数
    return
  } else if (typeof args[0].then === 'function') { // 被当作普通函数调用 且 args[0] 是 promise
    return loading(...args)
  } else if (args.length === 3) { // 被当作装饰器使用 legacy 模式 args 为[target, name, descriptor]
    return loadingDecorator()(...args)
  } else {
    return loadingDecorator(...args) // 被当做装饰器并传参使用 args 是参数
  }
}
