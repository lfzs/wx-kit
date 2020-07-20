// Page 和 Component 构造器会 merge 此对象到 methods 中
import { nav, goBack } from '@util'
// import { i18nStore } from '@store'

export default {
  noop: () => {},

  viewImg(e) {
    const { url, urls } = e.target.dataset
    wx.previewImage({ current: url, urls: urls ? urls : [url] })
  },

  nav(e) {
    const { url } = e.currentTarget.dataset
    url && nav(url)
  },

  toggle(e) {
    const { key } = e.currentTarget.dataset
    key && this.setData({ [key]: !this.data[key] })
  },

  goBack() { goBack() },

  // t(key) {
  //   return i18nStore.t(key)
  // },

  // _updateTitle() {
  //  i18nStore.setTabbar()
  //  i18nStore.setCurrentTitle()
  // },
}
