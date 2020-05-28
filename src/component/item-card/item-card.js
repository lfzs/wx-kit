// 商品展示
import { nav } from '@util'

Component({
  externalClasses: ['custom-class'],

  properties: {
    item: Object,
    url: String,
  },

  methods: {
    nav() {
      const { url } = this.data
      url && nav(url)
    },
  },
})
