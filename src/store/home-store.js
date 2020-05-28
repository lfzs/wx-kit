import { observable } from 'mobx'
import { fetchAction, fly } from '@util'

export default new class {
  @observable data = {}

  @fetchAction
  fetchData() {
    return fly.get('custom_pages/home')
  }
}
