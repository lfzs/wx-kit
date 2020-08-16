import { wxp } from '@/util'

export default function modal(options) {
  return (typeof options === 'string') ? wxp.showModal({ title: '提示', content: options }) : wxp.showModal({ title: '提示', ...options })
}
