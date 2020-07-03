// 微信授权按钮
import { mineStore } from '@store'

Component({

  properties: {
    text: {
      type: String,
      value: '提交',
    },

    customStyle: String,
  },

  methods: {
    onAuth(e) {
      const { userInfo } = e.detail
      if (!userInfo) return
      this.triggerEvent('submit')
      mineStore.updateUserInfo(userInfo)
    },
  },

})
