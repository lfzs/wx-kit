import { wxp, token, HOST } from '@/util'

const BASE_URL = `${HOST}/app/api/v1`

function urlJoin(baseURL, url) {
  url = url[0] === '/' ? url.slice(1) : url
  return `${baseURL}/${url}`
}

async function request(config) {
  const t = token.getToken()
  if (t) config.header.Authorization = t

  const res = await wxp.request(config)
  return handleResponse(res, config)
}

async function handleResponse(res, config) {
  const { data, statusCode } = res

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
  return data
}

request.get = (url, data, config) => request({ ...config, url: urlJoin(BASE_URL, url), data, method: 'GET' })
request.post = (url, data, config) => request({ ...config, url: urlJoin(BASE_URL, url), data, method: 'POST' })
request.put = (url, data, config) => request({ ...config, url: urlJoin(BASE_URL, url), data, method: 'PUT' })
request.delete = (url, data, config) => request({ ...config, url: urlJoin(BASE_URL, url), data, method: 'DELETE' })
export default request
