import { wxp, modal } from '@/util'

const API_SCOP = {
  // getUserInfo: ['scope.userInfo', '用户信息'], // 必须要按钮触发
  getLocation: ['scope.userLocation', '位置信息'],
  chooseLocation: ['scope.userLocation', '位置信息'],
  startLocationUpdateBackground: ['scope.userLocationBackground', '位置信息'],

  // 2020/9/25 后不需要授权了
  // https://developers.weixin.qq.com/community/develop/doc/000c0a0a590490590d0ba0c3d51801?blockType=1
  // chooseAddress: ['scope.address', '通讯地址'],
  // chooseInvoiceTitle: ['scope.invoiceTitle', '发票抬头'],
  // chooseInvoice: ['scope.invoice', '发票信息'],

  getWeRunData: ['scope.werun', '微信运动步数'],
  startRecord: ['scope.record', '麦克风'],

  saveImageToPhotosAlbum: ['scope.writePhotosAlbum', '相册'],
  saveVideoToPhotosAlbum: ['scope.writePhotosAlbum', '相册'],

  camera: ['scope.camera', '摄像头'], // camera 组件会主动调起授权，判断失败后再使用该弹窗
}

// 需要授权的 api 提前校验 => 保证后续成功调用
export default async function(apiName) {

  try {
    await wxp.authorize({ scope: API_SCOP[apiName][0] })
  } catch (error) {
    const errMsg = error?.errMsg
    if (errMsg.indexOf('authorize:fail') > -1) { // 拒绝了
      const { confirm } = await modal({ title: '提示', content: `授权失败，请在设置中打开${API_SCOP[apiName][1]}开关`, confirmText: '去打开' })
      if (confirm) {
        const { authSetting } = await wxp.openSetting()
        if (authSetting[API_SCOP[apiName][0]]) return
      }
    }
    throw error
  }

}
