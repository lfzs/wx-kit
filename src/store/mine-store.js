import { observable, flow } from 'mobx'
import { fetchAction, request } from '@/util'

export default new class {
  @observable data = {}

  @fetchAction
  fetchData() {
    return request.get('user')
  }

  updateUserInfo = flow(function* (userInfo = {}) {
    if (userInfo.avatarUrl) {
      userInfo.avatar = userInfo.avatarUrl
      userInfo.nickname = userInfo.nickName
      userInfo.nickName = undefined
      userInfo.avatarUrl = undefined
    }
    const { data } = yield request.put('user', userInfo)
    this.data = data
  })
}
