// 错误页面
import { autoLoading, wxp, getCurrentPage, token } from '@util'

Component({
  properties: {
    status: Object,
  },

  methods: {

    async onAuth(e) {
      if (!e.detail.userInfo) return

      const { code } = await wxp.login()
      const userInfo = await wxp.getUserInfo()
      await autoLoading(token.login(code, userInfo))

      return getCurrentPage()._onLoad()
    },
  },
})
