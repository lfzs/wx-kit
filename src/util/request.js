import { wxp, baseURL, token } from '@util'

function urlJoin(baseURL, url) {
  url = url[0] === '/' ? url.slice(1) : url
  return `${baseURL}/${url}`
}

async function request(config) {

  const Authorization = (config.isNeedAuth ?? true) ? await token.getToken() : '' // isNeedAuth 用来配置是否需要带着 token 信息访问接口
  config.header = { ...config.header, Authorization }

  const res = await wxp.request(config)
  return handleResponse(res, config)
}

async function handleResponse(res, config) {
  const { data, statusCode, header } = res

  if (statusCode === 401) {
    // 向后台换取 token 的接口是否需要用加密数据。保留一种即可。需要
    const canGetUserInfo = await token.canGetUserInfo()
    if (canGetUserInfo) {
      const { code } = await wxp.login()
      const userInfo = await wxp.getUserInfo()
      await token.login(code, userInfo)
      return request(config)
    }

    // 不需要
    // const { code } = await wxp.login()
    // await token.login(code)
    // return request(config)
  }

  if (statusCode >= 400 && statusCode < 600) throw { ...data, statusCode } // 错误
  if (config.method === 'GET' && header['X-Page']) res.meta = { per_page: +header['X-Per-Page'], total: +header['X-Total'] }
  return res
}

request.get = (url, data, config) => request({ ...config, url: urlJoin(baseURL, url), data, method: 'GET' })
request.post = (url, data, config) => request({ ...config, url: urlJoin(baseURL, url), data, method: 'POST' })
request.put = (url, data, config) => request({ ...config, url: urlJoin(baseURL, url), data, method: 'PUT' })
request.delete = (url, data, config) => request({ ...config, url: urlJoin(baseURL, url), data, method: 'DELETE' })
export default request
