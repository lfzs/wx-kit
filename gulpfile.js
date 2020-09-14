const gulp = require('gulp')
const changed = require('gulp-changed')
const eslint = require('gulp-eslint')
const gulpif = require('gulp-if')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')
const color = require('colors')
const notifier = require('node-notifier')
const stylelint = require('gulp-stylelint')
const less = require('gulp-less')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const px2units = require('postcss-px2units')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const webpack = require('webpack')
const through = require('through2')
const path = require('path')

const paths = {
  js: ['src/app.js', 'src/**/*.js'],
  less: ['src/**/*.less'],
  wxml: ['src/**/*.wxml'],
  other: ['src/**/*.json', 'src/**/*.wxss', 'src/**/*.wxs', 'src/**/*.{png,svg,jpg,jpeg,gif}'],
}

const isDev = process.env.APP_ENV === 'development'

const webpackConfig = {
  // mode: process.env.APP_ENV === 'development' ? 'development' : 'production', devtool: false,
  mode: 'production',
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
}

function handleError(err) {
  /* eslint-disable */
  console.log(color.red('===================== Error Start ====================='))
  console.log(color.red('    line: '), color.green(err.lineNumber))
  console.log(color.red('  plugin: '), color.green(err.plugin))
  console.log(color.red(' message: '), color.green(err.message))
  console.log(color.red('=====================  Error End  ====================='))
  /* eslint-enable */

  notifier.notify({ title: `${err.plugin}错误`, message: err.fileName })
  this.emit('end')
}

function bundleJS() {
  return gulp.src(paths.js)
    .pipe(changed('dist'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulpif(!isDev, eslint.failAfterError()))
    .pipe(gulpif(!isDev, eslint.results(({ warningCount }) => warningCount > 0 && process.exit(1))))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(getNpm())
    .pipe(gulp.dest('dist'))
}

const getNpm = function() {
  const cacheNames = {}
  return () => through.obj((file, encoding, callback) => {
    if (!file.isBuffer()) return callback(null, file)
    const contents = file.contents.toString()

    // 提取符合的包名
    const reg = /require\((.*?)\)/g
    const names = (contents.match(reg) || []).filter(i => /require\("(?!(\.|\/))/.test(i)).map(i => i.split('"')[1])

    // 引入包路径替换
    const zIndex = path.relative(file.dirname, file.base).split(path.sep).join('/')
    const newContents = contents.replace(/require\("(?!(\.|\/))/g, `require("${zIndex || '.'}/`) // 替换包的路径 非形如 . 或 / 开头
    file.contents = Buffer.from(newContents)

    // 构造入口
    const entry = {}
    names.map(name => !cacheNames[name] && (cacheNames[name] = entry[name] = name))
    // console.log(entry)

    // 打包
    if (!Object.keys(entry).length) return callback(null, file)
    webpack({ ...webpackConfig, entry }).run((err, stats) => callback(err || stats.hasErrors() ? JSON.stringify(entry, null, 2) : null, file))
  })
}()

function bundleLess() {
  return gulp.src(paths.less)
    .pipe(changed('dist', { extension: '.wxss' }))
    .pipe(stylelint({
      failAfterError: !isDev,
      reporters: [{ formatter: 'string', console: true }],
    }))
    .pipe(less({ globalVars: require('./src/style/less-var.js') }))
    .on('error', handleError)
    .pipe(postcss(
      [px2units({ multiple: 2 }), autoprefixer()].concat(isDev ? [] : cssnano())
    ))
    .pipe(rename({ extname: '.wxss' }))
    .pipe(gulp.dest('dist'))
}

function copyWxml() {
  return gulp.src(paths.wxml)
    .pipe(changed('dist'))
    .on('error', handleError)
    .pipe(gulp.dest('dist'))
}

function copyOther() {
  return gulp.src(paths.other)
    .pipe(changed('dist'))
    .on('error', handleError)
    .pipe(gulp.dest('dist'))
}

function clean() {
  return del('dist')
}

function watch() {
  gulp.watch(paths.js, gulp.series(bundleJS))
  gulp.watch(paths.less, gulp.series(bundleLess))
  gulp.watch(paths.wxml, gulp.series(copyWxml))
  gulp.watch(paths.other, gulp.series(copyOther))
}

gulp.task('dev', gulp.series(clean, gulp.parallel(bundleLess, copyWxml, copyOther, bundleJS), watch))
gulp.task('build', gulp.series(clean, gulp.parallel(bundleLess, copyWxml, copyOther, bundleJS)))
