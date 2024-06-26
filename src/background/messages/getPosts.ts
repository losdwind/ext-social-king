import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const query = `
      query {
        creates(first: 15) {
          id
          assetId
          sender
          arTxId
          blockNumber
          blockTimestamp
        }
      }`

  fetch(
    process.env.PLASMO_PUBLIC_THE_GRAPH_ENDPOINT,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ query })
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("GraphQL response: ", data.data.creates)
      res.send({
        posts: data.data.creates
      })
    })
    .catch((error) => {
      res.send({
        posts: [],
        error: error.message
      })
    })
}

export default handler
