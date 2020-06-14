// 从 error 中获取 message
export default function(error, defaultMessage) {
  if (typeof error === 'string') return error
  return error.message || error.errMsg || error.error_message || error.error || defaultMessage || '请求失败, 请重试'
}
