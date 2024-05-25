import Arweave from "arweave"

import type { PlasmoMessaging } from "@plasmohq/messaging"

let arweave

if (process.env.REACT_APP_WORKSPACE_URL) {
  /* if in gitpod */
  let host = process.env.REACT_APP_WORKSPACE_URL.replace("https://", "")
  arweave = Arweave.init({
    host,
    protocol: "https"
  })
} else {
  /* localhost / Arlocal */
  arweave = Arweave.init({})
}

/* to use mainnet */
// const arweave = Arweave.init({
//   host: 'arweave.net',
//   port: 443,
//   protocol: 'https'
//

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const formData = req.body.data
    let transaction = await arweave.createTransaction({ data: formData })
    await arweave.transactions.sign(transaction)
    let uploader = await arweave.transactions.getUploader(transaction)

    while (!uploader.isComplete) {
      await uploader.uploadChunk()
      console.log(
        `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
      )
    }
    res.send({
      transactionId: transaction.id
    })
  } catch (err) {
    console.log("error: ", err)
  }
}

export default handler
