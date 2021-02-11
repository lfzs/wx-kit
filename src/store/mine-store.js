import { makeAutoObservable } from 'mobx'
import { fetchAction, request } from '@/util'

export default new class {
  data = {}

  constructor() {
    makeAutoObservable(this)
  }

  @fetchAction
  fetchData() {
    return request.get('user')
  }

  * updateUserInfo(userInfo = {}) {
    if (userInfo.avatarUrl) {
      userInfo.avatar = userInfo.avatarUrl
      userInfo.nickname = userInfo.nickName
      userInfo.nickName = undefined
      userInfo.avatarUrl = undefined
    }
    const { data } = yield request.put('user', userInfo)
    this.data = data
  }
}
