import './util/page'
import { MEMORY_WARNING_LEVEL } from '@util'

App({

  onLaunch() {
    this.reporter()
  },

  onShow() {
    this.checkUpdateManager()
  },

  reporter() {
    const LOGGER = wx.getRealtimeLogManager() // 实时日志管理器实例
    wx.onPageNotFound(({ path, query, isEntryPage }) => LOGGER.warn(`onPageNotFound: path${path},query${query},isEntryPage${isEntryPage}`))
    wx.onMemoryWarning(({ level }) => LOGGER.warn(`onMemoryWarning: level${MEMORY_WARNING_LEVEL[level]}`))
    wx.onError(error => LOGGER.error(`onError: ${error}`))
  },

  // 新版本提示
  checkUpdateManager() {
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(() => updateManager.applyUpdate())
  },

})
