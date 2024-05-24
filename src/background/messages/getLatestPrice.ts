import type { PlasmoMessaging } from "@plasmohq/messaging"
import { createPublicClient, http } from "viem"
import { optimism, type Chain } from "viem/chains"
import { bodhiAbi } from "~core/bodhiAbi"

const publicClient = createPublicClient({
  chain: optimism as Chain,
  transport: http("https://opt-mainnet.g.alchemy.com/v2/0p_oTmDooWT0yBlTN3nZf3p45XHZhkE_")
})

const getLatestPrice = async (asset: number, share: number) => {
  const buyPrice = await publicClient.readContract({
    address: "0x2AD82A4E39Bac43A54DdfE6f94980AAf0D1409eF",
    abi: bodhiAbi,
    functionName: "getBuyPrice",
    args: [BigInt(asset), BigInt(share * 10 ** 18)]
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
