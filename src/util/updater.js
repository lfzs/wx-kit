// 检查更新
export default function() {
  const updateManager = wx.getUpdateManager()
  updateManager.onUpdateReady(() => updateManager.applyUpdate())
}
