// 拦截页面的 onLoad
import { goHome, autoLoading, wxp, getCurrentPage, token, getErrorMessage } from '@util'

Component({
  properties: {},

  data: {
    loading: true,
    statusCode: -1,
    errorMessage: '',
  },

  lifetimes: {
    ready() {
      return this.init()
    },
  },

  pageLifetimes: {
    show() {
      this.data.statusCode === 401 && token.getToken() && this.init() // 其他页面授过权,更新当前页面
    },
  },

  methods: {

    async init() {
      this.setData({ loading: true })

      try {
        await getCurrentPage()._init()
        this.setData({ statusCode: -1 })
      } catch (e) {
        console.warn('loading-screen', e) // eslint-disable-line no-console
        this.setData({
          statusCode: e.statusCode || 0, // 0 意味 retry
          errorMessage: getErrorMessage(e),
        })
      }

      this.setData({ loading: false })
    },

    @autoLoading
    async handleAuth(e) {
      if (!e.detail.userInfo) return

      const { code } = await wxp.login()
      const userInfo = await wxp.getUserInfo()
      await token.login(code, userInfo)
      return this.init()
    },

    goHome() {
      goHome()
    },
  },
})
