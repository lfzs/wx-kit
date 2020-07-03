// 倒计时
Component({
  properties: {
    end: String,
    now: String,
    unit: String,
  },

  data: {
    second: 0,
  },

  timer: null,

  observers: {
    'end, now': function(end, now) { (end || now) && this.start() },
  },

  lifetimes: {
    detached() { clearInterval(this.timer) },
  },

  methods: {
    start() {
      clearInterval(this.timer)
      const { end, now } = this.data
      if (!end) return
      let second = (new Date(end) - (now ? new Date(now) : new Date())) / 1000

      this.timer = setInterval(() => {
        if (second && second > 0) {
          --second
          this.setData({ second })
        } else {
          this.triggerEvent('end')
          clearInterval(this.timer)
        }
      }, 1000)
    },

  },
})
