import './util/helper/page'
import './util/helper/component'
import { reporter, updater } from '@util'

App({
  onLaunch() { reporter() },
  onShow() { updater() },
})
