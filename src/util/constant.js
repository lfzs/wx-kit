export const APP_NAME = 'mini-app'
export const TOKEN_KEY = `token_${process.env.NODE_ENV}`
export const LANGUAGE = `language_${process.env.NODE_ENV}`
export const ADD_TO_MY_MINIPROGRAM = `add_to_my_miniprogram_${process.env.NODE_ENV}`

export const MEMORY_WARNING_LEVEL = {
  5: 'TRIM_MEMORY_RUNNING_MODERATE',
  10: 'TRIM_MEMORY_RUNNING_LOW',
  15: 'TRIM_MEMORY_RUNNING_CRITICAL',
}

export const LOCAL = { // 参照 i18n.wxs, 提供给 js 文件使用
  zh: {
    'tab./page/home/home': '首页',
    '/page/home/home': '首页',
    '首页': '首页',
    '我的': '我的',
  },

  en: {
    'tab./page/home/home': 'index',
    '/page/home/home': 'home',
    '首页': 'Home',
    '我的': 'Mine',
  },
}
