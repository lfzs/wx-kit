import { wxp, baseURL, token } from '@util'

async function request({ url = '', data = {}, method = 'GET', isNeedAuth = true }) { // isNeedAuth 用来全局配置是否需要带着 auth 访问接口
  const authorization = isNeedAuth ? await token.getToken() : ''
  const options = { url, data, method, header: { Authorization: authorization } }
  const res = await wxp.request(options)
  return handleResponse(res, options)
}

async function handleResponse(res, options) {
  const { data, statusCode, header } = res

  if (statusCode === 401) {
    // 向后台换取 token 的接口是否需要用加密数据。保留一种即可。需要
    const canGetUserInfo = await token.canGetUserInfo()
    if (canGetUserInfo) {
      const { code } = await wxp.login()
      const userInfo = await wxp.getUserInfo()
      await token.login(code, userInfo)
      return request(options)
    }

    // 不需要
    // const { code } = await wxp.login()
    // await token.login(code)
    // return request(options)
  }

  if (statusCode >= 400 && statusCode < 600) throw { ...data, statusCode } // 错误
  if (options.method === 'GET' && header['x-page']) res.meta = { per_page: +header['x-per-page'][0], total: +header['x-total'][0] }
  return res
}

request.get = (url, data, isNeedAuth) => request({ url: `${baseURL}/${url}`, data, isNeedAuth })
request.post = (url, data, isNeedAuth) => request({ url: `${baseURL}/${url}`, data, isNeedAuth, method: 'POST' })
request.put = (url, data, isNeedAuth) => request({ url: `${baseURL}/${url}`, data, isNeedAuth, method: 'PUT' })
export default request
