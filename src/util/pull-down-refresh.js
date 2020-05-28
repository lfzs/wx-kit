export default function(target, name, descriptor) {
  const func = descriptor.value

  descriptor.value = function(...args) {
    wx.vibrateShort()
    Promise.resolve(func.apply(this, args))
      .then(() => wx.stopPullDownRefresh())
      .catch(() => {
        wx.stopPullDownRefresh()
        wx.showToast({ title: '请求失败', icon: 'none' })
      })
  }
}
