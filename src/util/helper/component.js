import shareMethod from './share-method'

const oldComponent = Component

Component = (config = {}) => {
  config.methods = Object.assign({}, shareMethod, config.methods)
  return oldComponent(Object.assign({}, config))
}
