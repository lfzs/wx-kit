// 遮罩

Component({
  properties: {
    show: Boolean,
    position: {
      type: String,
      value: 'center', // center top right bottom left
    },
  },

  methods: {
    noop() {},
    onMask() { this.triggerEvent('mask') },
  },

})
