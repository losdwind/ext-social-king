import { gaslessFundAndUploadString } from "@/lib/gaslessFundAndUpload"
import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("call uploadAsset successfully")

    console.log("account",req.body)

    gaslessFundAndUploadString(req.body.content, req.body.tags)
    res.send({
      res: "ok"
    })
}

export default handler
