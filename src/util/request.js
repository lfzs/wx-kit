import { wxp, baseURL, token } from '@util'

function urlJoin(baseURL, url) {
  url = url[0] === '/' ? url.slice(1) : url
  return `${baseURL}/${url}`
}

async function request({ url = '', data = {}, method = 'GET', isNeedAuth = true }) { // isNeedAuth 用来配置是否需要带着 auth 信息访问接口
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
  if (options.method === 'GET' && header['X-Page']) res.meta = { per_page: +header['X-Per-Page'], total: +header['X-Total'] }
  return res
}

request.get = (url, data, isNeedAuth) => request({ url: urlJoin(baseURL, url), data, isNeedAuth })
request.post = (url, data, isNeedAuth) => request({ url: urlJoin(baseURL, url), data, isNeedAuth, method: 'POST' })
request.put = (url, data, isNeedAuth) => request({ url: urlJoin(baseURL, url), data, isNeedAuth, method: 'PUT' })
request.delete = (url, data, isNeedAuth) => request({ url: urlJoin(baseURL, url), data, isNeedAuth, method: 'DELETE' })
export default request
