export default function(target, name, descriptor) { // target 为类的原型对象
  const { value } = descriptor
  if (typeof value !== 'function') throw new Error(`${name} is not a function`)

  target.tryFetchData = function(...args) { return this._state === 'done' ? this.data : this.fetchData(...args) } // 注意:请求过，只会返回 data 字段

  descriptor.value = function* (...args) {
    this._state = 'pending'
    try {
      const res = yield value.apply(this, args)
      this._state = 'done'
      return this.data = res.data ?? res
    } catch (error) {
      this._state = 'error'
      throw error
    }
  }
}
