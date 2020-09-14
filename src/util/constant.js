export const APP_NAME = 'wx-kit'
export const TOKEN_KEY = `token_${process.env.APP_ENV}`
export const LANGUAGE = `language_${process.env.APP_ENV}`
export const ADD_TO_MY_MINIPROGRAM = `add_to_my_miniprogram_${process.env.APP_ENV}`
export const TAB_PAGES = [
  '/page/main/home/home',
  '/page/main/mine/mine',
]

export const LOCAL = { // 参照 i18n.wxs, 提供给 js 文件使用
  zh: {
    'tab./page/main/home/home': '首页',
    'tab./page/main/mine/mine': '我的',
    '/page/main/home/home': '首页',
    '/page/main/mine/mine': '我的',
    '首页': '首页',
    '我的': '我的',
    '到场人数': num => `到场${num}人`, // 使用 => this.t('到场人数')(1)
  },

  en: {
    'tab./page/main/home/home': 'index',
    'tab./page/main/mine/mine': 'mine',
    '/page/main/home/home': 'home',
    '/page/main/mine/mine': 'mine',
    '首页': 'Home',
    '我的': 'Mine',
  },
}
