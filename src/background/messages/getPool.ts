import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getPool } from "~core/viem"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const pool = await getPool(req.body.asset)
  res.send({
    pool
  })
}

export default handler
