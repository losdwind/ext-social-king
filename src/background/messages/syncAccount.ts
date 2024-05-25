import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("call syncAccount successfully")
  //   const storage = new Storage()
  //   await storage.set("account", req.body.account)
  //   console.log("account",req.body.account)
  //   storage.getItem
  //   console.log("account",req.body.account)

  //   res.send({
  //     res: "ok"
  //   })
}

export default handler
