import { gaslessFundAndUploadString } from "@/lib/gaslessFundAndUpload"
import getTx from "@/lib/getTx"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("call getTxId successfully")

  const tx = await getTx(req.body.tags)
  console.log("tx", tx)
  res.send({
    txId: tx ? tx.id : null
  })
}

export default handler


