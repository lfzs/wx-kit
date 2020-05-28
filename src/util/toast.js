export default function toast(title, icon = 'none', duration = 1500, mask = true) {
  wx.hideLoading()
  return new Promise((resolve, reject) => {
    wx.showToast({ title, icon, duration, mask, fail: reject })
    setTimeout(resolve, duration)
  })
}
