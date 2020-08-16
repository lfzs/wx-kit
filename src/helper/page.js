import { autorun, toJS, configure } from 'mobx'
import { homePage, getErrorMessage, token, APP_NAME } from '@/util'
import shareMethod from './share-method'

configure({ enforceActions: 'always' })

const oldPage = Page

Page = (config = {}) => {
  const { onLoad = shareMethod.noop, onUnload, onShow, onShareAppMessage, onShareTimeline, onAddToFavorites, store } = config

  const interceptors = {

    async onLoad(query) {
      this._disposers = []
      this.setData({ 'onLoadStatus.loading': true })

      try {
        this.store = ((typeof store === 'function') ? await store.call(this, query) : store) || {}
        await onLoad.call(this, query) // this.store 完毕才执行 onLoad => 以便 onLoad 中能访问 this.store

        // 注册 autorun
        Object.entries(this.store).forEach(([key, value]) => {
          const disposer = autorun(() => this.setData({ [key]: getProperties(value) }), { name: key })
          this._disposers.push(disposer)
        })

        this.setData({
          'onLoadStatus.statusCode': -1, // statusCode -1 代表成功
          'onLoadStatus.loading': false,
        })
      } catch (error) {
        console.warn('onLoadStatus', error) // eslint-disable-line no-console
        this.setData({
          'onLoadStatus.statusCode': error.statusCode || 404,
          'onLoadStatus.errorMessage': getErrorMessage(error),
          'onLoadStatus.loading': false,
        })
      }

    },

    onUnload() {
      this._disposers.forEach(disposer => disposer())
      onUnload && onUnload.call(this)
    },

    onShow() {
      // this._updateTitle()
      this.data.onLoadStatus?.statusCode === 401 && token.getToken() && this.onLoad() // 其他页面授过权,更新当前页面
      onShow && onShow.call(this)
    },

    onShareAppMessage() {
      if (onShareAppMessage) return onShareAppMessage.call(this)

      const title = APP_NAME
      const imageUrl = ''
      return { title, path: homePage, imageUrl }
    },

    onShareTimeline() {
      if (onShareTimeline) return onShareTimeline.call(this)

      const title = APP_NAME
      const query = ''
      const imageUrl = ''
      return { title, query, imageUrl }

    },

    onAddToFavorites() {
      const title = APP_NAME
      const imageUrl = ''

      if (onAddToFavorites) return onAddToFavorites.call(this)
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
