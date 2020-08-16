import { observable } from 'mobx'
import { fetchAction, request } from '@/util'
import { Cache } from '@/store'

export default class extends Cache {
  @observable data = {}

  @fetchAction
  fetchData() {
    return request.get(`items/${this.id}`)
  }
}
