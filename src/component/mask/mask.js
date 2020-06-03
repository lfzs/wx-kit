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
    onMask() { this.triggerEvent('mask') },
  },

})
