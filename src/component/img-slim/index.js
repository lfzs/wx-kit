// 图片瘦身
Component({

  properties: {
    url: String, // 原图
    customStyle: String,
  },

  data: {
    slimUrl: '', // 压缩后的图片
  },

  lifetimes: {
    attached() {
      this.setData({ slimUrl: slimeUrl(this.data.url) })
    },
  },

  methods: {
    onImgLoad() {
      this.setData({ slimUrl: this.data.url })
    },
  },

})

function slimeUrl(url) {
  if (/^http/.test(url)) {
    const params = url.split('?')[1]
    url = `${url}${params ? '&imageslim' : '?imageslim'}` // 七牛的格式，其他 cdn 需要更新
  }
  return url
}
