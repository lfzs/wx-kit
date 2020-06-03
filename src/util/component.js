import { shareMethod } from '@util'

const oldComponent = Component

Component = (config = {}) => {
  return oldComponent(Object.assign({}, shareMethod, config))
}
