module.exports = {
  presets: ['@babel/preset-env'], // 负责语法转换
  comments: false,
  plugins: [
    'lodash',
    ['module-resolver', {
      'root': ['./src'],
      'alias': {
        '@/util': './src/util/index.js',
        '@/store': './src/store/index.js',
        '@': './src',
      },
    }],
    ['@babel/plugin-transform-runtime', { 'corejs': { 'version': 3, 'proposals': true } }], // 负责 api 转换并去除重复使用

    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ['@babel/plugin-proposal-private-methods', { 'loose': true }],
    ['@babel/plugin-proposal-class-properties', { 'loose': true }],

    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    ['transform-inline-environment-variables', { 'include': ['NODE_ENV'] }],
  ],
}
