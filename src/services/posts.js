
import { encrypt_content, decrypt_content } from '../services/encryption.js'
import { aggregates, posts, encryption, store } from 'aleph-js'

export async function update_post(postitem, new_values, encrypted_fields, account, api_server, channel) {
  let post_content = {}
  Object.assign(post_content, postitem.content, new_values)

  let unencrypted_content = {}
  Object.assign(unencrypted_content, post_content)

  if ((post_content.private === undefined)||(post_content.private)) {
    post_content['private'] = true
    encrypt_content(post_content, encrypted_fields, account['public_key'])
  }

  let msg = await posts.submit(
    account.address, 'amend', post_content,
    {channel: channel,
      api_server: api_server,
      account: account,
      ref:postitem.hash})
  msg.hash = postitem.hash
  msg.original_type = postitem.original_type
  msg.content = unencrypted_content
  msg.original_ref = postitem.original_ref
  return msg
}