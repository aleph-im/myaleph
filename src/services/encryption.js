import { encryption } from 'aleph-js'

export function encrypt_content(former, keys, public_key) {
  for (let key of keys) {
    if ((former[key] !== undefined) && (former[key] !== null)) {
      former[key] = encryption.encrypt(public_key, former[key])
    }
  }
}

export function decrypt_content(former, keys, account) {
  for (let key of keys) {
    if ((former[key] !== undefined) && (former[key] !== null)) {
      try {
        former[key] = encryption.decrypt(account, former[key])
      } catch (e) {
        console.error("Can't decrypt field", key, e)
      }
    }
  }
}