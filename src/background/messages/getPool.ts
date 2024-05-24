import type { PlasmoMessaging } from "@plasmohq/messaging"
import { createPublicClient, http } from "viem"
import { optimism, type Chain } from "viem/chains"
import { bodhiAbi } from "~core/bodhiAbi"

const publicClient = createPublicClient({
  chain: optimism as Chain,
  transport: http("https://opt-mainnet.g.alchemy.com/v2/0p_oTmDooWT0yBlTN3nZf3p45XHZhkE_")
})

const getPool = async (asset: number) => {
  const value = await publicClient.readContract({
    address: "0x2AD82A4E39Bac43A54DdfE6f94980AAf0D1409eF",
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
