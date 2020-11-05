export default new class {
  #systemInfo = {}
  #menuButtonInfo = {} // 右上角胶囊信息
  #navbarInfo = {} // 自定义导航条信息 单位 px

  #setSystemInfo() {
    if (this.#systemInfo.platform) return

    try {
      this.#systemInfo = wx.getSystemInfoSync()
    } catch (error) {
      this.#systemInfo = wx.getSystemInfoSync()
    } finally {
      this.#systemInfo.platform || (this.#systemInfo = wx.getSystemInfoSync())
    }
  }

  #setMenuButtonInfo() {
    if (this.#menuButtonInfo.height) return

    try {
      this.#menuButtonInfo = wx.getMenuButtonBoundingClientRect()
    } catch (error) {
      this.#menuButtonInfo = wx.getMenuButtonBoundingClientRect()
    } finally {
      this.#menuButtonInfo.height || (this.#menuButtonInfo = wx.getMenuButtonBoundingClientRect())
    }
  }

  #setNavbarInfo() {
    if (this.#navbarInfo.topGap) return

    this.#setSystemInfo()
    this.#setMenuButtonInfo()
    const isIOS = this._isIOS()
    let { statusBarHeight, windowWidth } = this.#systemInfo
    const { width, height, top, right } = this.#menuButtonInfo
    statusBarHeight = statusBarHeight - (isIOS ? 4 : -1) // 误差校正

    const topGap = top - statusBarHeight // 胶囊顶部和状态栏的间隙
    const navHeight = topGap * 2 + height // 导航条的高度
    const rightWidth = windowWidth - right + width // 右间隙 + 胶囊宽度

    this.#navbarInfo = {
      windowWidth,
      statusBarHeight,
      topGap,
      navHeight,
      rightWidth,
      totalHeight: navHeight + statusBarHeight, // 总高度 = 导航条 + 状态栏高度,
    }
  }

  _isIOS() {
    if (!this.#systemInfo.platform) this.#setSystemInfo()
    const { platform } = this.#systemInfo
    return platform.toUpperCase() === 'IOS' || platform.toUpperCase() === 'DEVTOOLS'
  }

  getSystemInfo() {
    this.#setSystemInfo()
    return this.#systemInfo
  }

  getMenuButtonInfo() {
    this.#setMenuButtonInfo()
    return this.#menuButtonInfo
  }

  getNavbarInfo() {
    this.#setNavbarInfo()
    return this.#navbarInfo
  }
}
