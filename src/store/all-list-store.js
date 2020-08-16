import { List } from '@/store'

export const itemListStore = new class extends List {
  isNeedAuth = false
  api = 'items'
}
