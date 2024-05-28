import { createPublicClient, http, toHex } from "viem"
import { optimism, type Chain } from "viem/chains"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { bodhiAbi } from "~core/bodhiAbi"

const publicClient = createPublicClient({
  chain: optimism as Chain,
  transport: http(
    "https://opt-mainnet.g.alchemy.com/v2/0p_oTmDooWT0yBlTN3nZf3p45XHZhkE_"
  )
})

const getPool = async (asset: number) => {
  const value = await publicClient.readContract({
    address: toHex(process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS),
    abi: bodhiAbi,
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
