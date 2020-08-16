import '@/helper/page'
import '@/helper/component'
import { reporter, updater } from '@/util'

App({
  onLaunch() { reporter() },
  onShow() { updater() },
})
