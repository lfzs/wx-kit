import { makeAutoObservable } from 'mobx'
import { fetchAction, request } from '@/util'
import { Cache } from '@/store'

export default class extends Cache {
  data = {}
  constructor() {
    super()
    makeAutoObservable(this)
  }

  @fetchAction
  fetchData() {
    return request.get(`items/${this.id}`)
  }
}
