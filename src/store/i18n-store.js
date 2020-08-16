import { observable, action } from 'mobx'
import { LANGUAGE, LOCAL, getCurrentPageRoute, tabPages, isTabPage, ui } from '@/util'

export default new class {
  @observable language = 'zh' // 默认的语言 zh en

  #needUpdateNavigationBar = false // 是否需要更新标题
  #needUpdateTabBar = false // 是否需要更新 tabbar

  constructor() {
    // this.init()
  }

  init() {
    const prev = getPrevLanguage()
    if (prev !== this.language) this.setLanguage(prev)
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
      tabPages.forEach((tab, index) => wx.setTabBarItem({ index, text: this.t(`tab.${tab}`) }))
      this.#needUpdateTabBar = false
    }
  }

  setCurrentTitle() {
    if (this.#needUpdateNavigationBar) {
      wx.setNavigationBarTitle({ title: this.t(getCurrentPageRoute()) })
    }
  }

  t(key) {
    return LOCAL[this.language][key] || ''
  }
}

function getPrevLanguage() {
  const prev = wx.getStorageSync(LANGUAGE)
  if (prev) return prev

  const { language } = ui.getSystemInfo()
  if (language === 'zh_CN') return 'zh'
  if (language === 'en') return 'en'
}
