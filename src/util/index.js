export fetchAction from './fetch-action'
export wxp from './wxp'
export authApi from './auth-api'
export * from './constant'
export { nav, goBack, goHome, homePage, getCurrentPage, isTabPage, canBack, getCurrentPageRoute, getPrevPage, redirect } from './nav'
export modal from './modal'
export autoLoading from './auto-loading'
export canvas, { getCanvas, getTextLines } from './canvas'
export pullDownRefresh from './pull-down-refresh'
export request from './request'
export ui from './ui'
export token from './token'
export reporter from './reporter'
export updater from './updater'
export uploader from './uploader'
export subscribeMessage from './subscribe-message'
export chooseImage from './choose-image'

export function sleep(time = 0) {
  return new Promise(resolve => setTimeout(resolve, time))
}

// 从 response 中获取 message
export function getErrorMessage(response, defaultMessage = '请求失败, 请重试') {
  if (typeof response === 'string') return response
  return response?.message ?? defaultMessage
}

export default function toast(title, icon = 'none', duration = 1500, mask = true) {
  wx.hideLoading()
  return new Promise((resolve, reject) => {
    wx.showToast({ title, icon, duration, mask, fail: reject })
    setTimeout(resolve, duration)
  })
}

