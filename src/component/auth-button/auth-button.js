// 微信授权按钮
import { mineStore } from '@store'

Component({
  externalClasses: ['custom-class'],

  properties: {
    text: {
      type: String,
      value: '提交',
    },
  },

  methods: {
    handleAuth(e) {
      const { userInfo } = e.detail
      if (!userInfo) return
      this.triggerEvent('submit')
      mineStore.updateUserInfo(userInfo)
    },
  },

})
