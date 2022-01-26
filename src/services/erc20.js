const ethers = require('ethers')

// A Human-Readable ABI; any supported ABI format could be used
const abi = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (boolean)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)'
]

export async function get_erc20_balance (provider, contract, address) {
  console.log(provider)
  const erc20 = new ethers.Contract(contract, abi, provider)
  console.log(erc20)
  const value = await erc20.functions.balanceOf(address)
  console.log(value)
  return value
}
