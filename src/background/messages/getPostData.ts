import axios from "axios"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  // fetch data from arweave with transactionID
  
  // const url = `https://arweave.net/${req.body.transactionId}`
  // console.log(url)

  // fetch(url)
  //   .then((response) => response.text())
  //   .then((markdown) => {
  //     res.send({
  //       markdown: markdown
  //     })
  //   })
  //   .catch((error) => {
  //     console.error("Error:", error)
  //     res.send({
  //       error: error
  //     })
  //   })
}

export default handler
