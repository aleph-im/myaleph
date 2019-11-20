import axios from 'axios'

export async function get_nuls_balance_info(address, explorer_url) {
  let response = await axios.get(`${explorer_url}/addresses/${address}.json`)
  let balance_info = {
    'ALEPH': 0,
    'NULS': 0
  }
  if ((response.data.unspent_info.unspent_value !== undefined))
  {
    balance_info['NULS'] = response.data.unspent_info.unspent_value / (10**8)
  }
  for (let holding of response.data.token_holdings) {
    balance_info[holding.symbol] = holding.balance / (10**holding.decimals)
  }
  return balance_info
}

export async function get_ethereum_balance_info(address, explorer_url) {
  let response = await axios.get(`${explorer_url}/getAddressInfo/${address}?apiKey=freekey`)

  let balance_info = {
    'ALEPH': 0,
    'ETH': 0
  }
  if ((response.data.ETH.balance !== undefined))
  {
    balance_info['ETH'] = response.data.ETH.balance
  }
  for (let holding of response.data.tokens) {
    let decimals = Number(holding.tokenInfo.decimals)
    balance_info[holding.tokenInfo.symbol] = holding.balance / (10**decimals)
  }
  return balance_info
}