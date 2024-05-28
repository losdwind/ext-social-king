import { createPublicClient, http, stringToBytes, toBytes, toHex } from "viem"
import { optimism, type Chain } from "viem/chains"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { bodhiAbi } from "~core/bodhiAbi"

const publicClient = createPublicClient({
  chain: optimism as Chain,
  transport: http(
    "https://opt-mainnet.g.alchemy.com/v2/0p_oTmDooWT0yBlTN3nZf3p45XHZhkE_"
  )
})

const getAssetId = async (txId: string) => {
  const assetId = await publicClient.readContract({
    address: toHex(process.env.PLASMO_PUBLIC_CONTRACT_ADDRESS),
    abi: bodhiAbi,
    functionName: "txToAssetId",
    args: [toHex(txId)]
  })
  return assetId
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const assetId = await getAssetId(req.body.txId)
  res.send({
    assetId
  })
}

export default handler
