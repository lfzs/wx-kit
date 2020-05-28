// 遮罩

Component({
  externalClasses: ['custom-class'],

  properties: {
    show: Boolean,
  },

  methods: {
    noop() {},
    onMask() { this.triggerEvent('mask') },
  },

})
