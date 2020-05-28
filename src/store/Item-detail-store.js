import { observable } from 'mobx'
import { fetchAction, fly } from '@util'
import { Cache } from '@store'

export default class extends Cache {
  @observable data = {}

  @fetchAction
  fetchData() {
    return fly.get(`items/${this.id}`)
  }
}
