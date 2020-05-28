export default class {
  static #caches = Object.create(null)

  static findOrCreate(id) {
    this._id = this._id || Math.random().toString(36).slice(2) // 向构造函数添加 _id 标志

    const key = `${this._id}${id}`
    let value = this.#caches[key]

    if (!value) {
      value = new this(id)
      value.id = id
      this.#caches[key] = value
    }

    return this.#caches[key]
  }
}
