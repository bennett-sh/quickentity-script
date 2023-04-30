
import md5 from 'md5'

const HASH_PATTERN = /[A-F0-9]{16}/i

export const isHash = (data: string) => HASH_PATTERN.test(data)
export const normalizeToHash = (path: string) => isHash(path) ? path : hashPath(path)
export const hashPath = (path: string) => ("00" + md5(path).slice(2, 16)).toUpperCase()
