// Page 和 Component 构造器会 merge 此对象到 methods 中
import { nav } from '@util'
import _ from 'lodash'

export default {
  noop: _.noop,

  viewImg(e) {
    const { url, urls } = e.target.dataset
    wx.previewImage({ current: url, urls: urls ? urls : [url] })
  },

  nav(e) {
    const { url } = e.currentTarget.dataset
    nav(url)
  },
}
