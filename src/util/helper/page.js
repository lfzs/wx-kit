import { autorun, toJS, configure } from 'mobx'
import { homePage, getErrorMessage, token } from '@util'
import shareMethod from './share-method'

configure({ enforceActions: 'always' })

const oldPage = Page

Page = (config = {}) => {
  const { onLoad, onUnload, onShow, onShareAppMessage, store } = config

  const interceptors = {

    onLoad(query) {
      this._disposers = []
      this.store = ((typeof store === 'function') ? store.call(this, query) : store) || {}
      Object.entries(this.store).forEach(([key, value]) => {
        const disposer = autorun(() => this.setData({ [key]: getProperties(value) }), { name: key })
        this._disposers.push(disposer)
      })

      this._onLoad = async () => { // 拦截 config 里面的 onLoad
        if (!onLoad) return
        this.setData({ 'onLoad.loading': true })

        try {
          await onLoad.call(this, query)
          this.setData({
            'onLoad.statusCode': -1, // statusCode -1 代表成功
            'onLoad.loading': false,
          })
        } catch (e) {
          console.warn('onLoad', e) // eslint-disable-line no-console
          this.setData({
            'onLoad.statusCode': e.statusCode || 404,
            'onLoad.errorMessage': getErrorMessage(e),
            'onLoad.loading': false,
          })
        }
      }

      this._onLoad()
    },

    onUnload() {
      this._disposers.forEach(disposer => disposer())
      onUnload && onUnload.call(this)
    },

    onShow() {
      // this._updateTitle()
      this.data.onLoad.statusCode === 401 && token.getToken() && this._onLoad() // 其他页面授过权,更新当前页面
      onShow && onShow.call(this)
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
