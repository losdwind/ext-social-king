import { createPublicClient, http, toHex } from "viem"
import { optimism, type Chain } from "viem/chains"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { socialKingAbi } from "~core/socialKingAbi"

const publicClient = createPublicClient({
  chain: optimism as Chain,
  transport: http(
    "https://opt-mainnet.g.alchemy.com/v2/0p_oTmDooWT0yBlTN3nZf3p45XHZhkE_"
  )
})

const getLatestPrice = async (asset: number, share: number) => {
  const buyPrice = await publicClient.readContract({
    address: toHex(process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS),
    abi: socialKingAbi,
    functionName: "getBuyPrice",
    args: [BigInt(asset), BigInt(share)]
  })
  return buyPrice
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const buyPrice = await getLatestPrice(req.body.asset, req.body.share)
  res.send({
    buyPrice
  })
}

export default handler
