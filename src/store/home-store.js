import { makeAutoObservable } from 'mobx'
import { fetchAction, request } from '@/util'

export default new class {
  data = {}

  constructor() {
    makeAutoObservable(this)
  }

  @fetchAction
  fetchData() {
    return request.get('custom_pages/home')
  }
}
