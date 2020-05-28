// 拦截页面的 onLoad
import { goHome, autoLoading, wxp, getCurrentPage, token } from '@util'

Component({
  properties: {},

  data: {
    loading: true,
    status: -1,
    errorText: '',
  },

  lifetimes: {
    ready() {
      return this.init()
    },
  },

  pageLifetimes: {
    show() {
      this.data.status === 401 && token.getToken() && this.init() // 其他页面授过权,更新当前页面
    },
  },

  methods: {

    async init() {
      this.setData({ loading: true })

      try {
        await getCurrentPage()._init()
        this.setData({ status: -1 })
      } catch (e) {
        console.log(e) // eslint-disable-line no-console
        const { status, error_message, message, errMsg } = e

        let errorText = ''
        status === 404 && (errorText = error_message || message || errMsg || '请求失败, 请稍后重试')
        this.setData({ status, errorText })
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
