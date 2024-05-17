import type { PlasmoMessaging } from "@plasmohq/messaging"

import { onBuyShare } from "~core/viem"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  //   await onBuyShare(req.body.account, req.body.asset, req.body.share)
  console.log("message received")
  chrome.scripting.executeScript(
    {
      target: {
        tabId: req.tabId
      },
      world: "MAIN", // MAIN in order to access the window object
      func: onBuyShare,
      args: [
        "0x22271C6e574f36149907eb7753C07d0bEA7Ba98c",
        req.body.asset,
        req.body.share
      ]
    },
    () => {
      console.log("Background script got callback after injection")
      res.send({})
    }
  )
}
export default handler

// const inject = async (tabId: number) => {
//     chrome.scripting.executeScript(
//       {
//         target: {
//           tabId
//         },
//         world: "MAIN", // MAIN in order to access the window object
//         func: windowChanger
//       },
//       () => {
//         console.log("Background script got callback after injection")
//       }
//     )
//   }
