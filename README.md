# mini-kit 小程序脚手架

## 使用

- 补充 `project.config.json.example` 的 `projectname` 和 `appid`

- `cp project.config.json.example project.config.json`

- `yarn install && yarn start`

- 使用微信小程序开发者工具打开当前目录即可

## util/page.js

- 对小程序的 Page 进行一层拦截，注入 mobx 的 autorun
- 将 onLoad 挂载到页面上，使用组件 loading-screen 调用
- 然后在 app.js 中引入，这样所有的页面使用的 Page 就是这个被修饰过的

## util/fetch-action.js

- 用来装饰 store 的 fetchData 方法，监听请求是否完成，并添加 tryFetchData 方法

## store/hepler/Cache.js

- 将需要缓存的 store 缓存到内存中

## store/helper/List.js

- 列表 store 可继承使用

## 命名规范

- 文件/文件夹命名：单数小写、中划线分割、构造函数的文件首字母大写(eg: Item-detail-store.js)

## 注意事项

- 修改 Mobx 的 observable 强制使用 action

- gulp 在新建或者删除文件时，`gulp.watch` 并不会执行，需要重新执行 gulp 编译操作

- 使用 CI 部署时，需要补充 `private.key` 文件
