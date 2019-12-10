import { encryption, store } from 'aleph-js'
var createObjectURL = (window.URL || window.webkitURL || {}).createObjectURL || function(){};
var revokeObjectURL = (window.URL || window.webkitURL || {}).revokeObjectURL || function(){};

export async function retrieve_file(filepost, account, api_server) {
  let content = await store.retrieve(filepost.content.hash, {api_server: api_server})
  if (content !== null) {
    if (filepost.content.private) {
        content = encryption.decrypt(account, content, {as_hex: false, as_string: false})
    }
  
    const data = new Blob([content], {type: filepost.content.mimetype})
    return data
  } else {
    return null
  }
}

export async function retrieve_file_url(filepost, account, api_server,
  {revoke_timeout = null} = {}) {
  const data = await retrieve_file(filepost, account, api_server)
  if (data !== null) {
    const objurl = createObjectURL(data)
    if (revoke_timeout) {
      setTimeout(function(){
        // For Firefox it is necessary to delay revoking the ObjectURL
        revokeObjectURL(objurl);
      }, revoke_timeout);
    }
    
    return objurl
  } else {
    return null
  }
}

export async function navigate_to_file(filepost, account, api_server,
  {revoke_timeout = 1000, download = false} = {}) {
  const data = await retrieve_file(filepost, account, api_server)
  let link = document.createElement('a')
  link.href = createObjectURL(data)
  if (download)
    link.download=filepost.content.filename
  else {
    link.target='_blank'
    link.rel='nofollow'
  }
  link.click()
  if (revoke_timeout) {
    setTimeout(function(){
      // For Firefox it is necessary to delay revoking the ObjectURL
      revokeObjectURL(link.href);
    }, revoke_timeout);
  }
}