import { observable } from 'mobx'
import { fetchAction, request } from '@util'

export default new class {
  @observable data = {}

  @fetchAction
  fetchData() {
    return request.get('custom_pages/home')
  }
}
