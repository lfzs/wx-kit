import { mineStore } from '@store'
import { TOKEN_KEY, wxp, request } from '@util'

export default new class {

  #token = ''

  _saveToken(token) {
    this.#token = token
    wx.setStorage({ key: TOKEN_KEY, data: token })
  }

  removeToken() {
    this.#token = ''
    wx.removeStorageSync(TOKEN_KEY)
  }

  getToken() {
    this.#token = this.#token || wx.getStorageSync(TOKEN_KEY)
    return this.#token
  }

  // 是否可以使用 wx.getUserInfo 获取用户信息
  async canGetUserInfo() {
    const { authSetting } = await wxp.getSetting()
    return !!authSetting['scope.userInfo']
  }

  // code 为调用 wx.getUserInfo 前获取的。 userInfo 格式为 wx.getUserInfo 获取的值
  async login(code = '', userInfo = {}) {
    const body = { code, encrypted_data: userInfo.encryptedData, iv: userInfo.iv }
    const data = await request.post('user/token', body)

    const { data: { access_token }, statusCode } = data
    if (!access_token) throw { ...data.data, status: statusCode } // 没有返回 access_token 就按照失败处理

    this._saveToken(access_token)
    userInfo.userInfo && mineStore.updateUserInfo(userInfo.userInfo)
  }

}
