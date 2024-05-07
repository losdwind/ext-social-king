import {
  createPublicClient,
  createWalletClient,
  custom,
  getAddress,
  getContract,
  http,
  type Address,
  type Chain,
  type PublicClient,
  type WalletClient
} from "viem"
import { optimism } from "viem/chains"

import { Storage } from "@plasmohq/storage"

import { bodhiAbi } from "~abi/bodhiAbi"

const storage = new Storage()

const publicClient = createPublicClient({
  chain: optimism as Chain,
  transport: http(
    "https://rpc.particle.network/evm-chain?chainId=1&projectUuid=5cf89b55-8b00-4c19-9844-7729a490a5a2&projectKey=cR2VL9YnJzoWbT2Zgow5W728kUecEuTciTpwKBQO"
  )
})

const walletClient = createWalletClient({
  chain: optimism as Chain,
  transport:http(
    "https://rpc.particle.network/evm-chain?chainId=1&projectUuid=5cf89b55-8b00-4c19-9844-7729a490a5a2&projectKey=cR2VL9YnJzoWbT2Zgow5W728kUecEuTciTpwKBQO"
  )
})

// export const getWalletAddress = async () => {
//   if (typeof window.ethereum !== "undefined") {
//     const [account] = await walletClient.requestAddresses()
//     await storage.set("account", account)
//     return account
//   } else {
//     console.log("window.ethereum object do not exist")
//   }
// }

export const getLatestPrice = async (asset: number, share: number) => {
  const buyPrice = await publicClient.readContract({
    address: "0x2AD82A4E39Bac43A54DdfE6f94980AAf0D1409eF",
    abi: bodhiAbi,
    functionName: "getBuyPrice",
    args: [BigInt(asset), BigInt(share)]
  })
  return buyPrice
}

export const getPool = async (asset: number) => {
  const value = await publicClient.readContract({
    address: "0x2AD82A4E39Bac43A54DdfE6f94980AAf0D1409eF",
    abi: bodhiAbi,
    functionName: "pool",
    args: [BigInt(asset)]
  })
  return value
}

// Define these functions if they involve more complex logic
export const onBuyShare = async (
  account: Address,
  asset: number,
  share: number
) => {
  if (!account) {
    const [account] = await walletClient.requestAddresses()
    // setAccount(account)
  }
  const { request } = await publicClient.simulateContract({
    account,
    address: "0x2AD82A4E39Bac43A54DdfE6f94980AAf0D1409eF",
    abi: bodhiAbi,
    functionName: "buy",
    args: [BigInt(asset), BigInt(share)]
  })
  await walletClient.writeContract(request)
  console.log("Buying shares")
}

export const onSellShare = async (
  account: Address,
  asset: number,
  share: number
) => {
  if (!account) {
    const [account] = await walletClient.requestAddresses()
    // setAccount(account)
  }

  const { request } = await publicClient.simulateContract({
    account,
    address: "0x2AD82A4E39Bac43A54DdfE6f94980AAf0D1409eF",
    abi: bodhiAbi,
    functionName: "sell",
    args: [BigInt(asset), BigInt(share)]
  })

  await walletClient.writeContract(request)
  console.log("Selling shares")
}

