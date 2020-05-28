import { observable, flow } from 'mobx'
import { fetchAction, fly } from '@util'

export default new class {
  @observable data = {}

  @fetchAction
  fetchData() {
    return fly.get('user')
  }

  updateUserInfo = flow(function* (userInfo = {}) {
    if (userInfo.avatarUrl) {
      userInfo.avatar = userInfo.avatarUrl
      userInfo.nickname = userInfo.nickName
      delete userInfo.nickName
      delete userInfo.avatarUrl
    }
    const { data } = yield fly.put('user', userInfo)
    this.data = data
  })
}
