import { List } from '@/store'

export const itemListStore = new class extends List {
  api = 'items'
}
