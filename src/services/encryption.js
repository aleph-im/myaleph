import { encryption } from 'aleph-js'

export async function encrypt_content_for_self(former, keys, account) {
  let curve = "secp256k1"
  if (account['type'] == 'NEO')
    curve = "secp256r1"
  return await encrypt_content(
    former, keys, account['public_key'],
    {'curve': curve})
}

export async function encrypt_content(
  former, keys, public_key,  { curve = "secp256k1" } = {}) {
  for (let key of keys) {
    if ((former[key] !== undefined) && (former[key] !== null)) {
      former[key] = await encryption.encrypt(
        public_key, former[key], {'curve': curve})
    }
  }
}

export async function decrypt_content(former, keys, account) {
  for (let key of keys) {
    if ((former[key] !== undefined) && (former[key] !== null)) {
      try {
        former[key] = await encryption.decrypt(account, former[key])
      } catch (e) {
        console.error("Can't decrypt field", key)
      }
    }
  }
}