import { observable, action } from 'mobx'
import { LANGUAGE, LOCAL, getCurrentPageRoute, tabPages, isTabPage } from '@util'

export default new class {
  @observable language = ''
  #default = 'zh' // 编码默认配置的语言

  #needUpdateNavigationBar = false // 是否需要更新标题
  #needUpdateTabBar = false // 是否需要更新 tabbar

  @action
  init() {
    const prev = wx.getStorageSync(LANGUAGE)
    this.language = prev || this.#default
    prev && (prev !== this.#default) && this._needUpdate()
  }

  @action
  setLanguage(language) {
    if (language === this.language) return
    this.language = language
    wx.setStorage({ key: LANGUAGE, data: language })
    this._needUpdate()
  }

  _needUpdate() {
    this.#needUpdateNavigationBar = true
    this.#needUpdateTabBar = true
  }

  setTabbar() {
    if (this.#needUpdateTabBar && isTabPage()) {
      tabPages.forEach((tab, index) => wx.setTabBarItem({ index, text: this.t(`tab.${getCurrentPageRoute()}`) }))
      this.#needUpdateTabBar = false
    }
  }

  setCurrentTitle() {
    if (this.#needUpdateNavigationBar) {
      wx.setNavigationBarTitle({ title: this.t(getCurrentPageRoute()) })
    }
  }

  t(value) {
    return LOCAL[this.language][value] || ''
  }
}

// page.util 中定义
// _updateTitle() { // onShow 执行
//  i18nStore.setTabbar()
//  18nStore.setCurrentTitle()
// }

// t(value) {
//   return i18nStore.t(value)
// }
