export const APP_NAME = 'wx-kit'
export const TOKEN_KEY = `token_${process.env.NODE_ENV}`
export const LANGUAGE = `language_${process.env.NODE_ENV}`
export const ADD_TO_MY_MINIPROGRAM = `add_to_my_miniprogram_${process.env.NODE_ENV}`

export const LOCAL = { // 参照 i18n.wxs, 提供给 js 文件使用
  zh: {
    'tab./page/main/home/home': '首页',
    '/page/main/home/home': '首页',
    '首页': '首页',
    '我的': '我的',
  },

  en: {
    'tab./page/main/home/home': 'index',
    '/page/main/home/home': 'home',
    '首页': 'Home',
    '我的': 'Mine',
  },
}
