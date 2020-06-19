// 实时记录错误信息 => 可在小程序后台 实时日志 查看
import { ui } from '@util'
import { mineStore } from '@store'

export default function() {
  const { miniProgram } = wx.getAccountInfoSync()
  if (miniProgram.envVersion === 'develop') return

  const miniProgramInfo = JSON.stringify(miniProgram)
  const systemInfo = JSON.stringify(ui.getSystemInfo())

  const LOGGER = wx.getRealtimeLogManager() // 实时日志管理器实例
  wx.onPageNotFound(res => LOGGER.warn(miniProgramInfo, `===== onPageNotFound: ${JSON.stringify(res)} =====`, mineStore.data))
  wx.onError(error => LOGGER.error(miniProgramInfo, `===== onError: ${error} =====`, mineStore.data))
  wx.onMemoryWarning(() => LOGGER.warn(miniProgramInfo, `===== onMemoryWarning: ${systemInfo} =====`, mineStore.data))
}
