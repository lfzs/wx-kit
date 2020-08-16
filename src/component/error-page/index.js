// 根据 onLoadStatus 显示错误信息 (loading 状态暂不捕获，需要的页面可根据 onLoadStatus.loading 单独处理)
import { autoLoading, wxp, getCurrentPage, token } from '@/util'

Component({
  properties: {
    status: Object,
  },

  methods: {

    reload() {
      return getCurrentPage().onLoad()
    },

    async onAuth(e) {
      if (!e.detail.userInfo) return

      const { code } = await wxp.login()
      const userInfo = await wxp.getUserInfo()
      await autoLoading(token.login(code, userInfo))

      return this.reload()
    },
  },
})
