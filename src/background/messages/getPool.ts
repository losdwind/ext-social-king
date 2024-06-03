import { createPublicClient, http, toHex } from "viem"
import { optimism, type Chain } from "viem/chains"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { socialKingAbi } from "~core/socialKingAbi"

const publicClient = createPublicClient({
  chain: optimism as Chain,
  transport: http(process.env.PLASMO_PUBLIC_ALCHEMY_RPC)
})

const getPool = async (asset: number) => {
  const value = await publicClient.readContract({
    address: process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS,
    abi: socialKingAbi,
    functionName: "pool",
    args: [BigInt(asset)]
  })
  return value
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const pool = await getPool(req.body.asset)
  res.send({
    pool
  })
}

export default handler
