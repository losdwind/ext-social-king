import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getLatestPrice } from "~core/viem"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const buyPrice = await getLatestPrice(req.body.asset, req.body.share)
  res.send({
    buyPrice
  })
}

export default handler
