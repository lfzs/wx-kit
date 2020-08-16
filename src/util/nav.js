import { TAB_PAGES } from '@/util'

export const homePage = TAB_PAGES[0]

export function getCurrentPage() {
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

export function isTabPage(url = getCurrentPageRoute()) {
  url = url.split('?')[0]
  return TAB_PAGES.some(tab => tab.includes(url))
}

export function getCurrentPageRoute() {
  const { route } = getCurrentPage()
  return `/${route}`
}

export function getPrevPage() {
  const pages = getCurrentPages()
  return pages[pages.length - 2]
}

export function goHome() {
  wx.switchTab({ url: homePage })
}

export function canBack() {
  return getCurrentPages().length > 1
}

export function goBack() {
  canBack() ? wx.navigateBack() : goHome()
}

export function redirect(url) {
  wx.redirectTo({ url })
}

export function nav(url) {
  if (!url) return
  if (isTabPage(url)) return wx.switchTab({ url })

  const pages = getCurrentPages()
  const type = pages.length < 10 ? 'navigateTo' : 'redirectTo'
  wx[type]({ url })
}
