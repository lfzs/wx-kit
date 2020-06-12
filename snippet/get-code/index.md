# 获取验证码倒计时按钮

```js

// <text class="flex-center {{ time > 0 && 'disabled' }}" bindtap="{{ time > 0 ? '' : 'onGetCode' }}">{{ time > 0 ? time + ' 秒后获取' : '获取验证码' }}</text>

data: {
  time: 0,
},

async onGetCode() {
  const { mobile } = this.data
  if (!mobile.length) return toast('请输入手机号')
  await autoLoading(request.get('user/verification_code', { mobile }), ' ', '发送成功')
  this.setData({ time: 60 })

  clearInterval(this.timer)
  this.timer = setInterval(() => {
    const { time } = this.data
    if (time < 1) return clearInterval(this.timer)
    this.setData({ time: time - 1 })
  }, 1000)
},

onUnload() {
  clearInterval(this.timer)
},

```
