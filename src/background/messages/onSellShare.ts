import { request } from "http"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { onSellShare } from "~core/viem"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  await onSellShare(req.body.account, req.body.asset, req.body.share)
  res.send({})
}

export default handler
