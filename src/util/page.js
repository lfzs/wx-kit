import { autorun, toJS, configure } from 'mobx'
import { homePage, shareMethod } from '@util'

configure({ enforceActions: 'always' })

const oldPage = Page

Page = (config = {}) => {
  const { onLoad, onUnload, onShareAppMessage, store } = config

  const interceptors = {

    onLoad(query) {
      this._disposers = []
      this.store = ((typeof store === 'function') ? store.call(this, query) : store) || {}
      Object.entries(this.store).forEach(([key, value]) => {
        const disposer = autorun(() => this.setData({ [key]: getProperties(value) }), { name: key })
        this._disposers.push(disposer)
      })

      // 挂载到页面 以便 loading-screen 调用
      this._init = () => onLoad && onLoad.call(this, query)
    },

    onUnload() {
      this._disposers.forEach(disposer => disposer())
      onUnload && onUnload.call(this)
    },

    onShareAppMessage() {
      const title = ''
      const imageUrl = ''

      if (onShareAppMessage) return onShareAppMessage.call(this)
      return { title, path: homePage, imageUrl }
    },
  }

  delete config.store
  return oldPage(Object.assign({}, shareMethod, config, interceptors))
}

function getProperties(store) {
  const newStore = { ...toJS(store) }

  // 只提取 get 属性
  const descriptors = Object.getOwnPropertyDescriptors(store)
  Object.entries(descriptors).forEach(([name, descriptor]) => {
    if (descriptor.get && !descriptor.enumerable) newStore[name] = store[name]
  })

  return newStore
}
