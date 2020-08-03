import { request, wxp } from '@util'

export default new class {

  #meta = null

  _clearMeta() {
    this.#meta = null
  }

  async _setMeta() {
    const { data } = await request.get('qiniu_meta')
    this.#meta = data
    setTimeout(() => this._clearMeta(), data.expires_in * 1000)
  }

  async uploadImage(filePath = '') {
    if (!this.#meta) await this._setMeta()
    const { bucket_domain, token } = this.#meta

    try {
      const { data } = await wxp.uploadFile({ url: 'https://upload-z2.qiniup.com', name: 'file', filePath, formData: { token } })
      const key = JSON.parse(data).key
      return `https://${bucket_domain}/${key}`
    } catch (error) {
      this._clearMeta()
      return '' // 上传失败返回空字符串
    }

  }
}
